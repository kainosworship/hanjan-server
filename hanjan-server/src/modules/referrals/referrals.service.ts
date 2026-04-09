import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class ReferralsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCode(userId: string) {
    let referralCode = await this.prisma.referralCode.findUnique({ where: { userId } });
    if (!referralCode) {
      let code = generateCode();
      let exists = await this.prisma.referralCode.findUnique({ where: { code } });
      while (exists) {
        code = generateCode();
        exists = await this.prisma.referralCode.findUnique({ where: { code } });
      }
      referralCode = await this.prisma.referralCode.create({ data: { userId, code } });
    }
    return referralCode;
  }

  async getStatus(userId: string) {
    const referrals = await this.prisma.referral.findMany({ where: { referrerId: userId } });
    const completed = referrals.filter((r) => r.status === 'COMPLETED').length;
    const pending = referrals.filter((r) => r.status === 'PENDING').length;
    const cycleCompleted = completed % 3;

    return {
      totalInvited: referrals.length,
      completed,
      pending,
      currentCycle: { completed: cycleCompleted, needed: 3 },
    };
  }

  async validateCode(refereeId: string, code: string) {
    const referralCode = await this.prisma.referralCode.findUnique({ where: { code } });
    if (!referralCode) throw new BadRequestException('유효하지 않은 초대 코드입니다.');
    if (referralCode.userId === refereeId) throw new BadRequestException('자신의 초대 코드를 사용할 수 없습니다.');

    const existing = await this.prisma.referral.findUnique({
      where: { referrerId_refereeId: { referrerId: referralCode.userId, refereeId } },
    });
    if (existing) throw new BadRequestException('이미 사용된 초대 코드입니다.');

    return this.prisma.referral.create({
      data: { referrerId: referralCode.userId, refereeId, status: 'PENDING' },
    });
  }

  async getRewardStatus(userId: string) {
    return this.prisma.referralReward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
