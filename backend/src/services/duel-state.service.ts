import { Injectable } from '@nestjs/common';
import {
  GameStateInterface,
  PlayerState,
  ZoneType,
  Phase,
  ZoneCardInterface,
  CardInterface,
  GAME_CONSTANTS,
} from '@dm/shared';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DuelStateService {
  private states = new Map<string, GameStateInterface>();

  initGame(
    gameId: string,
    players: { userId: string; username: string; deck: CardInterface[] }[],
  ): GameStateInterface {
    const playerStates: Record<string, PlayerState> = {};

    players.forEach((p, idx) => {
      const shuffled = this.shuffle([...p.deck]);
      const shields = shuffled
        .splice(0, GAME_CONSTANTS.SHIELDS)
        .map((card, i) =>
          this.makeZoneCard(card, ZoneType.SHIELDS, i, p.userId),
        );
      const hand = shuffled
        .splice(0, GAME_CONSTANTS.INITIAL_HAND)
        .map((card, i) =>
          this.makeZoneCard(card, ZoneType.HAND, i, p.userId),
        );
      const deck = shuffled.map((card, i) =>
        this.makeZoneCard(card, ZoneType.DECK, i, p.userId),
      );

      playerStates[p.userId] = {
        userId: p.userId,
        username: p.username,
        isFirstPlayer: idx === 0,
        zones: {
          [ZoneType.DECK]: deck,
          [ZoneType.HAND]: hand,
          [ZoneType.SHIELDS]: shields,
          [ZoneType.BATTLE_ZONE]: [],
          [ZoneType.GRAVEYARD]: [],
          [ZoneType.MANA]: [],
        },
      };
    });

    const state: GameStateInterface = {
      gameId,
      players: playerStates,
      currentPhase: Phase.START,
      currentTurn: 0,
      activePlayerId: players[0].userId,
      turnNumber: 1,
    };
    this.states.set(gameId, state);
    return state;
  }

  getState(gameId: string): GameStateInterface | undefined {
    return this.states.get(gameId);
  }

  clearState(gameId: string): void {
    this.states.delete(gameId);
  }

  private makeZoneCard(
    card: CardInterface,
    zone: ZoneType,
    position: number,
    ownerId: string,
  ): ZoneCardInterface {
    return {
      id: uuidv4(),
      card,
      zone,
      position,
      isTapped: false,
      isRevealed: false,
      ownerId,
    };
  }

  private shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
