import { Injectable } from '@nestjs/common';

export type CoinSide = 'heads' | 'tails';

export interface CoinTossState {
  gameId: string;
  picks: Map<string, CoinSide>;
  result?: CoinSide;
  winnerId?: string;
}

@Injectable()
export class CoinTossService {
  private tosses = new Map<string, CoinTossState>();

  initToss(gameId: string): void {
    this.tosses.set(gameId, { gameId, picks: new Map() });
  }

  pick(gameId: string, userId: string, side: CoinSide): void {
    let toss = this.tosses.get(gameId);
    if (!toss) {
      toss = { gameId, picks: new Map() };
      this.tosses.set(gameId, toss);
    }
    toss.picks.set(userId, side);
  }

  flip(gameId: string): { result: CoinSide; winnerId: string } | null {
    const toss = this.tosses.get(gameId);
    if (!toss || toss.picks.size < 1) return null;

    const result: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';
    let winnerId: string | undefined;

    for (const [userId, side] of toss.picks) {
      if (side === result) {
        winnerId = userId;
        break;
      }
    }
    if (!winnerId) winnerId = [...toss.picks.keys()][0];

    toss.result = result;
    toss.winnerId = winnerId;
    return { result, winnerId };
  }

  getToss(gameId: string): CoinTossState | undefined {
    return this.tosses.get(gameId);
  }

  clearToss(gameId: string): void {
    this.tosses.delete(gameId);
  }
}
