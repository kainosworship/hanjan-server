import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async getMessages(chatRoomId: string, userId: string) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
            include: { match: true },
        });

        if (!room || (room.match.requesterId !== userId && room.match.accepterId !== userId)) {
            throw new NotFoundException('Chat room not found');
        }

        return this.prisma.chatMessage.findMany({
            where: { chatRoomId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async sendMessage(userId: string, roomId: string, content: string, type: 'TEXT' | 'VENUE_SHARE' | 'MEETING_PROPOSAL' = 'TEXT', metadata?: any) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: roomId },
        });

        if (!room || room.status !== 'ACTIVE') {
            throw new BadRequestException('Chat room is not active');
        }

        if (new Date() > room.timerExpiresAt) {
            await this.prisma.chatRoom.update({
                where: { id: roomId },
                data: { status: 'TIMER_EXPIRED' },
            });
            throw new BadRequestException('Chat timer HAS EXPIRED');
        }

        return this.prisma.chatMessage.create({
            data: {
                chatRoomId: roomId,
                senderId: userId,
                content,
                messageType: type,
                metadata,
            },
        });
    }

    async confirmMeeting(userId: string, roomId: string, meetingData: any) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: { match: true },
        });

        if (!room || room.status !== 'ACTIVE') {
            throw new BadRequestException('Chat room is not active');
        }

        // Determine meeting details
        const meeting = await this.prisma.meeting.create({
            data: {
                matchId: room.matchId,
                venueName: meetingData.venueName,
                venueAddress: meetingData.venueAddress,
                venueLat: meetingData.venueLat,
                venueLng: meetingData.venueLng,
                scheduledAt: new Date(meetingData.scheduledAt),
                status: 'CONFIRMED',
            },
        });

        // Update chat room status
        await this.prisma.chatRoom.update({
            where: { id: roomId },
            data: { status: 'MEETING_CONFIRMED' },
        });

        return meeting;
    }
}
