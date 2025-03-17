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
    // if (this.game.gameIdentifier) {
    this.phaserGame = this.duelService.createGame();
    this.phaserGame.scene.start('duel', {
      socketService: this.socketService,
      gameService: this.gameService,
      duelService: this.duelService,
    });
    // } else {
    //   this.endGame();
    // }
    this.socketService.handleEvent(GamesEventsEnum.INVITER_LEFT, (res) => {
      // this.endGame();
    });
    this.socketService.handleEvent(GamesEventsEnum.RESET_GAME, (res) => {
      // this.endGame();
    });
  }

  goFullScreen() {
    let elem = document.documentElement;
    let methodToBeInvoked = elem['requestFullscreen'] || elem['webkitRequestFullScreen'] || elem['mozRequestFullscreen'] || elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  exitFullScreen() {
    let elem = document;
    let methodToBeInvoked = elem['exitFullscreen'] || elem['webkitExitFullscreen'] || elem['mozCancelFullScreen'] || elem['msExitFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
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
    setTimeout(() => {
      this.router.navigateByUrl('/games/list');
    }, 2000);
  }

  ngOnDestroy(): void {
    this.gameService.leaveGame();
    this.socketService.removeAllListeners();
  }
}
