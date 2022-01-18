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
import {CommonEventsEnum} from "../enums/gateway/common-events.enum";

@WebSocketGateway()
export class MainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect  {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MainGateway');

  afterInit(server: Server) {
    this.logger.log('Main WS gateway initialized..');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Main: Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Main: Client disconnected: ${client.id}`);
  }

  // add methods..
  @SubscribeMessage(CommonEventsEnum.MSG_TO_SERVER)
  handleMessage(client: Socket, payload: SocketPayloadInterface): WsResponse<unknown> {
    if (payload.gameRoom) {
      client.to(payload.gameRoom).emit(CommonEventsEnum.MSG_TO_CLIENT, payload);
    }
    return {event: CommonEventsEnum.MSG_TO_CLIENT, data: payload};
  }
}
