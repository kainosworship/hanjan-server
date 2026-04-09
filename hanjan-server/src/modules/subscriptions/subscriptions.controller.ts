import { Controller, Get, Post, Body, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RevenueCatWebhookPayload } from './dto/webhook.dto';

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('status')
  getStatus(@CurrentUser() user: AuthUser) {
    return this.subscriptionsService.getStatus(user.id);
  }

  @Get('plus-access')
  getPlusAccess(@CurrentUser() user: AuthUser) {
    return this.subscriptionsService.getPlusAccess(user.id);
  }

  @Public()
  @Post('webhook')
  handleWebhook(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: RevenueCatWebhookPayload,
  ) {
    const expectedToken = process.env.REVENUECAT_WEBHOOK_SECRET;
    if (expectedToken) {
      const provided = authHeader?.replace('Bearer ', '');
      if (provided !== expectedToken) {
        throw new UnauthorizedException('Invalid webhook signature');
      }
    }
    return this.subscriptionsService.handleWebhook(body);
  }
}
