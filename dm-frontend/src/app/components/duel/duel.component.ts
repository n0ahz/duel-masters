import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { DuelService } from '../../services/duel.service';
import { GameInterface } from '../../interfaces/game.interface';
import { SocketService } from '../../services/socket.service';
import { GamesEventsEnum } from '../../enums/gateway/games-events.enum';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';


@Component({
    selector: 'app-duel',
    templateUrl: './duel.component.html',
    styleUrls: ['./duel.component.scss'],
    standalone: false
})
export class DuelComponent implements OnInit, OnDestroy {

  phaserGame: Phaser.Game;
  isFullScreen: boolean;

  constructor(
    private router: Router,
    private socketService: SocketService,
    private gameService: GameService,
    private duelService: DuelService,
  ) {
    this.isFullScreen = false;
  }

  get game(): GameInterface {
    return this.gameService.game;
  }

  ngOnInit() {
    this.phaserGame = this.duelService.createGame();
    this.phaserGame.scene.start('preload', {
      socketService: this.socketService,
      gameService: this.gameService,
      duelService: this.duelService,
    });
    this.socketService.handleEvent(GamesEventsEnum.INVITER_LEFT, () => {
      // this.endGame();
    });
    this.socketService.handleEvent(GamesEventsEnum.RESET_GAME, () => {
      // this.endGame();
    });
  }

  goFullScreen() {
    const elem = document.documentElement;
    const method = elem['requestFullscreen'] || elem['webkitRequestFullScreen'] || elem['mozRequestFullscreen'] || elem['msRequestFullscreen'];
    if (method) method.call(elem);
  }

  exitFullScreen() {
    const elem = document as any;
    const method = elem['exitFullscreen'] || elem['webkitExitFullscreen'] || elem['mozCancelFullScreen'] || elem['msExitFullscreen'];
    if (method) method.call(elem);
  }

  toggleFullScreen() {
    if (this.isFullScreen) {
      this.exitFullScreen();
      this.isFullScreen = false;
    } else {
      this.goFullScreen();
      this.isFullScreen = true;
    }
  }

  endGame() {
    setTimeout(() => this.router.navigateByUrl('/games/list'), 2000);
  }

  ngOnDestroy(): void {
    this.phaserGame?.destroy(true);
    this.gameService.leaveGame();
    this.socketService.removeAllListeners();
  }
}
