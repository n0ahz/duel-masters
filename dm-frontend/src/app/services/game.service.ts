import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameInterface } from '../interfaces/game.interface';
import { GamesEventsEnum } from '../enums/gateway/games-events.enum';
import { SocketService } from './socket.service';


@Injectable({
  providedIn: 'root',
})
export class GameService {

  _game: BehaviorSubject<GameInterface>;

  get game(): GameInterface {
    return this._game.getValue();
  }

  set game(data: GameInterface) {
    this._game.next(data);
  }

  constructor(
    private socketService: SocketService,
  ) {
    this._game = new BehaviorSubject<GameInterface>({
      name: null,
      inviter: null,
      challenger: null,
      firstToGo: null,
      gameIdentifier: null,
      gameType: undefined,
      status: undefined,
      createdAt: null,
      endedAt: null,
    });
  }

  leaveGame() {
    this.socketService.emitTo(this.game.gameIdentifier, GamesEventsEnum.LEAVE_GAME);
  }
}
