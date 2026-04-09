import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyMeetings(userId: string) {
    return this.prisma.meeting.findMany({
      where: {
        match: { OR: [{ requesterId: userId }, { accepterId: userId }] },
      },
      include: { match: { include: { requester: true, accepter: true } } },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findById(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: { match: { include: { requester: true, accepter: true } }, reviews: true },
    });
    if (!meeting) throw new NotFoundException('만남을 찾을 수 없습니다.');
    return meeting;
  }

  async complete(id: string) {
    return this.prisma.meeting.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
  }
}
