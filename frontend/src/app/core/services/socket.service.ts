import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { GameCommands } from '@dm/shared';

@Injectable({ providedIn: 'root' })
export class SocketService {
  constructor(private socket: Socket) {}

  connect(userId: string, username: string): void {
    this.socket.ioSocket.auth = { userId, username };
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  emit<T>(event: GameCommands | string, data?: T): void {
    this.socket.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return this.socket.fromEvent<T>(event);
  }

  get currentUserId(): string {
    return (this.socket.ioSocket.auth as any)?.userId || '';
  }

  get currentUsername(): string {
    return (this.socket.ioSocket.auth as any)?.username || '';
  }
}
