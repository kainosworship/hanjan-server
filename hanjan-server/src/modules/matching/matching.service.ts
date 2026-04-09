import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { MatchingEngineService } from './matching-engine.service';
import { ChatTimerService } from '../chat/chat-timer.service';
import { addMinutes } from 'date-fns';

const MAX_MATCH_ROTATIONS = 3;
const TIMER_DURATION_SECONDS = 30 * 60;

@Injectable()
export class MatchingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchingEngine: MatchingEngineService,
    private readonly chatTimerService: ChatTimerService,
  ) {}

  async requestMatch(requesterId: string, activityId: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity || activity.status !== 'ACTIVE') {
      throw new BadRequestException('활동이 유효하지 않습니다.');
    }
    if (activity.userId === requesterId) {
      throw new BadRequestException('자신의 활동에는 매칭 요청을 할 수 없습니다.');
    }

    const rejectionCount = await this.matchingEngine.getSuggestionCount(activityId);
    if (rejectionCount >= MAX_MATCH_ROTATIONS) {
      throw new BadRequestException('이 활동에 대한 매칭 시도 한도에 도달했습니다.');
    }

    const rejectedUsers = await this.matchingEngine.getRejectedUsers(activityId);
    if (rejectedUsers.includes(requesterId)) {
      throw new BadRequestException('이미 이 활동에 매칭 요청을 거절한 기록이 있습니다.');
    }

    const existing = await this.prisma.match.findFirst({
      where: { activityId, requesterId, status: { in: ['PENDING', 'ACCEPTED'] } },
    });
    if (existing) {
      throw new BadRequestException('이미 매칭 요청이 존재합니다.');
    }

    const match = await this.prisma.match.create({
      data: {
        activityId,
        requesterId,
        accepterId: activity.userId,
        status: 'PENDING',
      },
    });

    const suggestions = await this.matchingEngine.getSuggestions(activityId, requesterId);
    return { ...match, suggestedUserIds: suggestions };
  }

  async respondMatch(userId: string, matchId: string, accept: boolean) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match || match.accepterId !== userId) {
      throw new NotFoundException('매칭을 찾을 수 없습니다.');
    }

    if (accept) {
      const dailyAccepted = await this.getDailyCount(userId);
      if (dailyAccepted.count >= dailyAccepted.limit) {
        throw new BadRequestException(
          '오늘 수락 한도(3회)에 도달했습니다. 내일 다시 시도해주세요.',
        );
      }

      const timerStart = new Date();
      const timerExpires = addMinutes(timerStart, 30);
      const chatRoom = await this.prisma.chatRoom.create({
        data: {
          matchId,
          timerStartedAt: timerStart,
          timerExpiresAt: timerExpires,
        },
      });
      await this.chatTimerService.startTimer(chatRoom.id, TIMER_DURATION_SECONDS);
      return this.prisma.match.update({
        where: { id: matchId },
        data: { status: 'ACCEPTED', chatRoomId: chatRoom.id, respondedAt: new Date() },
      });
    } else {
      await this.matchingEngine.recordRejection(match.activityId, match.requesterId);
      return this.prisma.match.update({
        where: { id: matchId },
        data: { status: 'REJECTED', respondedAt: new Date() },
      });
    }
  }

  async getPendingMatches(userId: string) {
    return this.prisma.match.findMany({
      where: { accepterId: userId, status: 'PENDING' },
      include: {
        requester: { select: { nickname: true, profileImageUrl: true, mannerScore: true } },
        activity: true,
      },
    });
  }

  async getDailyCount(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await this.prisma.match.count({
      where: { accepterId: userId, status: 'ACCEPTED', respondedAt: { gte: today } },
    });
    const isPlus = await this.isPlus(userId);
    return { count, limit: isPlus ? 10 : 3 };
  }

  private async isPlus(userId: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
      select: { status: true },
    });
    return sub?.status === 'ACTIVE';
  }

  async getMeeting(meetingId: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        match: {
          include: {
            requester: { select: { nickname: true, profileImageUrl: true, mannerScore: true } },
            accepter: { select: { nickname: true, profileImageUrl: true, mannerScore: true } },
            activity: { select: { category: true } },
          },
        },
      },
    });
    if (!meeting) throw new NotFoundException('만남 정보를 찾을 수 없습니다.');

    const match = meeting.match as { requesterId: string; accepterId: string } | null;
    if (!match || (match.requesterId !== userId && match.accepterId !== userId)) {
      throw new ForbiddenException('이 만남 정보에 접근 권한이 없습니다.');
    }

    return meeting;
  }
}
