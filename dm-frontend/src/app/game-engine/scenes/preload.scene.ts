import * as Phaser from 'phaser';
import { SocketService } from '../../services/socket.service';
import { GameService } from '../../services/game.service';
import { DuelService } from '../../services/duel.service';

export interface DuelSceneData {
  socketService: SocketService;
  gameService: GameService;
  duelService: DuelService;
}

export class PreloadScene extends Phaser.Scene {
  private sceneData: DuelSceneData;

  constructor() {
    super({ key: 'preload' });
  }

  init(data: DuelSceneData): void {
    this.sceneData = data;
  }

  preload(): void {
    this.load.setBaseURL('');
    this.load.image('bg', 'assets/imgs/bg.jpg');
    this.load.image('cardBack', 'assets/imgs/card-back.png');
    // Zone icons
    this.load.image('hand', 'assets/imgs/zones/hand.png');
    this.load.image('mana', 'assets/imgs/zones/mana.png');
    this.load.image('shield', 'assets/imgs/zones/shield.png');
    this.load.image('deck', 'assets/imgs/zones/deck.png');
    this.load.image('grave', 'assets/imgs/zones/grave.png');
    this.load.image('battle', 'assets/imgs/zones/battle.png');
    this.load.image('hs', 'assets/imgs/zones/hs.png');
    // Avatar icons
    this.load.image('hakuoh', 'assets/imgs/avatars/hakuoh.png');
    this.load.image('kokujo', 'assets/imgs/avatars/kokujo.png');

  }

  create(): void {
    this.scene.start('duel', this.sceneData);
  }
}
