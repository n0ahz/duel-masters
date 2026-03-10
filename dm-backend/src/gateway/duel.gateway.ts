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
import { DuelCommandsEnum, DuelEventsEnum } from '../enums/gateway/duel-events.enum';
import { ZoneCardInterface } from '../interfaces/zone-card.interface';
import { DuelStateService } from '../services/duel-state.service';
import * as uuid from 'uuid';

@WebSocketGateway({ cors: true, origin: '*' })
export class DuelGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DuelGateway');

  constructor(private readonly duelStateService: DuelStateService) {}

  afterInit(server: Server) {}

  @SubscribeMessage(DuelCommandsEnum.SET_UP)
  setUp(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const game = payload.data?.game;
    if (!game?.gameIdentifier) {
      return { event: 'error', data: { message: 'Invalid game payload' } } as any;
    }
    this.duelStateService.register(game.gameIdentifier, client.id);
    const allSet = this.duelStateService.isAllSet(game.gameIdentifier, game.inviter, game.challenger);
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { allSet },
    };
    return GatewayUtility.broadcastTo(client, room, DuelEventsEnum.ALL_SET, response);
  }

  @SubscribeMessage(DuelCommandsEnum.IKUJO)
  ikujo(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const cards: ZoneCardInterface[] = payload.data?.duelDeck;
    if (!cards) {
      return { event: 'error', data: { message: 'Invalid duel deck' } } as any;
    }
    cards.forEach((each) => {
      each.uid = uuid.v4();
      each.ownerId = client.id;
      each.isTapped = false;
    });
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { msg: 'Ikuzo..!', duelDeck: cards },
    };
    return GatewayUtility.broadcastTo(client, room, DuelEventsEnum.IKUJO, response);
  }

  @SubscribeMessage(DuelCommandsEnum.KOI)
  koi(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const cards: ZoneCardInterface[] = payload.data?.duelDeck;
    if (!cards) {
      return { event: 'error', data: { message: 'Invalid duel deck' } } as any;
    }
    cards.forEach((each) => {
      each.uid = uuid.v4();
      each.ownerId = client.id;
      each.isTapped = false;
    });
    const response: SocketPayloadInterface = {
      gameRoom: room,
      data: { msg: 'Koi..!', duelDeck: cards },
    };
    return GatewayUtility.broadcastTo(client, room, DuelEventsEnum.KOI, response);
  }

  @SubscribeMessage(DuelCommandsEnum.DROP_CARDS)
  cardDropped(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const response: SocketPayloadInterface = { gameRoom: room, data: payload.data };
    return GatewayUtility.broadcastTo(client, room, DuelEventsEnum.DROP_CARDS, response);
  }

  @SubscribeMessage(DuelCommandsEnum.TAP_UNTAP_CARD)
  tapUntapCard(
    client: Socket,
    payload: SocketPayloadInterface,
  ): WsResponse<SocketPayloadInterface> {
    const room = payload.gameRoom;
    const response: SocketPayloadInterface = { gameRoom: room, data: payload.data };
    return GatewayUtility.broadcastTo(client, room, DuelEventsEnum.TAP_UNTAP_CARD, response);
  }
}
