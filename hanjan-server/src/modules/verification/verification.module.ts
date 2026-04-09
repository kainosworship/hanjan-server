import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, PrismaService, RedisService],
  exports: [VerificationService],
})
export class VerificationModule {}
