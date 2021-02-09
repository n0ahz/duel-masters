import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class DuelGateway {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DuelGateway');

}
