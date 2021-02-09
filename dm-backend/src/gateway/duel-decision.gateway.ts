import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from "@nestjs/common";
import { Socket, Server } from 'socket.io';
import { SocketPayloadInterface } from "../interfaces/socket-payload.interface";
import { CoinTossEventsEnum } from "../enums/gateway/coin-toss-events.enum";
import { GameInterface } from "../interfaces/game.interface";

@WebSocketGateway()
export class DuelDecisionGateway {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DuelDecisionGateway');

  @SubscribeMessage(CoinTossEventsEnum.COIN_SIDE_CHOSEN)
  changeCoinSide(client: Socket, payload: SocketPayloadInterface): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const response: SocketPayloadInterface = {gameRoom: room, data: {chooser: client.id, coinSide: data.coinSide}};
    client.to(room).emit(CoinTossEventsEnum.SET_COIN_SIDE, response);
    return {event: CoinTossEventsEnum.SET_COIN_SIDE, data: response};
  }

  @SubscribeMessage(CoinTossEventsEnum.COIN_FLIPPED)
  coinFlipped(client: Socket, payload: SocketPayloadInterface): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const response: SocketPayloadInterface = {gameRoom: room, data: {flipper: client.id, flipResult: data.flipResult}};
    client.to(room).emit(CoinTossEventsEnum.START_COIN_FLIP, response);
    return {event: CoinTossEventsEnum.START_COIN_FLIP, data: response};
  }

  @SubscribeMessage(CoinTossEventsEnum.DUEL_DECISION_MADE)
  changeDuelDecision(client: Socket, payload: SocketPayloadInterface): WsResponse<unknown> {
    const room = payload.gameRoom;
    const data = payload.data;
    const game: GameInterface = data.game;
    const response = {
      gameRoom: room,
      data: {
        msg: `${client.id === game.inviter ? '<b>Inviter</b>' : '<b>Challenger</b>'} has decided to go <b>${data.duelDecision ? '1st': '2nd'}</b>`,
        duelDecision: data.duelDecision,
        decisionMaker: client.id,
        firstToGo: data.duelDecision ? client.id: (client.id === game.inviter ? game.challenger : game.inviter),
      },
    };
    client.to(room).emit(CoinTossEventsEnum.SET_DUEL_DECISION, response);
    return {event: CoinTossEventsEnum.SET_DUEL_DECISION, data: response};
  }

}
