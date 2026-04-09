import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, PrismaService, RedisService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
