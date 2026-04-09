import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchingEngineService } from './matching-engine.service';
import { ChatModule } from '../chat/chat.module';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';

@Module({
  imports: [ChatModule],
  controllers: [MatchingController],
  providers: [MatchingService, MatchingEngineService, PrismaService, RedisService],
  exports: [MatchingService, MatchingEngineService],
})
export class MatchingModule {}
