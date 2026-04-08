import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscriptionPlan, PurchaseType } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private subscriptionsService: SubscriptionsService) { }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    async getStatus(@Req() req: any) {
        return this.subscriptionsService.getStatus(req.user.id);
    }

    @Post('sync')
    @UseGuards(JwtAuthGuard)
    async syncSubscription(
        @Req() req: any,
        @Body() data: { plan: SubscriptionPlan; revenuecatId: string; expiresAt: string },
    ) {
        return this.subscriptionsService.syncSubscription(req.user.id, {
            ...data,
            expiresAt: new Date(data.expiresAt),
        });
    }

    @Post('webhook')
    async handleWebhook(@Req() req: any) {
        // In reality, we verify the signature here using REVENUECAT_WEBHOOK_SECRET
        const { event } = req.body;

        // This mapping follows Section 6-4
        switch (event.type) {
            case 'INITIAL_PURCHASE':
                // logic to create subscription
                break;
            case 'RENEWAL':
                // logic to renew
                break;
            case 'CANCELLATION':
                // logic to cancel
                break;
            case 'EXPIRATION':
                // logic to expire
                break;
        }
        return { status: 'OK' };
    }
}
