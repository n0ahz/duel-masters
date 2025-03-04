import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SocketPayloadInterface } from '../interfaces/socket-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  constructor(
    private socket: Socket,
  ) {

  }

  getCurrentSocket(): Socket {
    return this.socket;
  }

  getCurrentSocketId(): string {
    return this.getCurrentSocket().ioSocket.id;
  }

  emit(event: string, data?: any) {
    let socketPayload: SocketPayloadInterface = {};
    if (data) socketPayload.data = data;
    this.socket.emit(event, socketPayload);
  }

  emitTo(gameRoom: string, event: string, data?: any) {
    let socketPayload: SocketPayloadInterface = {};
    socketPayload.gameRoom = gameRoom;
    if (data) socketPayload.data = data;
    this.socket.emit(event, socketPayload);
  }

  handleEvent(event: string, callback?: any) {
    this.getCurrentSocket().on(event, callback);
  }

  removeAllListeners() {
    this.getCurrentSocket().removeAllListeners();
  }
}
