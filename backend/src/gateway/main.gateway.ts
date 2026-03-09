import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
})
export class MainGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers = new Map<string, string>();

  handleConnection(socket: Socket) {
    const userId = socket.handshake.auth?.userId as string;
    if (userId) {
      socket.data.userId = userId;
      socket.data.username = socket.handshake.auth?.username as string;
      this.activeUsers.set(socket.id, userId);
    }
    console.log(`Client connected: ${socket.id} userId=${userId}`);
  }

  handleDisconnect(socket: Socket) {
    this.activeUsers.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  }
}
