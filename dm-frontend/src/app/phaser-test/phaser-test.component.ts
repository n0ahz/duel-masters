import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { TestScene } from "../game-engine/scenes/test.scene";

@Component({
  selector: 'app-phaser-test',
  templateUrl: './phaser-test.component.html',
  styleUrls: ['./phaser-test.component.scss']
})
export class PhaserTestComponent implements OnInit {

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [
        TestScene
      ],
      physics: {
        default: 'arcade',
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'gameContainer',
      //   width: 800,
      //   height: 600
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

}
