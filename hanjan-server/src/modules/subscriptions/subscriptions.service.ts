import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { SubscriptionPlan, SubscriptionStatus, PurchaseType } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
    constructor(private prisma: PrismaService) { }

    async getStatus(userId: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription) {
            return { isActive: false, plan: null };
        }

        const isActive = subscription.status === SubscriptionStatus.ACTIVE &&
            subscription.currentPeriodEnd > new Date();

        return {
            isActive,
            plan: subscription.plan,
            expiryDate: subscription.currentPeriodEnd,
        };
    }

    // Called when a user completes a purchase in the app and notifies the server
    async syncSubscription(userId: string, data: {
        plan: SubscriptionPlan;
        revenuecatId: string;
        expiresAt: Date;
    }) {
        return this.prisma.subscription.upsert({
            where: { userId },
            update: {
                plan: data.plan,
                status: SubscriptionStatus.ACTIVE,
                revenuecatId: data.revenuecatId,
                currentPeriodStart: new Date(),
                currentPeriodEnd: data.expiresAt,
            },
            create: {
                userId,
                plan: data.plan,
                status: SubscriptionStatus.ACTIVE,
                revenuecatId: data.revenuecatId,
                currentPeriodStart: new Date(),
                currentPeriodEnd: data.expiresAt,
            },
        });
    }

    async recordPurchase(userId: string, data: {
        productId: string;
        type: PurchaseType;
        amount: number;
        revenuecatId?: string;
    }) {
        return this.prisma.purchase.create({
            data: {
                userId,
                productId: data.productId,
                purchaseType: data.type,
                amount: data.amount,
                revenuecatId: data.revenuecatId,
            },
        });
    }
}
