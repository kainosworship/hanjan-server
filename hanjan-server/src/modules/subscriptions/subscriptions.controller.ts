import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscriptionPlan, PurchaseType } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
    constructor(private subscriptionsService: SubscriptionsService) { }

    @Get('status')
    async getStatus(@Req() req: any) {
        return this.subscriptionsService.getStatus(req.user.id);
    }

    @Post('sync')
    async syncSubscription(
        @Req() req: any,
        @Body() data: { plan: SubscriptionPlan; revenuecatId: string; expiresAt: string },
    ) {
        return this.subscriptionsService.syncSubscription(req.user.id, {
            ...data,
            expiresAt: new Date(data.expiresAt),
        });
    }

    @Post('purchase')
    async recordPurchase(
        @Req() req: any,
        @Body() data: { productId: string; type: PurchaseType; amount: number; revenuecatId?: string },
    ) {
        return this.subscriptionsService.recordPurchase(req.user.id, data);
    }
}
