import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { ReferralsService } from '../referrals/referrals.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class VerificationService {
    constructor(
        private prisma: PrismaService,
        private referralsService: ReferralsService,
        private uploadService: UploadService,
    ) { }

    async submitIdCard(userId: string, file: any) {
        // In production, use AWS Rekognition/OCR to verify
        // For MVP, we'll simulate verification
        const idImageUrl = await this.uploadService.uploadFile(file, 'ids');

        await this.prisma.user.update({
            where: { id: userId },
            data: { isIdVerified: true },
        });

        return { success: true, message: 'ID Verification submitted' };
    }

    async submitSelfie(userId: string, file: any) {
        const profileImageUrl = await this.uploadService.uploadFile(file, 'selfies');

        // Simulate AI match with ID card
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                isSelfieVerified: true,
                profileImageUrl,
                selfieUpdatedAt: new Date(),
            },
        });

        // Check if overall verification is complete
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (user?.isIdVerified && user?.isSelfieVerified) {
            // Trigger referral completion if this user was referred by someone
            await this.referralsService.completeReferral(userId);
        }

        return { success: true, profileImageUrl };
    }
}
