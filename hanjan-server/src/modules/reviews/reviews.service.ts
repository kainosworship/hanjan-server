import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async submitReview(userId: string, data: any) {
        const { meetingId, conversationScore, punctualityScore, remeetScore, comment } = data;

        const meeting = await this.prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { match: true },
        });

        if (!meeting) throw new BadRequestException('Meeting not found');

        // Determine who is being reviewed
        const reviewedUserId =
            meeting.match.requesterId === userId
                ? meeting.match.accepterId
                : meeting.match.requesterId;

        const review = await this.prisma.review.create({
            data: {
                meetingId,
                reviewerId: userId,
                reviewedUserId,
                conversationScore,
                punctualityScore,
                remeetScore,
                comment,
            },
        });

        // Update the reviewed user's MannerScore
        await this.updateMannerScore(reviewedUserId);

        return review;
    }

    async updateMannerScore(userId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { reviewedUserId: userId },
        });

        if (reviews.length === 0) return;

        const total = reviews.length;
        const convAvg = reviews.reduce((sum: number, r: any) => sum + (r.conversationScore || 0), 0) / total;
        const puncAvg = reviews.reduce((sum: number, r: any) => sum + (r.punctualityScore || 0), 0) / total;
        const remeetAvg = reviews.reduce((sum: number, r: any) => sum + (r.remeetScore || 0), 0) / total;

        const overall = (convAvg + puncAvg + remeetAvg) / 3;

        await this.prisma.mannerScore.upsert({
            where: { userId },
            update: {
                conversationAvg: convAvg,
                punctualityAvg: puncAvg,
                remeetAvg: remeetAvg,
                overallScore: overall,
                totalReviews: total,
            },
            create: {
                userId,
                conversationAvg: convAvg,
                punctualityAvg: puncAvg,
                remeetAvg: remeetAvg,
                overallScore: overall,
                totalReviews: total,
            },
        });
    }

    async getUserMannerProfile(userId: string) {
        const score = await this.prisma.mannerScore.findUnique({
            where: { userId },
        });

        const reviews = await this.prisma.review.findMany({
            where: { reviewedUserId: userId },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                comment: true,
                createdAt: true,
            },
        });

        return {
            score,
            recentComments: reviews,
        };
    }
}
