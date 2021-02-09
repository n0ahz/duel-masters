import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer, WsResponse
} from '@nestjs/websockets';
import { Logger } from "@nestjs/common";
import { Socket, Server } from 'socket.io';
import { SocketPayloadInterface } from "../interfaces/socket-payload.interface";

@WebSocketGateway()
export class MainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect  {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MainGateway');

  afterInit(server: Server) {
    this.logger.log('Main WS gateway initialized..');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Main: Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Main: Client connected: ${client.id}`);
  }

  // add methods..
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: SocketPayloadInterface): WsResponse<unknown> {
    if (payload.gameRoom) {
      client.to(payload.gameRoom).emit('msgToClient', payload);
    }
    return {event: 'msgToClient', data: payload};
  }
}
