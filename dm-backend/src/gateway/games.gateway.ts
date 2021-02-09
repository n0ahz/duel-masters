import {
  SubscribeMessage,
  WebSocketGateway, WebSocketServer, WsResponse
} from '@nestjs/websockets';
import { Logger } from "@nestjs/common";
import { Socket, Server } from 'socket.io';
import * as _ from 'lodash';
import { SocketPayloadInterface } from "../interfaces/socket-payload.interface";
import { GameInterface } from "../interfaces/game.interface";
import { GamesEventsEnum } from "../enums/gateway/games-events.enum";
import { CommonEventsEnum } from "../enums/gateway/common-events.enum";
import { GatewayUtility } from "../utils/gateway.utility";
import { GameStatusEnum } from "../enums/games.enum";


@WebSocketGateway()
export class GamesGateway  {

  gameRooms: {[gameIdentifier: string]: GameInterface}  = {}; // volatile data storage..use db..
  users: string[] = [];

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GamesGateway');

  @SubscribeMessage(GamesEventsEnum.ADD_GAME)
  addGame(client: Socket, payload: SocketPayloadInterface) {
    this.gameRooms[payload.data.game.gameIdentifier] = payload.data.game;
    const response: SocketPayloadInterface = {data: {msg: 'Games List', games: _.values(this.gameRooms)}};
    this.server.emit(GamesEventsEnum.GAMES_LIST, response);
  }

  @SubscribeMessage(GamesEventsEnum.GET_GAMES)
  getGames(client: Socket, payload: SocketPayloadInterface) {
    const response: SocketPayloadInterface = {data: {msg: 'Games List', games: _.values(this.gameRooms)}};
    this.server.emit(GamesEventsEnum.GAMES_LIST, response);
  }

  @SubscribeMessage(GamesEventsEnum.GET_GAME)
  getGame(client: Socket, payload: SocketPayloadInterface): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const response: SocketPayloadInterface = {data: {msg: 'Games Info', game: this.gameRooms[payload.data.gameIdentifier]}};
    client.to(room).emit(GamesEventsEnum.GAME_INFO, response).emit(GamesEventsEnum.USER_INFO, {gameRoom: room, data: {users: this.users}});
    return {event: GamesEventsEnum.GAME_INFO, data: response};
  }

  private gameLeaveHandler(client: Socket, room) {
    const game: GameInterface = this.gameRooms[room];
    let msg = `${client.id} left game...`;
    if (game?.inviter === client.id) {
      msg = '<b>Inviter</b> has left the game...';
      client.to(room).emit(GamesEventsEnum.INVITER_LEFT, {gameRoom: room, data: {msg: msg, inviterSocketId: client.id}});
      delete this.gameRooms[room];
    } else if (game?.challenger == client.id) {
      game.challenger = null;
      game.firstToGo = null;
      msg = null;
      client.to(room).emit(GamesEventsEnum.SET_CHALLENGER, {gameRoom: room, data: {msg: '<b>Challenger</b> has left the game...', challenger: null}});
      client.to(room).emit(GamesEventsEnum.RESET_GAME);
    }
    client.leave(room);
    client.room = '';
    this.users = this.users.filter((user) => user !== client.id);
    client.to(room).emit(GamesEventsEnum.USER_INFO, {gameRoom: room, data: {users: this.users}});
    return {msg: msg};
  }

  @SubscribeMessage(GamesEventsEnum.JOIN_GAME)
  joinGame(client: Socket, payload: SocketPayloadInterface): WsResponse<SocketPayloadInterface> {
    let response: SocketPayloadInterface = {};
    if (payload.gameRoom) {
      const gameRoom = payload.gameRoom;
      response.gameRoom = gameRoom;
      if (client.room) {
        const previousRoom = client.room;
        const data = this.gameLeaveHandler(client, previousRoom);
        client.to(previousRoom).emit(CommonEventsEnum.MSG_TO_CLIENT, {gameRoom: client.room, data: data});
      }
      client.join(gameRoom);
      client.room = gameRoom;
      response.data = {msg: `${client.id} joined game...`};
      client.to(gameRoom).emit(CommonEventsEnum.MSG_TO_CLIENT, response);
      this.users.push(client.id);
      client.to(gameRoom).emit(GamesEventsEnum.USER_INFO, {gameRoom: gameRoom, data: {users: this.users}});
      return {event: CommonEventsEnum.MSG_TO_CLIENT, data: response};
    }
  }

  @SubscribeMessage(GamesEventsEnum.LEAVE_GAME)
  leaveGame(client: Socket, payload: SocketPayloadInterface): WsResponse<SocketPayloadInterface> {
    let room = client.room;
    if (payload?.gameRoom) room = payload.gameRoom;
    let response: SocketPayloadInterface = {};
    if (room) {
      response.gameRoom = room;
      response.data = this.gameLeaveHandler(client, room);
      return GatewayUtility.broadcastTo(client, room, CommonEventsEnum.MSG_TO_CLIENT, response);
    }
  }

  @SubscribeMessage(GamesEventsEnum.CHALLENGE)
  challenge(client: Socket, payload: SocketPayloadInterface): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const game: GameInterface = this.gameRooms[room];
    game.challenger = client.id;
    const response: SocketPayloadInterface = {gameRoom: room, data: {msg: `${client.id} has issued a challenge!`, challenger: client.id}};
    return GatewayUtility.broadcastTo(client, room, GamesEventsEnum.SET_CHALLENGER, response);
  }

  @SubscribeMessage(GamesEventsEnum.SET_FIRST_TO_GO)
  setFirstToGo(client: Socket, payload: SocketPayloadInterface) {
    const room = payload.gameRoom;
    const data = payload.data;
    const game: GameInterface = this.gameRooms[room];
    game.firstToGo = data.firstToGo;
  }

  @SubscribeMessage(GamesEventsEnum.START_DUEL)
  duel(client: Socket, payload: SocketPayloadInterface): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const game: GameInterface = this.gameRooms[room];
    game.status = GameStatusEnum.IN_PROGRESS;
    const response: SocketPayloadInterface = {gameRoom: room, data: {msg: `Duel!`, game: game}};
    return GatewayUtility.broadcastTo(client, room, GamesEventsEnum.DUEL, response);
  }

}
