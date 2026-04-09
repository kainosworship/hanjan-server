import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('my-code')
  getMyCode(@CurrentUser() user: AuthUser) {
    return this.referralsService.getOrCreateCode(user.id);
  }

  @Get('status')
  getStatus(@CurrentUser() user: AuthUser) {
    return this.referralsService.getStatus(user.id);
  }

  @Post('validate')
  validate(@CurrentUser() user: AuthUser, @Body() body: { code: string }) {
    return this.referralsService.validateCode(user.id, body.code);
  }

  @Get('reward-status')
  getRewardStatus(@CurrentUser() user: AuthUser) {
    return this.referralsService.getRewardStatus(user.id);
  }
}
