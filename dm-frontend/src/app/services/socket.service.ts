import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { SocketPayloadInterface } from '../interfaces/socket-payload.interface';
import { SocketCommandMap, SocketEventMap } from '@dm/shared/interfaces/socket-event-map.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  constructor(
    private socket: Socket,
  ) {}

  getCurrentSocket(): Socket {
    return this.socket;
  }

  getCurrentSocketId(): string {
    return this.getCurrentSocket().ioSocket.id;
  }

  emit<K extends keyof SocketCommandMap>(event: K, data?: SocketCommandMap[K]): void {
    const socketPayload: SocketPayloadInterface = {};
    if (data !== undefined) { socketPayload.data = data; }
    this.socket.emit(event as string, socketPayload);
  }

  emitTo<K extends keyof SocketCommandMap>(gameRoom: string, event: K, data?: SocketCommandMap[K]): void {
    const socketPayload: SocketPayloadInterface = { gameRoom };
    if (data !== undefined) { socketPayload.data = data; }
    this.socket.emit(event as string, socketPayload);
  }

  fromEvent<K extends keyof SocketEventMap>(event: K): Observable<SocketPayloadInterface<SocketEventMap[K]>> {
    return this.socket.fromEvent(event as string) as Observable<SocketPayloadInterface<SocketEventMap[K]>>;
  }

  /** @deprecated Use fromEvent() with takeUntilDestroyed instead */
  handleEvent(event: string, callback?: any) {
    this.getCurrentSocket().on(event, callback);
  }

  removeAllListeners() {
    this.getCurrentSocket().removeAllListeners();
  }
}
