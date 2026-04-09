import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';

const TIMER_KEY = (roomId: string) => `chat:timer:${roomId}`;
const CONFIRM_KEY = (roomId: string) => `chat:confirm:${roomId}`;

@Injectable()
export class ChatTimerService {
  private readonly logger = new Logger(ChatTimerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async startTimer(roomId: string, durationSeconds = 30 * 60): Promise<void> {
    const expiresAt = Date.now() + durationSeconds * 1000;
    await this.redis.get().set(TIMER_KEY(roomId), expiresAt, 'EX', durationSeconds + 60);
    this.logger.log(`Timer started for room ${roomId}, expires in ${durationSeconds}s`);
  }

  async getRemainingSeconds(roomId: string): Promise<number> {
    const raw = await this.redis.get().get(TIMER_KEY(roomId));
    if (!raw) {
      const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
      if (!room) return 0;
      const remaining = Math.floor((room.timerExpiresAt.getTime() - Date.now()) / 1000);
      return Math.max(0, remaining);
    }
    const expiresAt = parseInt(raw, 10);
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  }

  async recordConfirm(roomId: string, userId: string): Promise<string[]> {
    const key = CONFIRM_KEY(roomId);
    const existing = await this.redis.get().smembers(key);
    if (!existing.includes(userId)) {
      await this.redis.get().sadd(key, userId);
      await this.redis.get().expire(key, 35 * 60);
    }
    return this.redis.get().smembers(key);
  }

  async getConfirmedUsers(roomId: string): Promise<string[]> {
    return this.redis.get().smembers(CONFIRM_KEY(roomId));
  }

  async clearTimer(roomId: string): Promise<void> {
    await this.redis.get().del(TIMER_KEY(roomId));
    await this.redis.get().del(CONFIRM_KEY(roomId));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async expireTimedOutRooms(): Promise<void> {
    try {
      const expiredRooms = await this.prisma.chatRoom.findMany({
        where: {
          status: 'ACTIVE',
          timerExpiresAt: { lt: new Date() },
        },
      });

      for (const room of expiredRooms) {
        await this.prisma.chatRoom.update({
          where: { id: room.id },
          data: { status: 'TIMER_EXPIRED', closedAt: new Date() },
        });
        await this.clearTimer(room.id);
        this.logger.log(`Room ${room.id} expired and closed`);
      }
    } catch (err) {
      this.logger.error('Error expiring rooms', err);
    }
  }
}
