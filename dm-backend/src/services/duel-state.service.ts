import { Injectable } from '@nestjs/common';

@Injectable()
export class DuelStateService {
  private persons = new Map<string, Set<string>>();

  register(gameIdentifier: string, socketId: string): void {
    if (!this.persons.has(gameIdentifier)) {
      this.persons.set(gameIdentifier, new Set());
    }
    this.persons.get(gameIdentifier).add(socketId);
  }

  isAllSet(gameIdentifier: string, inviter: string, challenger: string): boolean {
    const players = this.persons.get(gameIdentifier);
    if (!players) return false;
    return players.has(inviter) && players.has(challenger);
  }

  cleanup(gameIdentifier: string): void {
    this.persons.delete(gameIdentifier);
  }
}
