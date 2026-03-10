import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameInterface } from '../interfaces/game.interface';
import { GamesCommandsEnum, GamesEventsEnum } from '../enums/gateway/games-events.enum';
import { SocketService } from './socket.service';


@Injectable({
  providedIn: 'root',
})
export class GameService {

  private _game = new BehaviorSubject<GameInterface>({
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

  private _gamesList = new BehaviorSubject<GameInterface[]>([]);
  private _activeUsers = new BehaviorSubject<string[]>([]);

  readonly game$: Observable<GameInterface> = this._game.asObservable();
  readonly gamesList$: Observable<GameInterface[]> = this._gamesList.asObservable();
  readonly activeUsers$: Observable<string[]> = this._activeUsers.asObservable();

  get game(): GameInterface {
    return this._game.getValue();
  }

  set game(data: GameInterface) {
    this._game.next(data);
  }

  constructor(private socketService: SocketService) {
    this.listenToEvents();
  }

  private listenToEvents(): void {
    this.socketService.fromEvent(GamesEventsEnum.GAMES_LIST).subscribe(res => {
      if (res?.data?.games) this._gamesList.next(res.data.games);
    });
    this.socketService.fromEvent(GamesEventsEnum.USER_INFO).subscribe(res => {
      if (res?.data?.users) this._activeUsers.next(res.data.users);
    });
  }

  getGames(): void {
    this.socketService.emit(GamesCommandsEnum.GET_GAMES);
  }

  addGame(game: GameInterface): void {
    this.socketService.emit(GamesCommandsEnum.ADD_GAME, { game });
  }

  joinGame(gameIdentifier: string): void {
    this.socketService.emitTo(gameIdentifier, GamesCommandsEnum.JOIN_GAME);
    this.socketService.emit(GamesCommandsEnum.GET_GAME, { gameIdentifier });
  }

  challenge(gameIdentifier: string): void {
    this.socketService.emitTo(gameIdentifier, GamesCommandsEnum.CHALLENGE, {
      challenger: this.socketService.getCurrentSocketId(),
    });
  }

  setFirstToGo(gameIdentifier: string, firstToGo: string): void {
    this.socketService.emitTo(gameIdentifier, GamesCommandsEnum.SET_FIRST_TO_GO, { firstToGo });
  }

  startDuel(gameIdentifier: string): void {
    this.socketService.emitTo(gameIdentifier, GamesCommandsEnum.START_DUEL);
  }

  leaveGame(): void {
    this.socketService.emitTo(this.game.gameIdentifier, GamesCommandsEnum.LEAVE_GAME);
  }
}
