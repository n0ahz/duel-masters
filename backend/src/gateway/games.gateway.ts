import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameCommands, GameEvents, GameStatus } from '@dm/shared';
import { GameRoomService } from '../services/game-room.service';
import { GamesService } from '../modules/games/games.service';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
})
export class GamesGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly gameRoomService: GameRoomService,
    private readonly gamesService: GamesService,
  ) {}

  @SubscribeMessage(GameCommands.CREATE_GAME)
  async handleCreateGame(
    @MessageBody() data: { name: string; type?: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      const username = socket.data.username || 'Player';
      if (!userId)
        return socket.emit(GameEvents.ERROR, { message: 'Not authenticated' });

      const gameId = uuidv4();
      const dbGame = await this.gamesService.createGame({
        name: data.name,
        inviterId: userId,
        inviterName: username,
        type: data.type,
      });
      const dbId = (dbGame as any)._id.toString();

      this.gameRoomService.createRoom({
        id: gameId,
        dbId,
        name: data.name,
        inviterId: userId,
        inviterName: username,
        inviterSocketId: socket.id,
        type: data.type as any,
      });

      socket.join(gameId);
      socket.data.gameId = gameId;
      socket.data.dbGameId = dbId;

      this.server.emit(GameEvents.GAME_CREATED, {
        id: gameId,
        dbId,
        name: data.name,
        inviterId: userId,
        inviterName: username,
        status: GameStatus.WAITING,
        type: data.type || 'standard',
        createdAt: new Date(),
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.LIST_GAMES)
  handleListGames(@ConnectedSocket() socket: Socket) {
    const rooms = this.gameRoomService.getWaitingRooms().map((r) => ({
      id: r.id,
      dbId: r.dbId,
      name: r.name,
      inviterId: r.inviterId,
      inviterName: r.inviterName,
      status: r.status,
      type: r.type,
      createdAt: r.createdAt,
    }));
    socket.emit(GameEvents.GAMES_LIST, rooms);
  }

  @SubscribeMessage(GameCommands.JOIN_GAME)
  handleJoinGame(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      const username = socket.data.username || 'Player';
      if (!userId)
        return socket.emit(GameEvents.ERROR, { message: 'Not authenticated' });

      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });
      if (room.status !== GameStatus.WAITING)
        return socket.emit(GameEvents.ERROR, {
          message: 'Game not available',
        });

      socket.join(data.gameId);
      socket.data.gameId = data.gameId;
      socket.data.dbGameId = room.dbId;
      room.users.add(userId);

      this.server
        .to(data.gameId)
        .emit(GameEvents.GAME_JOINED, {
          gameId: data.gameId,
          userId,
          username,
        });

      this.server.to(data.gameId).emit(GameEvents.PLAYER_JOINED_ROOM, {
        gameId: data.gameId,
        userId,
        username,
        timestamp: new Date(),
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.LEAVE_GAME)
  handleLeaveGame(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = socket.data.userId;
    const username = socket.data.username || 'Player';

    const room = this.gameRoomService.getRoom(data.gameId);
    if (room?.challengerId === userId && room?.status === GameStatus.CHALLENGED) {
      this.gameRoomService.updateRoom(data.gameId, {
        challengerId: undefined,
        challengerName: undefined,
        challengerSocketId: undefined,
        status: GameStatus.WAITING,
      });
      this.server.to(data.gameId).emit(GameEvents.CHALLENGE_REVOKED, {
        gameId: data.gameId,
      });
    }

    socket.leave(data.gameId);
    socket.data.gameId = undefined;
    this.server.to(data.gameId).emit(GameEvents.GAME_LEFT, {
      gameId: data.gameId,
      userId,
    });
    this.server.to(data.gameId).emit(GameEvents.PLAYER_LEFT_ROOM, {
      gameId: data.gameId,
      userId,
      username,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage(GameCommands.CHALLENGE)
  handleChallenge(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      const username = socket.data.username || 'Player';
      const room = this.gameRoomService.getRoom(data.gameId);
      if (!room)
        return socket.emit(GameEvents.ERROR, { message: 'Game not found' });
      if (room.status !== GameStatus.WAITING)
        return socket.emit(GameEvents.ERROR, { message: 'Game already has a challenger' });
      if (room.inviterId === userId)
        return socket.emit(GameEvents.ERROR, { message: 'Cannot challenge your own game' });

      this.gameRoomService.updateRoom(data.gameId, {
        challengerId: userId,
        challengerName: username,
        challengerSocketId: socket.id,
        status: GameStatus.CHALLENGED,
      });

      this.server.to(data.gameId).emit(GameEvents.CHALLENGED, {
        gameId: data.gameId,
        challengerId: userId,
        challengerName: username,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }
}
