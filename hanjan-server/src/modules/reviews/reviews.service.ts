import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: {
        meetingId: dto.meetingId,
        reviewerId,
        reviewedUserId: dto.reviewedUserId,
        conversationScore: dto.conversationScore,
        punctualityScore: dto.punctualityScore,
        remeetScore: dto.remeetScore,
        tags: dto.tags || [],
        comment: dto.comment,
      },
    });

    await this.recalculateMannerScore(dto.reviewedUserId);
    return review;
  }

  async getByMeeting(meetingId: string) {
    return this.prisma.review.findMany({ where: { meetingId } });
  }

  async checkCompleted(userId: string, meetingId: string) {
    const review = await this.prisma.review.findFirst({
      where: { meetingId, reviewerId: userId },
    });
    return { completed: !!review };
  }

  private async recalculateMannerScore(userId: string) {
    const reviews = await this.prisma.review.findMany({ where: { reviewedUserId: userId } });
    if (!reviews.length) return;

    const avg = (key: keyof typeof reviews[0]) =>
      reviews.reduce((s, r) => s + (r[key] as number), 0) / reviews.length;

    const conversationAvg = avg('conversationScore');
    const punctualityAvg = avg('punctualityScore');
    const remeetAvg = avg('remeetScore');
    const overallScore = (conversationAvg + punctualityAvg + remeetAvg) / 3;

    await this.prisma.mannerScore.upsert({
      where: { userId },
      create: { userId, conversationAvg, punctualityAvg, remeetAvg, overallScore, totalReviews: reviews.length },
      update: { conversationAvg, punctualityAvg, remeetAvg, overallScore, totalReviews: reviews.length },
    });
  }
}
