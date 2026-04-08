import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { addMonths } from 'date-fns';

@Injectable()
export class ReferralsService {
    constructor(private prisma: PrismaService) { }

    async getMyReferralStatus(userId: string) {
        const code = await this.prisma.referralCode.findUnique({
            where: { userId },
        });

        const completedReferrals = await this.prisma.referral.findMany({
            where: {
                referrerId: userId,
                status: 'COMPLETED',
            },
            orderBy: { createdAt: 'desc' },
        });

        const pendingReferrals = await this.prisma.referral.findMany({
            where: {
                referrerId: userId,
                status: 'PENDING',
            },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate how many are left in the current cycle of 3
        const rewardCount = await this.prisma.referralReward.count({
            where: { userId },
        });

        const usedInRewards = rewardCount * 3;
        const currentCycleCount = Math.max(0, completedReferrals.length - usedInRewards);

        const activeReward = await this.prisma.referralReward.findFirst({
            where: {
                userId,
                isActive: true,
                endDate: { gte: new Date() },
            },
            orderBy: { endDate: 'desc' },
        });

        return {
            code: code?.code,
            stats: {
                totalCompleted: completedReferrals.length,
                totalPending: pendingReferrals.length,
                currentCycle: {
                    completed: currentCycleCount,
                    needed: 3,
                },
            },
            activeReward,
            history: {
                completed: completedReferrals,
                pending: pendingReferrals,
            },
        };
    }

    async validateAndApplyReferral(userId: string, code: string) {
        const referralCode = await this.prisma.referralCode.findUnique({
            where: { code },
        });

        if (!referralCode) {
            throw new BadRequestException('Invalid referral code');
        }

        if (referralCode.userId === userId) {
            throw new BadRequestException('You cannot refer yourself');
        }

        // Check if user already was referred
        const existing = await this.prisma.referral.findFirst({
            where: { refereeId: userId },
        });

        if (existing) {
            throw new BadRequestException('Referral already applied');
        }

        return this.prisma.referral.create({
            data: {
                referrerId: referralCode.userId,
                refereeId: userId,
                status: 'PENDING',
            },
        });
    }

    /**
     * Called when a user completes identity verification
     */
    async completeReferral(refereeId: string) {
        const referral = await this.prisma.referral.findFirst({
            where: { refereeId, status: 'PENDING' },
        });

        if (!referral) return;

        await this.prisma.referral.update({
            where: { id: referral.id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        });

        // Check if referrer reached a milestone (3)
        const referrerId = referral.referrerId;
        const completedCount = await this.prisma.referral.count({
            where: {
                referrerId,
                status: 'COMPLETED',
            },
        });

        // Get current rewards to see if we hit a new milestone
        const rewards = await this.prisma.referralReward.findMany({
            where: { userId: referrerId },
        });

        if (completedCount >= (rewards.length + 1) * 3) {
            await this.triggerMilestoneReward(referrerId);
        }
    }

    private async triggerMilestoneReward(userId: string) {
        // Check if user is already a Plus subscriber
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });

        let startDate = new Date();
        let rewardType: 'FREE_PLUS' | 'EXTEND_PLUS' = 'FREE_PLUS';

        // If user has an active reward or subscription, stack it
        const lastReward = await this.prisma.referralReward.findFirst({
            where: { userId },
            orderBy: { endDate: 'desc' },
        });

        if (lastReward && lastReward.endDate > startDate) {
            startDate = lastReward.endDate;
        }

        if (subscription && subscription.status === 'ACTIVE' && subscription.currentPeriodEnd > startDate) {
            startDate = subscription.currentPeriodEnd;
            rewardType = 'EXTEND_PLUS';
        }

        const endDate = addMonths(startDate, 1);

        return this.prisma.referralReward.create({
            data: {
                userId,
                rewardType,
                startDate,
                endDate,
                isActive: true,
            },
        });
    }
}
