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
import { GatewayUtility } from '../utils/gateway.utility';
import { DuelEventsEnum } from '../enums/gateway/duel-events.enum';
import { ZoneCardInterface } from '../interfaces/zone-card.interface';
import * as uuid from 'uuid';

@WebSocketGateway()
export class DuelGateway implements OnGatewayInit {
  persons: { [gameIdentifier: string]: string[] } = {}; // volatile data storage..use db?..

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DuelGateway');

  afterInit(server: Server) {
    this.persons = {};
  }

  @SubscribeMessage(DuelEventsEnum.SET_UP)
  setUp(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const game = data.game;
    if (!(game?.gameIdentifier in this.persons)) {
      this.persons[game.gameIdentifier] = [];
    }
    this.persons[game.gameIdentifier].push(client.id);
    const allSet =
      this.persons[game.gameIdentifier].indexOf(game.inviter) !== -1 &&
      this.persons[game.gameIdentifier].indexOf(game.challenger) !== -1;
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { allSet: allSet },
    };
    return GatewayUtility.broadcastTo(
      client,
      room,
      DuelEventsEnum.ALL_SET,
      response,
    );
  }

  @SubscribeMessage(DuelEventsEnum.IKUJO)
  ikujo(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const cards: ZoneCardInterface[] = data.duelDeck;
    cards.forEach((each) => (each.uid = uuid.v4()));
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { msg: 'Ikuzo..!', duelDeck: data.duelDeck },
    };
    return GatewayUtility.broadcastTo(
      client,
      room,
      DuelEventsEnum.IKUJO,
      response,
    );
  }

  @SubscribeMessage(DuelEventsEnum.KOI)
  koi(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const cards: ZoneCardInterface[] = data.duelDeck;
    cards.forEach((each) => (each.uid = uuid.v4()));
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { msg: 'Koi..!', duelDeck: data.duelDeck },
    };
    return GatewayUtility.broadcastTo(
      client,
      room,
      DuelEventsEnum.KOI,
      response,
    );
  }

  @SubscribeMessage(DuelEventsEnum.DROP_CARDS)
  cardDropped(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const response: SocketPayloadInterface = { gameRoom: room, data: data };
    return GatewayUtility.broadcastTo(
      client,
      room,
      DuelEventsEnum.DROP_CARDS,
      response,
    );
  }

  @SubscribeMessage(DuelEventsEnum.TAP_UNTAP_CARD)
  tapUntapCard(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const data = payload.data;
    const response: SocketPayloadInterface = { gameRoom: room, data: data };
    return GatewayUtility.broadcastTo(
      client,
      room,
      DuelEventsEnum.TAP_UNTAP_CARD,
      response,
    );
  }
}
