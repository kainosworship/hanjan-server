import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { addMinutes } from 'date-fns';

@Injectable()
export class MatchingService {
    constructor(private prisma: PrismaService) { }

    async requestMatch(activityId: string, requesterId: string) {
        const activity = await this.prisma.activity.findUnique({
            where: { id: activityId },
        });

        if (!activity || activity.status !== 'ACTIVE') {
            throw new NotFoundException('Activity not found or not active');
        }

        if (activity.userId === requesterId) {
            throw new BadRequestException('You cannot join your own activity');
        }

        // Check if already requested
        const existing = await this.prisma.match.findFirst({
            where: { activityId, requesterId },
        });

        if (existing) {
            throw new BadRequestException('Already requested');
        }

        return this.prisma.match.create({
            data: {
                activityId,
                requesterId,
                accepterId: activity.userId,
                status: 'PENDING',
            },
        });
    }

    async respondToMatch(matchId: string, userId: string, accept: boolean) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { activity: true },
        });

        if (!match || match.accepterId !== userId) {
            throw new NotFoundException('Match request not found');
        }

        if (match.status !== 'PENDING') {
            throw new BadRequestException('Match is already processed');
        }

        if (!accept) {
            return this.prisma.match.update({
                where: { id: matchId },
                data: { status: 'REJECTED', respondedAt: new Date() },
            });
        }

        // If accepted, create ChatRoom with 30 min timer
        const now = new Date();
        const expiresAt = addMinutes(now, 30);

        const updatedMatch = await this.prisma.match.update({
            where: { id: matchId },
            data: { status: 'ACCEPTED', respondedAt: now },
        });

        const chatRoom = await this.prisma.chatRoom.create({
            data: {
                matchId: updatedMatch.id,
                timerStartedAt: now,
                timerExpiresAt: expiresAt,
                status: 'ACTIVE',
            },
        });

        // Mark activity as matched
        await this.prisma.activity.update({
            where: { id: match.activityId },
            data: { status: 'MATCHED' },
        });

        return { match: updatedMatch, chatRoom };
    }

    async getMyMatches(userId: string) {
        return this.prisma.match.findMany({
            where: {
                OR: [{ requesterId: userId }, { accepterId: userId }],
            },
            include: {
                activity: true,
                requester: { select: { id: true, nickname: true, profileImageUrl: true } },
                accepter: { select: { id: true, nickname: true, profileImageUrl: true } },
                chatRoom: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
