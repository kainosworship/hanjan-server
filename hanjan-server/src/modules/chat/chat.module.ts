import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatTimerService } from './chat-timer.service';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatTimerService, PrismaService, RedisService],
  exports: [ChatService, ChatTimerService],
})
export class ChatModule {}
