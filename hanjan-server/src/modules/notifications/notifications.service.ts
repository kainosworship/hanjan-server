import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class NotificationsService {
    private expo: Expo;
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private prisma: PrismaService) {
        this.expo = new Expo();
    }

    async sendPushNotification(userId: string, title: string, body: string, data?: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { expoPushToken: true },
        });

        if (!user?.expoPushToken || !Expo.isExpoPushToken(user.expoPushToken)) {
            this.logger.warn(`User ${userId} does not have a valid Expo push token.`);
            return;
        }

        const messages: ExpoPushMessage[] = [
            {
                to: user.expoPushToken,
                sound: 'default',
                title,
                body,
                data,
            },
        ];

        try {
            const chunks = this.expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
                await this.expo.sendPushNotificationsAsync(chunk);
            }
            this.logger.log(`Push notification sent to user ${userId}`);
        } catch (error) {
            this.logger.error(`Error sending push notification to user ${userId}:`, error);
        }
    }

    async sendToMultipleUsers(userIds: string[], title: string, body: string, data?: any) {
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, expoPushToken: true },
        });

        const messages: ExpoPushMessage[] = [];
        for (const user of users) {
            if (user.expoPushToken && Expo.isExpoPushToken(user.expoPushToken)) {
                messages.push({
                    to: user.expoPushToken,
                    sound: 'default',
                    title,
                    body,
                    data,
                });
            }
        }

        const chunks = this.expo.chunkPushNotifications(messages);
        for (const chunk of chunks) {
            try {
                await this.expo.sendPushNotificationsAsync(chunk);
            } catch (error) {
                this.logger.error('Error sending batch push notifications', error);
            }
        }
    }
}
