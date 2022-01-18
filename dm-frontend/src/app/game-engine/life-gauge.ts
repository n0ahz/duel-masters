import * as Phaser from "phaser";
import { DuelScene } from "./scenes/duel.scene";
import { GAME } from "../constants/game";
import { PlayerSidesEnum } from "../enums/player-sides.enum";
import CircleMaskImage from 'phaser3-rex-plugins/plugins/circlemaskimage.js';


export class LifeGauge {
  bar: Phaser.GameObjects.Rectangle;
  bg: Phaser.GameObjects.Rectangle;
  avatar: Phaser.GameObjects.Arc;
  color: number;
  value: number;

  constructor(scene: DuelScene, side: PlayerSidesEnum, avatarImg?: string, color?: number) {
    const padding = 5;
    const x = GAME.WORLD.WIDTH-(GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/4;
    const y = side === PlayerSidesEnum.BOTTOM ? GAME.STAGE.HEIGHT - 50/2 : 50/2;
    const w = (GAME.WORLD.WIDTH-GAME.STAGE.WIDTH)/2 - padding*2;
    const h = 50;
    this.color = color ? color : 0xFFFF00;

    this.bg = scene.add.rectangle(x, y, w, h, 0xffffff, 1);
    this.bar = scene.add.rectangle(x, y, w, h, this.color, 1);

    if (!avatarImg) {
      // default loaded avatar image textures
      avatarImg = side === PlayerSidesEnum.BOTTOM ? 'hakuoh' : 'kokujo';
    }
    const r = 35;
    const avatarX = side === PlayerSidesEnum.BOTTOM ? GAME.WORLD.WIDTH/2 + GAME.STAGE.WIDTH/2 + r : GAME.WORLD.WIDTH - r;
    const avatarY = y + (side === PlayerSidesEnum.BOTTOM ? -7 : 7);
    this.avatar = new CircleMaskImage(scene, avatarX, avatarY, avatarImg);
    this.avatar.displayWidth = r*2;
    this.avatar.displayHeight = this.avatar.height * this.avatar.displayWidth / this.avatar.width;
    scene.add.existing(this.avatar);
  }

  setValue(percentage) {
    this.bar.scaleX = percentage / 100;
    this.bar.setX(this.bar.x - (this.bg.width - this.bar.displayWidth)/2);

    if (percentage <=20) {
      this.bar.setFillStyle(0xFF0000, 1);
    }
  }
}
