import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { DuelScene } from '../game-engine/scenes/duel.scene';
import { GAME } from '../constants/game';
import { MatDialog } from '@angular/material/dialog';
import { CardInfoComponent } from '../components/modals/card-info/card-info.component';
import { Card } from '../game-engine/card';


@Injectable({
  providedIn: 'root',
})
export class DuelService {

  config: Phaser.Types.Core.GameConfig;

  constructor(
    private dialog: MatDialog,
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
      },
    };
  }

  createGame(): Phaser.Game {
    return new Phaser.Game(this.config);
  }

  showCardInfoModal(card: Card) {
    console.log(card);
    const dialogRef = this.dialog.open(CardInfoComponent, {
      width: '80%',
      data: card,
    });

    dialogRef.afterClosed().subscribe(result => {
      // nothing..
    });
  }

}
