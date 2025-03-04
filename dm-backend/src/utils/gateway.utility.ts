import { Socket } from 'socket.io';
import { WsResponse } from '@nestjs/websockets';
import { SocketPayloadInterface } from '../interfaces/socket-payload.interface';

export class GatewayUtility {
  public static broadcastTo(
    client: Socket,
    room: string,
    event: string,
    response?: any,
  ): WsResponse<SocketPayloadInterface> {
    client.to(room).emit(event, response);
    return { event: event, data: response };
  }
}
