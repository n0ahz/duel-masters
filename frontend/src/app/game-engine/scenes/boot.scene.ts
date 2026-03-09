import Phaser from 'phaser';
import { PreloadScene } from './preload.scene';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Minimal assets needed before PreloadScene
    this.load.setBaseURL('');
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
