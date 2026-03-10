import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { SocketPayloadInterface } from '../interfaces/socket-payload.interface';
import { CoinTossCommandsEnum, CoinTossEventsEnum } from '../enums/gateway/coin-toss-events.enum';
import { GatewayUtility } from '../utils/gateway.utility';
import { CoinTossService } from '../services/coin-toss.service';

@WebSocketGateway({ cors: true, origin: '*' })
export class DuelDecisionGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DuelDecisionGateway');

  constructor(private readonly coinTossService: CoinTossService) {}

  @SubscribeMessage(CoinTossCommandsEnum.COIN_SIDE_CHOSEN)
  changeCoinSide(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { chooser: client.id, coinSide: payload.data?.coinSide },
    };
    return GatewayUtility.broadcastTo(client, room, CoinTossEventsEnum.SET_COIN_SIDE, response);
  }

  @SubscribeMessage(CoinTossCommandsEnum.COIN_FLIPPED)
  coinFlipped(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { flipper: client.id, flipResult: payload.data?.flipResult },
    };
    return GatewayUtility.broadcastTo(client, room, CoinTossEventsEnum.START_COIN_FLIP, response);
  }

  @SubscribeMessage(CoinTossCommandsEnum.DUEL_DECISION_MADE)
  changeDuelDecision(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<unknown> {
    const room = payload.gameRoom;
    const game = payload.data?.game;
    const duelDecision = payload.data?.duelDecision;
    const { firstToGo, msg } = this.coinTossService.resolveDuelDecision(client.id, game, duelDecision);
    const response = {
      gameRoom: room,
      data: { msg, duelDecision, decisionMaker: client.id, firstToGo },
    };
    return GatewayUtility.broadcastTo(client, room, CoinTossEventsEnum.SET_DUEL_DECISION, response);
  }
}
