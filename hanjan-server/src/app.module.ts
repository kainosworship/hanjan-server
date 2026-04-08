import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { MatchingModule } from './modules/matching/matching.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { SafetyModule } from './modules/safety/safety.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadModule } from './modules/upload/upload.module';
import { PrismaService } from './providers/prisma.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }),
        AuthModule,
        UsersModule,
        ActivitiesModule,
        MatchingModule,
        ChatModule,
        ReferralsModule,
        SubscriptionsModule,
        SafetyModule,
        NotificationsModule,
        UploadModule,
    ],
    providers: [PrismaService],
})
export class AppModule { }
