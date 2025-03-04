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
  game: GameInterface;

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
    this._game.asObservable().subscribe(game => this.game = game);
  }

  leaveGame() {
    this.socketService.emitTo(this.game.gameIdentifier, GamesEventsEnum.LEAVE_GAME);
  }
}
