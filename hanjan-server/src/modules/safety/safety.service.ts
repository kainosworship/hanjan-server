import { Injectable } from '@nestjs/common';
import { ReportReason } from '@prisma/client';
import { PrismaService } from '../../providers/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { EmergencyLocationDto } from './dto/emergency.dto';

@Injectable()
export class SafetyService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(reporterId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: dto.reportedUserId,
        reason: dto.reason as ReportReason,
        description: dto.description,
      },
    });
  }

  async sendEmergency(userId: string, location: EmergencyLocationDto | undefined) {
    console.log(`[EMERGENCY] User ${userId} sent emergency alert at`, location?.lat, location?.lng);
    return { sent: true };
  }

  async updateLocationShare(userId: string, enabled: boolean) {
    return { userId, locationShareEnabled: enabled };
  }
}
