import { Controller, Get, Param, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  getRooms(@CurrentUser() user: AuthUser) {
    return this.chatService.getAllRooms(user.id);
  }

  @Get('rooms/:roomId')
  async getRoom(@CurrentUser() user: AuthUser, @Param('roomId') roomId: string) {
    const room = await this.chatService.getRoom(roomId);
    const match = room.match;
    if (!match) throw new NotFoundException('매칭 정보를 찾을 수 없습니다.');
    if (match.requesterId !== user.id && match.accepterId !== user.id) {
      throw new ForbiddenException('이 채팅방에 접근 권한이 없습니다.');
    }
    return room;
  }

  @Get('rooms/:roomId/messages')
  async getMessages(@CurrentUser() user: AuthUser, @Param('roomId') roomId: string) {
    const room = await this.chatService.getRoom(roomId);
    const match = room.match;
    if (!match) throw new NotFoundException('매칭 정보를 찾을 수 없습니다.');
    if (match.requesterId !== user.id && match.accepterId !== user.id) {
      throw new ForbiddenException('이 채팅방에 접근 권한이 없습니다.');
    }
    return this.chatService.getMessages(roomId);
  }
}
