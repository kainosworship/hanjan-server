import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ReportReason } from '@prisma/client';

@Controller('safety')
@UseGuards(JwtAuthGuard)
export class SafetyController {
    constructor(private safetyService: SafetyService) { }

    @Post('report')
    async reportUser(
        @Req() req: any,
        @Body() data: { reportedUserId: string; reason: ReportReason; description?: string },
    ) {
        return this.safetyService.createReport(req.user.id, data);
    }

    @Post('verify-id')
    async verifyId(@Req() req: any) {
        return this.safetyService.verifyId(req.user.id);
    }

    @Post('verify-selfie')
    async verifySelfie(@Req() req: any, @Body() data: { imageUrl: string }) {
        return this.safetyService.handleSelfieVerification(req.user.id, data.imageUrl);
    }

    @Get('my-reports')
    async getMyReports(@Req() req: any) {
        return this.safetyService.getReportStatus(req.user.id);
    }
}
