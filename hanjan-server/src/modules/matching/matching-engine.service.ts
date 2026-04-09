import { Injectable, Logger } from '@nestjs/common';
import { ActivityTiming } from '@prisma/client';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';

const SUGGESTION_KEY = (activityId: string) => `match:suggestions:${activityId}`;

const COMPATIBLE_TIMINGS: Record<ActivityTiming, ActivityTiming[]> = {
  [ActivityTiming.NOW]: [ActivityTiming.NOW, ActivityTiming.THIRTY_MIN],
  [ActivityTiming.THIRTY_MIN]: [ActivityTiming.NOW, ActivityTiming.THIRTY_MIN, ActivityTiming.ONE_HOUR],
  [ActivityTiming.ONE_HOUR]: [ActivityTiming.THIRTY_MIN, ActivityTiming.ONE_HOUR, ActivityTiming.TONIGHT],
  [ActivityTiming.TONIGHT]: [ActivityTiming.ONE_HOUR, ActivityTiming.TONIGHT, ActivityTiming.CUSTOM],
  [ActivityTiming.CUSTOM]: [ActivityTiming.TONIGHT, ActivityTiming.CUSTOM],
};

@Injectable()
export class MatchingEngineService {
  private readonly logger = new Logger(MatchingEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getSuggestions(activityId: string, requesterId: string): Promise<string[]> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });
    if (!activity) return [];

    const { category, timing, radiusKm, locationLat, locationLng } = activity;
    const compatibleTimings = COMPATIBLE_TIMINGS[timing] ?? [timing];
    const rejectedUsers = await this.getRejectedUsers(activityId);

    const candidates = await this.prisma.activity.findMany({
      where: {
        status: 'ACTIVE',
        category,
        timing: { in: compatibleTimings },
        id: { not: activityId },
        userId: { not: requesterId, notIn: rejectedUsers },
        expiresAt: { gt: new Date() },
      },
      include: {
        user: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const nearby = candidates.filter((a) => {
      const dist = this.haversineKm(locationLat, locationLng, a.locationLat, a.locationLng);
      return dist <= radiusKm;
    });

    return nearby.slice(0, 3).map((a) => a.userId);
  }

  async recordRejection(activityId: string, rejectedUserId: string): Promise<void> {
    const key = SUGGESTION_KEY(activityId);
    await this.redis.get().sadd(key, rejectedUserId);
    await this.redis.get().expire(key, 24 * 60 * 60);
    this.logger.log(`Rejection recorded: activity=${activityId}, user=${rejectedUserId}`);
  }

  async getRejectedUsers(activityId: string): Promise<string[]> {
    return this.redis.get().smembers(SUGGESTION_KEY(activityId));
  }

  async getSuggestionCount(activityId: string): Promise<number> {
    const key = SUGGESTION_KEY(activityId);
    return this.redis.get().scard(key);
  }

  private haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
