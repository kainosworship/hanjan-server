import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from './common/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VerificationModule } from './modules/verification/verification.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { MatchingModule } from './modules/matching/matching.module';
import { ChatModule } from './modules/chat/chat.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { SafetyModule } from './modules/safety/safety.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadModule } from './modules/upload/upload.module';
import { PrismaService } from './providers/prisma.service';
import { RedisService } from './providers/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    VerificationModule,
    ActivitiesModule,
    MatchingModule,
    ChatModule,
    MeetingsModule,
    ReviewsModule,
    ReferralsModule,
    SubscriptionsModule,
    SafetyModule,
    NotificationsModule,
    UploadModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class AppModule {}
