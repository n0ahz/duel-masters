import { Injectable } from '@angular/core';
import * as Phaser from "phaser";
import { GAME } from "../constants/game";
import { DuelScene } from "../game-engine/scenes/duel.scene";
import { GameInterface } from "../interfaces/game.interface";
import { BehaviorSubject } from "rxjs";
import { GamesEventsEnum } from "../enums/gateway/games-events.enum";
import { SocketService } from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class DuelService {

  config: Phaser.Types.Core.GameConfig;
  _game: BehaviorSubject<GameInterface>;
  game: GameInterface;

  constructor(
    private socketService: SocketService,
  ) {
    this.config = {
      parent: 'gameContainer',
      type: Phaser.AUTO,
      width: GAME.WORLD.WIDTH,
      height: GAME.WORLD.HEIGHT,
      scene: [
        DuelScene,
      ],
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      }
    };
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

  createGame(): Phaser.Game {
    return new Phaser.Game(this.config);
  }

  leaveGame() {
    this.socketService.emitTo(this.game.gameIdentifier, GamesEventsEnum.LEAVE_GAME);
  }

}
