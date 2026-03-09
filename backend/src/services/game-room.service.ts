import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { GameStatus, GameType } from '@dm/shared';

export interface GameRoomState {
  id: string;
  dbId: string;
  name: string;
  inviterId: string;
  inviterName: string;
  inviterSocketId: string;
  challengerId?: string;
  challengerName?: string;
  challengerSocketId?: string;
  status: GameStatus;
  type: GameType;
  users: Set<string>;
  createdAt: Date;
}

@Injectable()
export class GameRoomService implements OnModuleInit, OnModuleDestroy {
  private rooms = new Map<string, GameRoomState>();
  private cleanupInterval: NodeJS.Timeout;

  onModuleInit() {
    this.cleanupInterval = setInterval(
      () => this.cleanupStaleRooms(),
      30 * 60 * 1000,
    );
  }

  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
  }

  createRoom(
    data: Omit<GameRoomState, 'users' | 'createdAt' | 'status'>,
  ): GameRoomState {
    const room: GameRoomState = {
      ...data,
      status: GameStatus.WAITING,
      users: new Set([data.inviterId]),
      createdAt: new Date(),
    };
    this.rooms.set(data.id, room);
    return room;
  }

  getRoom(id: string): GameRoomState | undefined {
    return this.rooms.get(id);
  }

  getAllRooms(): GameRoomState[] {
    return Array.from(this.rooms.values());
  }

  getWaitingRooms(): GameRoomState[] {
    return this.getAllRooms().filter((r) => r.status === GameStatus.WAITING);
  }

  updateRoom(
    id: string,
    updates: Partial<GameRoomState>,
  ): GameRoomState | undefined {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    const updated = { ...room, ...updates };
    this.rooms.set(id, updated);
    return updated;
  }

  deleteRoom(id: string): void {
    this.rooms.delete(id);
  }

  private cleanupStaleRooms() {
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
    for (const [id, room] of this.rooms) {
      if (
        room.createdAt < cutoff &&
        room.status !== GameStatus.IN_PROGRESS
      ) {
        this.rooms.delete(id);
      }
    }
  }
}
