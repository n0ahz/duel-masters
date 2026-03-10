import { Injectable } from '@nestjs/common';
import { GameInterface } from '../interfaces/game.interface';

@Injectable()
export class CoinTossService {
  resolveDuelDecision(
    socketId: string,
    game: GameInterface,
    duelDecision: boolean,
  ): { firstToGo: string; msg: string } {
    const isInviter = socketId === game.inviter;
    const label = isInviter ? '<b>Inviter</b>' : '<b>Challenger</b>';
    const order = duelDecision ? '1st' : '2nd';
    const firstToGo = duelDecision
      ? socketId
      : isInviter
      ? game.challenger
      : game.inviter;
    return {
      firstToGo,
      msg: `${label} has decided to go <b>${order}</b>`,
    };
  }
}
