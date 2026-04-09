import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { VenueShareData } from './dto/venue-share.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        match: { OR: [{ requesterId: userId }, { accepterId: userId }] },
        status: 'ACTIVE',
      },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        match: { include: { requester: true, accepter: true } },
      },
    });
  }

  async getRoom(roomId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { match: { include: { requester: true, accepter: true } } },
    });
    if (!room) throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    return room;
  }

  async getMessages(roomId: string, limit = 50) {
    return this.prisma.chatMessage.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async saveMessage(roomId: string, senderId: string, content: string) {
    return this.prisma.chatMessage.create({
      data: { chatRoomId: roomId, senderId, content, messageType: 'TEXT' },
    });
  }

  async saveVenueShare(roomId: string, senderId: string, venue: VenueShareData) {
    return this.prisma.chatMessage.create({
      data: {
        chatRoomId: roomId,
        senderId,
        content: `장소 공유: ${venue.name}`,
        messageType: 'VENUE_SHARE',
        metadata: { ...venue },
      },
    });
  }

  async proposeMeeting(roomId: string, senderId: string, scheduledAt: string, venueName?: string) {
    return this.prisma.chatMessage.create({
      data: {
        chatRoomId: roomId,
        senderId,
        content: venueName ? `${venueName}에서 만남을 제안했습니다.` : '만남 일정을 제안했습니다.',
        messageType: 'MEETING_PROPOSAL',
        metadata: { scheduledAt, venueName: venueName ?? '협의된 장소' },
      },
    });
  }

  async confirmMeeting(roomId: string, userId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { match: true },
    });
    if (!room) return null;

    const existingMeeting = await this.prisma.meeting.findUnique({
      where: { matchId: room.matchId },
    });
    if (existingMeeting) return existingMeeting;

    const latestProposal = await this.prisma.chatMessage.findFirst({
      where: { chatRoomId: roomId, messageType: 'MEETING_PROPOSAL' },
      orderBy: { createdAt: 'desc' },
    });

    const meta = latestProposal?.metadata as Record<string, unknown> | null;
    const scheduledAt = typeof meta?.['scheduledAt'] === 'string' ? meta['scheduledAt'] : new Date().toISOString();
    const venueName = typeof meta?.['venueName'] === 'string' ? meta['venueName'] : '협의된 장소';

    const meeting = await this.prisma.meeting.create({
      data: {
        matchId: room.matchId,
        venueName,
        scheduledAt: new Date(scheduledAt),
      },
    });

    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { status: 'MEETING_CONFIRMED', closedAt: new Date() },
    });

    return meeting;
  }

  async closeRoomAsExpired(roomId: string): Promise<void> {
    await this.prisma.chatRoom.updateMany({
      where: { id: roomId, status: 'ACTIVE' },
      data: { status: 'TIMER_EXPIRED', closedAt: new Date() },
    });
  }

  async getAllRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        match: { OR: [{ requesterId: userId }, { accepterId: userId }] },
      },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        match: {
          include: {
            requester: { select: { id: true, nickname: true, profileImageUrl: true, mannerScore: true } },
            accepter: { select: { id: true, nickname: true, profileImageUrl: true, mannerScore: true } },
            activity: { select: { category: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
