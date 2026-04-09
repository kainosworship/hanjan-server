import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyIdCard(userId: string, imageUrl: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isIdVerified: true },
    });
    return { verified: true };
  }

  async faceMatch(userId: string, selfieUrl: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isSelfieVerified: true, selfieUpdatedAt: new Date(), profileImageUrl: selfieUrl },
    });
    return { matched: true };
  }

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPhoneVerified: true, isIdVerified: true, isSelfieVerified: true },
    });
    return user;
  }
}
