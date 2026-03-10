import { Injectable } from '@nestjs/common';
import { GameInterface } from '../interfaces/game.interface';

@Injectable()
export class GameRoomService {
  private rooms = new Map<string, GameInterface>();

  add(game: GameInterface): void {
    this.rooms.set(game.gameIdentifier, game);
  }

  get(id: string): GameInterface | undefined {
    return this.rooms.get(id);
  }

  has(id: string): boolean {
    return this.rooms.has(id);
  }

  remove(id: string): void {
    this.rooms.delete(id);
  }

  all(): GameInterface[] {
    return Array.from(this.rooms.values());
  }

  cleanup(expiryMs: number): void {
    const expiry = Date.now() - expiryMs;
    for (const [id, game] of this.rooms.entries()) {
      if (game.createdAt && new Date(game.createdAt).getTime() < expiry) {
        this.rooms.delete(id);
      }
    }
  }
}
