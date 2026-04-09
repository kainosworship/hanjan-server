import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { ActivityCategory, ActivityTiming, GroupSize } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivitiesDto } from './dto/query-activities.dto';
import { addHours } from 'date-fns';

interface NearbyActivityRow {
  id: string;
  userId: string;
  category: string;
  timing: string;
  scheduledAt: Date;
  radiusKm: number;
  groupSize: string;
  message: string | null;
  locationLat: number;
  locationLng: number;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  distanceMeters: number;
  nickname: string | null;
  profileImageUrl: string | null;
  isIdVerified: boolean;
  isSelfieVerified: boolean;
  overallScore: number | null;
}

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(userId: string, dto: CreateActivityDto) {
    const daily = await this.getDailyCount(userId);
    if (daily.count >= daily.limit) {
      throw new ForbiddenException(
        `오늘 활동 생성 한도(${daily.limit}회)에 도달했습니다. 내일 다시 시도해주세요.`,
      );
    }
    const ttlSeconds = 2 * 60 * 60;
    const expiresAt = addHours(new Date(), 2);
    const activity = await this.prisma.activity.create({
      data: {
        userId,
        category: dto.category.toUpperCase() as ActivityCategory,
        timing: this.mapTiming(dto.timing),
        scheduledAt: new Date(dto.scheduledAt),
        radiusKm: dto.radiusKm,
        groupSize: this.mapGroupSize(dto.groupSize),
        message: dto.message,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng,
        expiresAt,
      },
    });
    await this.redis.set(`activity:expiry:${activity.id}`, activity.id, ttlSeconds);
    return activity;
  }

  async getNearby(userId: string, query: QueryActivitiesDto) {
    const { lat, lng, radiusKm = 5 } = query;
    const radiusMeters = radiusKm * 1000;

    const rows = await this.prisma.$queryRaw<NearbyActivityRow[]>`
      SELECT
        a.id,
        a."userId",
        a.category,
        a.timing,
        a."scheduledAt",
        a."radiusKm",
        a."groupSize",
        a.message,
        a."locationLat",
        a."locationLng",
        a.status,
        a."createdAt",
        a."expiresAt",
        ST_Distance(
          ST_MakePoint(a."locationLng", a."locationLat")::geography,
          ST_MakePoint(${lng}::float8, ${lat}::float8)::geography
        ) AS "distanceMeters",
        u.nickname,
        u."profileImageUrl",
        u."isIdVerified",
        u."isSelfieVerified",
        ms."overallScore"
      FROM "Activity" a
      JOIN "User" u ON u.id = a."userId"
      LEFT JOIN "MannerScore" ms ON ms."userId" = a."userId"
      WHERE
        a.status = 'ACTIVE'
        AND a."userId" != ${userId}
        AND a."expiresAt" > NOW()
        AND ST_DWithin(
          ST_MakePoint(a."locationLng", a."locationLat")::geography,
          ST_MakePoint(${lng}::float8, ${lat}::float8)::geography,
          ${radiusMeters}::float8
        )
      ORDER BY a."createdAt" DESC
      LIMIT 50
    `;

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      category: row.category.toLowerCase(),
      timing: this.mapTimingToShared(row.timing),
      scheduledAt: row.scheduledAt,
      radiusKm: row.radiusKm,
      groupSize: this.mapGroupSizeToShared(row.groupSize),
      message: row.message ?? undefined,
      locationLat: row.locationLat,
      locationLng: row.locationLng,
      status: row.status.toLowerCase(),
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      distanceMeters: Number(row.distanceMeters),
      user: {
        nickname: row.nickname ?? '익명',
        mannerScore: row.overallScore ?? 4.0,
        verifiedBadge: row.isIdVerified,
        profileImageUrl: row.profileImageUrl ?? undefined,
        isIdVerified: row.isIdVerified,
        isSelfieVerified: row.isSelfieVerified,
      },
    }));
  }

  async getMyActivities(userId: string) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDailyCount(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await this.prisma.activity.count({
      where: { userId, createdAt: { gte: today } },
    });
    const isPlus = await this.isPlus(userId);
    return { count, limit: isPlus ? 5 : 2 };
  }

  private async isPlus(userId: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
      select: { status: true },
    });
    return sub?.status === 'ACTIVE';
  }

  async findById(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { user: { select: { nickname: true, profileImageUrl: true, mannerScore: true } } },
    });
    if (!activity) throw new NotFoundException('활동을 찾을 수 없습니다.');
    return activity;
  }

  async cancel(userId: string, id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('활동을 찾을 수 없습니다.');
    if (activity.userId !== userId) throw new ForbiddenException();
    await this.redis.del(`activity:expiry:${id}`);
    return this.prisma.activity.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async expireActivities(): Promise<void> {
    try {
      const result = await this.prisma.activity.updateMany({
        where: {
          status: 'ACTIVE',
          expiresAt: { lt: new Date() },
        },
        data: { status: 'EXPIRED' },
      });
      if (result.count > 0) {
        this.logger.log(`Expired ${result.count} activities`);
      }
    } catch (err) {
      this.logger.error('Failed to expire activities', err);
    }
  }

  private mapTiming(timing: string): ActivityTiming {
    const map: Record<string, ActivityTiming> = {
      now: ActivityTiming.NOW,
      '30min': ActivityTiming.THIRTY_MIN,
      '1hour': ActivityTiming.ONE_HOUR,
      tonight: ActivityTiming.TONIGHT,
      custom: ActivityTiming.CUSTOM,
    };
    return map[timing] ?? ActivityTiming.NOW;
  }

  private mapTimingToShared(timing: string): string {
    const map: Record<string, string> = {
      NOW: 'now',
      THIRTY_MIN: '30min',
      ONE_HOUR: '1hour',
      TONIGHT: 'tonight',
      CUSTOM: 'custom',
    };
    return map[timing] ?? timing.toLowerCase();
  }

  private mapGroupSize(size: string): GroupSize {
    const map: Record<string, GroupSize> = {
      '1:1': GroupSize.ONE_ON_ONE,
      '2:2': GroupSize.TWO_ON_TWO,
      group: GroupSize.GROUP,
    };
    return map[size] ?? GroupSize.ONE_ON_ONE;
  }

  private mapGroupSizeToShared(groupSize: string): string {
    const map: Record<string, string> = {
      ONE_ON_ONE: '1:1',
      TWO_ON_TWO: '2:2',
      GROUP: 'group',
    };
    return map[groupSize] ?? groupSize;
  }
}
