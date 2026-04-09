import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { Expo } from 'expo-server-sdk';

@Injectable()
export class NotificationsService {
  private readonly expo = new Expo();

  constructor(private readonly prisma: PrismaService) {}

  async registerToken(userId: string, token: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { expoPushToken: token } });
    return { registered: true };
  }

  async sendPushNotification(userId: string, title: string, body: string, data?: Record<string, unknown>) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { expoPushToken: true } });
    if (!user?.expoPushToken || !Expo.isExpoPushToken(user.expoPushToken)) return;

    await this.expo.sendPushNotificationsAsync([
      { to: user.expoPushToken, title, body, data },
    ]);
  }
}
