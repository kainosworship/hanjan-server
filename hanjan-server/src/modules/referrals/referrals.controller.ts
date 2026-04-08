import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('referrals')
@UseGuards(JwtAuthGuard)
export class ReferralsController {
    constructor(private referralsService: ReferralsService) { }

    @Get('status')
    async getStatus(@Req() req: any) {
        return this.referralsService.getMyReferralStatus(req.user.id);
    }

    @Post('apply')
    async applyCode(@Req() req: any, @Body('code') code: string) {
        return this.referralsService.validateAndApplyReferral(req.user.id, code);
    }
}
