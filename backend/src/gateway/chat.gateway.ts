import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameCommands, GameEvents } from '@dm/shared';
import { ChatService } from '../modules/chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage(GameCommands.SEND_CHAT)
  async handleSendChat(
    @MessageBody() data: { gameId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      const username = socket.data.username || 'Player';

      const saved = await this.chatService.saveMessage({
        gameId: data.gameId,
        userId,
        username,
        message: data.message,
      });

      this.server.to(data.gameId).emit(GameEvents.CHAT_MESSAGE, {
        id: (saved as any)._id,
        gameId: data.gameId,
        userId,
        username,
        message: data.message,
        timestamp: saved.timestamp,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }
}
