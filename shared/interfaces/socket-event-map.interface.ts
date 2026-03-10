import { GamesCommandsEnum, GamesEventsEnum } from '../enums/gateway/games-events.enum';
import { CommonCommandsEnum, CommonEventsEnum } from '../enums/gateway/common-events.enum';
import { CoinTossCommandsEnum, CoinTossEventsEnum } from '../enums/gateway/coin-toss-events.enum';
import { DuelCommandsEnum, DuelEventsEnum } from '../enums/gateway/duel-events.enum';
import { GameInterface } from './game.interface';
import { ZoneCardInterface } from './zone-card.interface';

/** Maps client-sent command events to their payload data types */
export interface SocketCommandMap {
  [GamesCommandsEnum.ADD_GAME]:        { game: GameInterface };
  [GamesCommandsEnum.GET_GAME]:        { gameIdentifier: string };
  [GamesCommandsEnum.GET_GAMES]:       undefined;
  [GamesCommandsEnum.JOIN_GAME]:       undefined;
  [GamesCommandsEnum.LEAVE_GAME]:      undefined;
  [GamesCommandsEnum.CHALLENGE]:       { challenger: string };
  [GamesCommandsEnum.SET_FIRST_TO_GO]: { firstToGo: string };
  [GamesCommandsEnum.START_DUEL]:      undefined;

  [CommonCommandsEnum.MSG_TO_SERVER]:  { msg: string };

  [CoinTossCommandsEnum.COIN_SIDE_CHOSEN]:   { coinSide: string };
  [CoinTossCommandsEnum.COIN_FLIPPED]:       { flipResult: number };
  [CoinTossCommandsEnum.DUEL_DECISION_MADE]: { duelDecision: boolean; game: GameInterface };

  [DuelCommandsEnum.SET_UP]:         { game: GameInterface };
  [DuelCommandsEnum.IKUJO]:          { duelDeck: ZoneCardInterface[] };
  [DuelCommandsEnum.KOI]:            { duelDeck: ZoneCardInterface[] };
  [DuelCommandsEnum.DROP_CARDS]:     any;
  [DuelCommandsEnum.TAP_UNTAP_CARD]: any;
}

/** Maps server-emitted event names to their payload data types */
export interface SocketEventMap {
  [GamesEventsEnum.GAMES_LIST]:     { games: GameInterface[] };
  [GamesEventsEnum.GAME_INFO]:      { game: GameInterface; msg?: string };
  [GamesEventsEnum.USER_INFO]:      { users: string[] };
  [GamesEventsEnum.SET_CHALLENGER]: { msg: string; challenger: string };
  [GamesEventsEnum.INVITER_LEFT]:   { msg: string; inviterSocketId: string };
  [GamesEventsEnum.DUEL]:           { msg: string; game: GameInterface };
  [GamesEventsEnum.RESET_GAME]:     undefined;

  [CommonEventsEnum.MSG_TO_CLIENT]: { msg: string };

  [CoinTossEventsEnum.SET_COIN_SIDE]:     { chooser: string; coinSide: string };
  [CoinTossEventsEnum.START_COIN_FLIP]:   { flipper: string; flipResult: number };
  [CoinTossEventsEnum.SET_DUEL_DECISION]: { firstToGo: string; duelDecision: boolean; decisionMaker: string; msg: string };

  [DuelEventsEnum.ALL_SET]:        { allSet: boolean };
  [DuelEventsEnum.IKUJO]:          { msg: string; duelDeck: ZoneCardInterface[] };
  [DuelEventsEnum.KOI]:            { msg: string; duelDeck: ZoneCardInterface[] };
  [DuelEventsEnum.DROP_CARDS]:     any;
  [DuelEventsEnum.TAP_UNTAP_CARD]: any;
}
