import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Post('test')
    async testPush(@Req() req: any) {
        return this.notificationsService.sendPushNotification(
            req.user.id,
            '한잔 테스트 알림',
            '알림 서버가 성공적으로 연결되었습니다! 🍺',
            { test: true }
        );
    }

    @Post('send-group')
    async sendGroupPush(
        @Body() data: { userIds: string[]; title: string; body: string; metadata?: any },
    ) {
        // This could be restricted to admin only in production
        return this.notificationsService.sendToMultipleUsers(
            data.userIds,
            data.title,
            data.body,
            data.metadata
        );
    }
}
