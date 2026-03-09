import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameCommands, GameEvents, GameStatus } from '@dm/shared';
import { CoinTossService } from '../services/coin-toss.service';
import { GameRoomService } from '../services/game-room.service';
import { DuelStateService } from '../services/duel-state.service';
import { GamesService } from '../modules/games/games.service';
import { DecksService } from '../modules/decks/decks.service';

interface DuelReadyEntry {
  firstPlayerId?: string;
  decks: Map<string, string>; // userId → deckId
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
})
export class DuelDecisionGateway {
  @WebSocketServer() server: Server;

  private duelReadyState = new Map<string, DuelReadyEntry>();

  constructor(
    private readonly coinTossService: CoinTossService,
    private readonly gameRoomService: GameRoomService,
    private readonly duelStateService: DuelStateService,
    private readonly gamesService: GamesService,
    private readonly decksService: DecksService,
  ) {}

  @SubscribeMessage(GameCommands.COIN_TOSS_PICK)
  async handleCoinTossPick(
    @MessageBody() data: { gameId: string; side: 'heads' | 'tails' },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = socket.data.userId;
    this.coinTossService.pick(data.gameId, userId, data.side);

    const room = this.gameRoomService.getRoom(data.gameId);
    if (room?.dbId) {
      await this.gamesService.recordStep(room.dbId, {
        playerId: userId,
        type: 'coin_toss_pick',
        payload: { side: data.side },
      });
    }
  }

  @SubscribeMessage(GameCommands.COIN_TOSS_FLIP)
  async handleCoinTossFlip(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const room = this.gameRoomService.getRoom(data.gameId);
    if (!room)
      return socket.emit(GameEvents.ERROR, { message: 'Game not found' });
    if (room.challengerId !== socket.data.userId)
      return socket.emit(GameEvents.ERROR, {
        message: 'Only the challenger can flip the coin',
      });

    const result = this.coinTossService.flip(data.gameId);
    if (!result)
      return socket.emit(GameEvents.ERROR, {
        message: 'Pick a side before flipping',
      });

    const toss = this.coinTossService.getToss(data.gameId);
    const challengerPick = toss?.picks.get(room.challengerId) ?? null;

    if (room.dbId) {
      await this.gamesService.recordStep(room.dbId, {
        playerId: socket.data.userId,
        type: 'coin_toss_flip',
        payload: { ...result, challengerPick },
      });
    }

    this.server.to(data.gameId).emit(GameEvents.COIN_TOSS_RESULT, {
      gameId: data.gameId,
      ...result,
      challengerPick,
    });
  }

  @SubscribeMessage(GameCommands.DECIDE_WHO_GOES_FIRST)
  async handleDecideFirst(
    @MessageBody() data: { gameId: string; firstPlayerId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });

      const entry = this.getOrCreateEntry(data.gameId);
      entry.firstPlayerId = data.firstPlayerId;

      await this.gamesService.recordStep(room.dbId, {
        playerId: socket.data.userId,
        type: 'decide_first',
        payload: { firstPlayerId: data.firstPlayerId },
      });

      this.server.to(data.gameId).emit(GameEvents.WHO_GOES_FIRST, {
        gameId: data.gameId,
        firstPlayerId: data.firstPlayerId,
      });

      await this.checkAndStartDuel(data.gameId, socket);
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.SUBMIT_DECK)
  async handleSubmitDeck(
    @MessageBody() data: { gameId: string; deckId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });

      const entry = this.getOrCreateEntry(data.gameId);
      entry.decks.set(userId, data.deckId);

      this.server.to(data.gameId).emit(GameEvents.DECK_SUBMITTED, {
        gameId: data.gameId,
        userId,
        deckId: data.deckId,
      });

      await this.checkAndStartDuel(data.gameId, socket);
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  private getOrCreateEntry(gameId: string): DuelReadyEntry {
    if (!this.duelReadyState.has(gameId)) {
      this.duelReadyState.set(gameId, { decks: new Map() });
    }
    return this.duelReadyState.get(gameId)!;
  }

  private async checkAndStartDuel(gameId: string, socket: Socket) {
    const room = this.gameRoomService.getRoom(gameId);
    if (!room) return;

    const entry = this.duelReadyState.get(gameId);
    if (!entry?.firstPlayerId) return;

    const inviterId = room.inviterId;
    const challengerId = room.challengerId;
    if (!challengerId) return;

    if (!entry.decks.has(inviterId) || !entry.decks.has(challengerId)) return;

    // All conditions met — start the duel
    try {
      const inviterDeck = await this.decksService.expandDeck(
        entry.decks.get(inviterId)!,
      );
      const challengerDeck = await this.decksService.expandDeck(
        entry.decks.get(challengerId)!,
      );

      const gameState = this.duelStateService.initGame(gameId, [
        { userId: inviterId, username: room.inviterName, deck: inviterDeck },
        {
          userId: challengerId,
          username: room.challengerName || 'Challenger',
          deck: challengerDeck,
        },
      ]);

      await this.gamesService.startGame(room.dbId);
      await this.gamesService.recordStep(room.dbId, {
        playerId: socket.data.userId,
        type: 'duel_started',
        payload: { firstPlayerId: entry.firstPlayerId },
      });

      this.gameRoomService.updateRoom(gameId, {
        status: GameStatus.IN_PROGRESS,
      });

      this.duelReadyState.delete(gameId);

      this.server.to(gameId).emit(GameEvents.GAME_STATE_UPDATE, gameState);

      this.server.to(gameId).emit(GameEvents.DUEL_STARTED, {
        gameId,
        firstPlayerId: entry.firstPlayerId,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }
}
