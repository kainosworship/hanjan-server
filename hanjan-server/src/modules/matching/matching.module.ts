import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { PrismaService } from '../../providers/prisma.service';

@Module({
    controllers: [MatchingController],
    providers: [MatchingService, PrismaService],
    exports: [MatchingService],
})
export class MatchingModule { }
