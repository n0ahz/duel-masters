import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameCommands, GameEvents } from '@dm/shared';
import { DuelStateService } from '../services/duel-state.service';
import { GamesService } from '../modules/games/games.service';
import { GameRoomService } from '../services/game-room.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
})
export class DuelGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly duelStateService: DuelStateService,
    private readonly gamesService: GamesService,
    private readonly gameRoomService: GameRoomService,
  ) {}

  @SubscribeMessage(GameCommands.CARD_DROP)
  async handleCardDrop(
    @MessageBody()
    data: { gameId: string; cardId: string; targetZone: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });

      await this.gamesService.recordStep(room.dbId, {
        playerId: socket.data.userId,
        type: 'card_drop',
        payload: data,
      });

      const state = this.duelStateService.getState(data.gameId);
      this.server.to(data.gameId).emit(GameEvents.CARD_DROPPED, {
        gameId: data.gameId,
        playerId: socket.data.userId,
        cardId: data.cardId,
        targetZone: data.targetZone,
      });
      if (state)
        this.server.to(data.gameId).emit(GameEvents.GAME_STATE_UPDATE, state);
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.TAP_CARD)
  async handleTapCard(
    @MessageBody() data: { gameId: string; cardId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });

      await this.gamesService.recordStep(room.dbId, {
        playerId: socket.data.userId,
        type: 'tap_card',
        payload: data,
      });

      this.server.to(data.gameId).emit(GameEvents.CARD_TAPPED, {
        gameId: data.gameId,
        playerId: socket.data.userId,
        cardId: data.cardId,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.UNTAP_CARD)
  async handleUntapCard(
    @MessageBody() data: { gameId: string; cardId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });

      await this.gamesService.recordStep(room.dbId, {
        playerId: socket.data.userId,
        type: 'untap_card',
        payload: data,
      });

      this.server.to(data.gameId).emit(GameEvents.CARD_UNTAPPED, {
        gameId: data.gameId,
        playerId: socket.data.userId,
        cardId: data.cardId,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.PHASE_CHANGE)
  async handlePhaseChange(
    @MessageBody() data: { gameId: string; phase: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });

      await this.gamesService.recordStep(room.dbId, {
        playerId: socket.data.userId,
        type: 'phase_change',
        payload: data,
      });

      this.server.to(data.gameId).emit(GameEvents.PHASE_CHANGED, {
        gameId: data.gameId,
        phase: data.phase,
        playerId: socket.data.userId,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }
}
