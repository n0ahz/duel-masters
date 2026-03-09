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
import { GameInterface } from '../interfaces/game.interface';
import { GamesEventsEnum } from '../enums/gateway/games-events.enum';
import { CommonEventsEnum } from '../enums/gateway/common-events.enum';
import { GatewayUtility } from '../utils/gateway.utility';
import { GameStatusEnum } from '../enums/games.enum';

@WebSocketGateway({ cors: true, origin: '*' })
export class GamesGateway implements OnGatewayInit {
  gameRooms: { [gameIdentifier: string]: GameInterface } = {}; // volatile data storage..use db..
  private users: Set<string> = new Set();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GamesGateway');

  afterInit(server: Server): void {
    setInterval(() => {
      const expiry = Date.now() - 2 * 60 * 60 * 1000; // 2 hours
      for (const [id, game] of Object.entries(this.gameRooms)) {
        if (game.createdAt && new Date(game.createdAt).getTime() < expiry) {
          delete this.gameRooms[id];
        }
      }
    }, 30 * 60 * 1000); // Run every 30 minutes
  }

  @SubscribeMessage(GamesEventsEnum.ADD_GAME)
  addGame(client: Socket, payload: SocketPayloadInterface) {
    const game = payload?.data?.game;
    if (!game?.gameIdentifier) {
      return { event: 'error', data: { message: 'Invalid game payload' } };
    }
    this.gameRooms[game.gameIdentifier] = game;
    const response: SocketPayloadInterface = {
      data: { msg: 'Games List', games: Object.values(this.gameRooms) },
    };
    this.server.emit(GamesEventsEnum.GAMES_LIST, response);
  }

  @SubscribeMessage(GamesEventsEnum.GET_GAMES)
  getGames(client: Socket, payload: SocketPayloadInterface) {
    const response: SocketPayloadInterface = {
      data: { msg: 'Games List', games: Object.values(this.gameRooms) },
    };
    client.emit(GamesEventsEnum.GAMES_LIST, response);
  }

  @SubscribeMessage(GamesEventsEnum.GET_GAME)
  getGame(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const response: SocketPayloadInterface = {
      data: {
        msg: 'Games Info',
        game: this.gameRooms[payload.data.gameIdentifier],
      },
    };
    client
      .to(room)
      .emit(GamesEventsEnum.GAME_INFO, response)
      .emit(GamesEventsEnum.USER_INFO, {
        gameRoom: room,
        data: { users: Array.from(this.users) },
      });
    return { event: GamesEventsEnum.GAME_INFO, data: response };
  }

  private gameLeaveHandler(client: Socket, room) {
    const game: GameInterface = this.gameRooms[room];
    let msg = `${client.id} left game...`;
    if (game?.inviter === client.id) {
      msg = '<b>Inviter</b> has left the game...';
      client.to(room).emit(GamesEventsEnum.INVITER_LEFT, {
        gameRoom: room,
        data: { msg: msg, inviterSocketId: client.id },
      });
      delete this.gameRooms[room];
    } else if (game?.challenger === client.id) {
      game.challenger = null;
      game.firstToGo = null;
      msg = null;
      client.to(room).emit(GamesEventsEnum.SET_CHALLENGER, {
        gameRoom: room,
        data: {
          msg: '<b>Challenger</b> has left the game...',
          challenger: null,
        },
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
    return { msg: msg };
  }

  @SubscribeMessage(GamesEventsEnum.JOIN_GAME)
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
          data: data,
        });
      }
      client.join(gameRoom);
      client.room = gameRoom;
      response.data = { msg: `${client.id} joined game...` };
      client.to(gameRoom).emit(CommonEventsEnum.MSG_TO_CLIENT, response);
      this.users.add(client.id);
      client.to(gameRoom).emit(GamesEventsEnum.USER_INFO, {
        gameRoom: gameRoom,
        data: { users: Array.from(this.users) },
      });
      return { event: CommonEventsEnum.MSG_TO_CLIENT, data: response };
    }
  }

  @SubscribeMessage(GamesEventsEnum.LEAVE_GAME)
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

  @SubscribeMessage(GamesEventsEnum.CHALLENGE)
  challenge(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const game: GameInterface = this.gameRooms[room];
    if (!game) {
      return { event: 'error', data: { message: 'Game not found' } } as any;
    }
    game.challenger = client.id;
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: {
        msg: `${client.id} has issued a challenge!`,
        challenger: client.id,
      },
    };
    return GatewayUtility.broadcastTo(
      client,
      room,
      GamesEventsEnum.SET_CHALLENGER,
      response,
    );
  }

  @SubscribeMessage(GamesEventsEnum.SET_FIRST_TO_GO)
  setFirstToGo(client: Socket, payload: SocketPayloadInterface) {
    const room = payload.gameRoom;
    const data = payload.data;
    const game: GameInterface = this.gameRooms[room];
    if (!game) {
      return { event: 'error', data: { message: 'Game not found' } };
    }
    game.firstToGo = data.firstToGo;
  }

  @SubscribeMessage(GamesEventsEnum.START_DUEL)
  duel(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const game: GameInterface = this.gameRooms[room];
    if (!game) {
      return { event: 'error', data: { message: 'Game not found' } } as any;
    }
    game.status = GameStatusEnum.IN_PROGRESS;
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { msg: `Duel!`, game: game },
    };
    return GatewayUtility.broadcastTo(
      client,
      room,
      GamesEventsEnum.DUEL,
      response,
    );
  }
}
