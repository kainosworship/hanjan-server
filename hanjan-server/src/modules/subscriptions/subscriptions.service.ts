import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { RevenueCatWebhookPayload } from './dto/webhook.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
  }

  async getPlusAccess(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    const activeReward = await this.prisma.referralReward.findFirst({
      where: { userId, isActive: true, endDate: { gt: new Date() } },
    });

    if (subscription?.status === 'ACTIVE') {
      return { hasPlus: true, source: 'subscription', expiresAt: subscription.currentPeriodEnd };
    }
    if (activeReward) {
      return { hasPlus: true, source: 'referral_reward', expiresAt: activeReward.endDate };
    }
    return { hasPlus: false, source: null };
  }

  async handleWebhook(body: RevenueCatWebhookPayload) {
    console.log('[RevenueCat Webhook]', body.event?.type);
    return { received: true };
  }
}
