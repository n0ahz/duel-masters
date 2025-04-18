import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { GAME } from '../../constants/game';
import { TestScene } from '../../game-engine/scenes/test.scene';


@Component({
    selector: 'app-phaser-test',
    templateUrl: './phaser-test.component.html',
    styleUrls: ['./phaser-test.component.scss'],
    standalone: false
})
export class PhaserTestComponent implements OnInit {

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      parent: 'gameContainer',
      type: Phaser.AUTO,
      width: GAME.WORLD.WIDTH,
      height: GAME.WORLD.HEIGHT,
      scene: TestScene,
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

}
