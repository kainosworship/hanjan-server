import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatTimerService } from './chat-timer.service';
import { VenueShareData } from './dto/venue-share.dto';

interface AuthenticatedSocket extends Socket {
  user?: { sub?: string; id?: string };
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private timerIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly chatService: ChatService,
    private readonly chatTimerService: ChatTimerService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: AuthenticatedSocket) {
    const token =
      client.handshake.auth?.token ??
      (client.handshake.headers?.authorization as string)?.replace('Bearer ', '');
    if (!token) {
      client.disconnect(true);
      return;
    }
    try {
      const payload = this.jwtService.verify<{ sub?: string; id?: string }>(token);
      client.user = payload;
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  private getUserIdFromSocket(client: AuthenticatedSocket): string | null {
    return client.user?.sub ?? client.user?.id ?? null;
  }

  private async assertRoomParticipant(client: AuthenticatedSocket, roomId: string): Promise<string> {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) {
      client.emit('error', { message: '인증이 필요합니다.' });
      throw new WsException('Unauthenticated');
    }
    const room = await this.chatService.getRoom(roomId);
    const match = room.match;
    if (!match || (match.requesterId !== userId && match.accepterId !== userId)) {
      client.emit('error', { message: '접근 권한이 없습니다.' });
      throw new WsException('Forbidden');
    }
    return userId;
  }

  private async assertRoomActiveAndNotExpired(
    client: AuthenticatedSocket,
    roomId: string,
  ): Promise<{ userId: string; room: Awaited<ReturnType<ChatService['getRoom']>> }> {
    const userId = await this.assertRoomParticipant(client, roomId);
    const room = await this.chatService.getRoom(roomId);

    if (room.status !== 'ACTIVE') {
      client.emit('error', { message: '채팅방이 종료되었습니다.' });
      throw new WsException('Room closed');
    }

    const remainingSeconds = await this.chatTimerService.getRemainingSeconds(roomId);
    if (remainingSeconds <= 0) {
      await this.chatService.closeRoomAsExpired(roomId);
      await this.chatTimerService.clearTimer(roomId);
      this.stopTimerBroadcast(roomId);
      this.server.to(roomId).emit('timer_expired', { roomId });
      client.emit('error', { message: '채팅 시간이 만료되었습니다.' });
      throw new WsException('Timer expired');
    }

    return { userId, room };
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { roomId: string }) {
    await this.assertRoomParticipant(client, data.roomId);
    client.join(data.roomId);
    const remaining = await this.chatTimerService.getRemainingSeconds(data.roomId);
    client.emit('joined', { roomId: data.roomId, remainingSeconds: remaining });
    client.emit('timer_update', { remainingSeconds: remaining });
    this.startTimerBroadcast(data.roomId);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; content: string },
  ) {
    const { userId } = await this.assertRoomActiveAndNotExpired(client, data.roomId);
    const message = await this.chatService.saveMessage(data.roomId, userId, data.content);
    this.server.to(data.roomId).emit('new_message', message);
  }

  @SubscribeMessage('share_venue')
  async handleShareVenue(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; venue: VenueShareData },
  ) {
    const { userId } = await this.assertRoomActiveAndNotExpired(client, data.roomId);
    const message = await this.chatService.saveVenueShare(data.roomId, userId, data.venue);
    this.server.to(data.roomId).emit('new_message', message);
  }

  @SubscribeMessage('propose_meeting')
  async handleProposeMeeting(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; scheduledAt: string; venueName?: string },
  ) {
    const { userId } = await this.assertRoomActiveAndNotExpired(client, data.roomId);
    const message = await this.chatService.proposeMeeting(
      data.roomId,
      userId,
      data.scheduledAt,
      data.venueName,
    );
    this.server.to(data.roomId).emit('new_message', message);
  }

  @SubscribeMessage('confirm_meeting')
  async handleConfirmMeeting(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    const { userId, room } = await this.assertRoomActiveAndNotExpired(client, data.roomId);

    const confirmedUsers = await this.chatTimerService.recordConfirm(data.roomId, userId);
    this.server.to(data.roomId).emit('confirm_status', { confirmedUsers });

    const match = room.match;
    if (!match) return;
    const participantIds = [match.requesterId, match.accepterId];
    const allConfirmed = participantIds.every((id) => confirmedUsers.includes(id));

    if (allConfirmed) {
      const result = await this.chatService.confirmMeeting(data.roomId, userId);
      if (result) {
        this.server.to(data.roomId).emit('meeting_confirmed', result);
        await this.chatTimerService.clearTimer(data.roomId);
        this.stopTimerBroadcast(data.roomId);
      }
    }
  }

  private startTimerBroadcast(roomId: string) {
    if (this.timerIntervals.has(roomId)) return;

    const interval = setInterval(async () => {
      const remainingSeconds = await this.chatTimerService.getRemainingSeconds(roomId);
      this.server.to(roomId).emit('timer_update', { remainingSeconds });

      if (remainingSeconds <= 60 && remainingSeconds > 0) {
        this.server.to(roomId).emit('timer_urgent', { remainingSeconds });
      } else if (remainingSeconds <= 300 && remainingSeconds > 0) {
        this.server.to(roomId).emit('timer_warning', { remainingSeconds });
      }

      if (remainingSeconds <= 0) {
        await this.chatService.closeRoomAsExpired(roomId);
        await this.chatTimerService.clearTimer(roomId);
        this.server.to(roomId).emit('timer_expired', { roomId });
        this.stopTimerBroadcast(roomId);
      }
    }, 5000);

    this.timerIntervals.set(roomId, interval);
  }

  private stopTimerBroadcast(roomId: string) {
    const interval = this.timerIntervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.timerIntervals.delete(roomId);
    }
  }
}
