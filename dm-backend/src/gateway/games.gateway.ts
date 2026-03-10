import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { SocketPayloadInterface } from '../interfaces/socket-payload.interface';
import { GamesCommandsEnum, GamesEventsEnum } from '../enums/gateway/games-events.enum';
import { CommonCommandsEnum, CommonEventsEnum } from '../enums/gateway/common-events.enum';
import { GatewayUtility } from '../utils/gateway.utility';
import { GameStatusEnum } from '../enums/games.enum';
import { GameRoomService } from '../services/game-room.service';

@WebSocketGateway({ cors: true, origin: '*' })
export class GamesGateway implements OnGatewayInit {
  private users: Set<string> = new Set();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GamesGateway');

  constructor(private readonly gameRoomService: GameRoomService) {}

  afterInit(server: Server): void {
    setInterval(() => {
      this.gameRoomService.cleanup(2 * 60 * 60 * 1000); // remove games older than 2 hours
    }, 30 * 60 * 1000); // run every 30 minutes
  }

  private assertPlayerInGame(client: Socket, gameRoom: string): void {
    if (!client.rooms.has(gameRoom)) {
      throw new Error('Client is not in this game room');
    }
  }

  @SubscribeMessage(GamesCommandsEnum.ADD_GAME)
  addGame(client: Socket, payload: SocketPayloadInterface) {
    const game = payload?.data?.game;
    if (!game?.gameIdentifier) {
      return { event: 'error', data: { message: 'Invalid game payload' } };
    }
    this.gameRoomService.add(game);
    const response: SocketPayloadInterface = {
      data: { msg: 'Games List', games: this.gameRoomService.all() },
    };
    this.server.emit(GamesEventsEnum.GAMES_LIST, response);
  }

  @SubscribeMessage(GamesCommandsEnum.GET_GAMES)
  getGames(client: Socket, payload: SocketPayloadInterface) {
    const response: SocketPayloadInterface = {
      data: { msg: 'Games List', games: this.gameRoomService.all() },
    };
    client.emit(GamesEventsEnum.GAMES_LIST, response);
  }

  @SubscribeMessage(GamesCommandsEnum.GET_GAME)
  getGame(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const gameIdentifier = payload?.data?.gameIdentifier;
    const game = gameIdentifier ? this.gameRoomService.get(gameIdentifier) : null;
    if (!game) {
      return { event: 'error', data: { message: 'Game not found' } } as any;
    }
    const response: SocketPayloadInterface = {
      data: { msg: 'Games Info', game },
    };
    client.to(room).emit(GamesEventsEnum.GAME_INFO, response);
    client.to(room).emit(GamesEventsEnum.USER_INFO, {
      gameRoom: room,
      data: { users: Array.from(this.users) },
    });
    return { event: GamesEventsEnum.GAME_INFO, data: response };
  }

  private gameLeaveHandler(client: Socket, room: string) {
    const game = this.gameRoomService.get(room);
    let msg = `${client.id} left game...`;
    if (game?.inviter === client.id) {
      msg = '<b>Inviter</b> has left the game...';
      client.to(room).emit(GamesEventsEnum.INVITER_LEFT, {
        gameRoom: room,
        data: { msg, inviterSocketId: client.id },
      });
      this.gameRoomService.remove(room);
    } else if (game?.challenger === client.id) {
      game.challenger = null;
      game.firstToGo = null;
      msg = null;
      client.to(room).emit(GamesEventsEnum.SET_CHALLENGER, {
        gameRoom: room,
        data: { msg: '<b>Challenger</b> has left the game...', challenger: null },
      });
      client.to(room).emit(GamesEventsEnum.RESET_GAME);
    }
    client.leave(room);
    client.room = '';
    this.users.delete(client.id);
    client.to(room).emit(GamesEventsEnum.USER_INFO, {
      gameRoom: room,
      data: { users: Array.from(this.users) },
    });
    return { msg };
  }

  @SubscribeMessage(GamesCommandsEnum.JOIN_GAME)
  joinGame(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    let response: SocketPayloadInterface = {};
    if (payload.gameRoom) {
      const gameRoom = payload.gameRoom;
      response.gameRoom = gameRoom;
      if (client.room) {
        const previousRoom = client.room;
        const data = this.gameLeaveHandler(client, previousRoom);
        client.to(previousRoom).emit(CommonEventsEnum.MSG_TO_CLIENT, {
          gameRoom: client.room,
          data,
        });
      }
      client.join(gameRoom);
      client.room = gameRoom;
      response.data = { msg: `${client.id} joined game...` };
      client.to(gameRoom).emit(CommonEventsEnum.MSG_TO_CLIENT, response);
      this.users.add(client.id);
      client.to(gameRoom).emit(GamesEventsEnum.USER_INFO, {
        gameRoom,
        data: { users: Array.from(this.users) },
      });
      return { event: CommonEventsEnum.MSG_TO_CLIENT, data: response };
    }
  }

  @SubscribeMessage(GamesCommandsEnum.LEAVE_GAME)
  leaveGame(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    let room = client.room;
    if (payload?.gameRoom) room = payload.gameRoom;
    let response: SocketPayloadInterface = {};
    if (room) {
      response.gameRoom = room;
      response.data = this.gameLeaveHandler(client, room);
      return GatewayUtility.broadcastTo(
        client,
        room,
        CommonEventsEnum.MSG_TO_CLIENT,
        response,
      );
    }
  }

  @SubscribeMessage(GamesCommandsEnum.CHALLENGE)
  challenge(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const game = this.gameRoomService.get(room);
    if (!game) {
      return { event: 'error', data: { message: 'Game not found' } } as any;
    }
    game.challenger = client.id;
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { msg: `${client.id} has issued a challenge!`, challenger: client.id },
    };
    return GatewayUtility.broadcastTo(client, room, GamesEventsEnum.SET_CHALLENGER, response);
  }

  @SubscribeMessage(GamesCommandsEnum.SET_FIRST_TO_GO)
  setFirstToGo(client: Socket, payload: SocketPayloadInterface) {
    const room = payload.gameRoom;
    const game = this.gameRoomService.get(room);
    if (!game) {
      return { event: 'error', data: { message: 'Game not found' } };
    }
    game.firstToGo = payload.data?.firstToGo;
  }

  @SubscribeMessage(GamesCommandsEnum.START_DUEL)
  duel(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const game = this.gameRoomService.get(room);
    if (!game) {
      return { event: 'error', data: { message: 'Game not found' } } as any;
    }
    game.status = GameStatusEnum.IN_PROGRESS;
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { msg: `Duel!`, game },
    };
    return GatewayUtility.broadcastTo(client, room, GamesEventsEnum.DUEL, response);
  }
}
