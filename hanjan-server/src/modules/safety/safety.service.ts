import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { ReportReason, ReportStatus } from '@prisma/client';

@Injectable()
export class SafetyService {
    constructor(private prisma: PrismaService) { }

    async createReport(reporterId: string, data: {
        reportedUserId: string;
        reason: ReportReason;
        description?: string;
    }) {
        if (reporterId === data.reportedUserId) {
            throw new BadRequestException('Cannot report yourself');
        }

        const reportedUser = await this.prisma.user.findUnique({
            where: { id: data.reportedUserId },
        });

        if (!reportedUser) throw new NotFoundException('Reported user not found');

        return this.prisma.report.create({
            data: {
                reporterId,
                reportedUserId: data.reportedUserId,
                reason: data.reason,
                description: data.description,
                status: ReportStatus.PENDING,
            },
        });
    }

    async verifyId(userId: string) {
        // In a real app, this would integrate with an ID verification API
        // Here we mark it as verified for the flow
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isIdVerified: true,
            },
        });
    }

    async handleSelfieVerification(userId: string, imageUrl: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                profileImageUrl: imageUrl,
                isSelfieVerified: true,
                selfieUpdatedAt: new Date(),
            },
        });
    }

    async blockUser(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: false,
                isBanned: true,
            },
        });
    }

    async getReportStatus(reporterId: string) {
        return this.prisma.report.findMany({
            where: { reporterId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
