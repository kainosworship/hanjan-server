import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private chatService: ChatService,
        private jwtService: JwtService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token;
            const payload = this.jwtService.verify(token);
            client.data.userId = payload.sub;
            console.log(`Client connected: ${client.id}`);
        } catch (e) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
        client.join(roomId);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: { roomId: string, content: string, type: any, metadata?: any },
        @ConnectedSocket() client: Socket
    ) {
        const message = await this.chatService.sendMessage(
            client.data.userId,
            data.roomId,
            data.content,
            data.type,
            data.metadata
        );

        this.server.to(data.roomId).emit('newMessage', message);
    }
}
