import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../../providers/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    providers: [ChatService, ChatGateway, PrismaService],
    exports: [ChatService],
})
export class ChatModule { }
