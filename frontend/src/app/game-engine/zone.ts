import Phaser from 'phaser';
import { ZoneType, ZoneCardInterface, ZONE_LAYOUT, CARD_DIMENSIONS } from '@dm/shared';
import { CardGameObject } from './card';

export class Zone {
  private scene: Phaser.Scene;
  private zoneType: ZoneType;
  private cards: CardGameObject[] = [];
  private container: Phaser.GameObjects.Container;
  private label: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    zoneType: ZoneType,
    x: number,
    y: number,
    width: number,
    height: number,
    labelText: string,
  ) {
    this.scene = scene;
    this.zoneType = zoneType;

    this.container = scene.add.container(x, y);

    this.background = scene.add.rectangle(0, 0, width, height, 0x0a0a1a, 0.4);
    this.background.setStrokeStyle(1, 0x222244, 0.6);
    this.container.add(this.background);

    this.label = scene.add.text(-width / 2 + 4, -height / 2 + 2, labelText, {
      font: '10px monospace',
      color: '#44446a',
    });
    this.container.add(this.label);
  }

  setCards(cardData: ZoneCardInterface[], faceUp = true): void {
    this.cards.forEach((c) => c.destroy());
    this.cards = [];

    const { WIDTH, HEIGHT } = CARD_DIMENSIONS;
    const spacing = ZONE_LAYOUT.CARD_SPACING_X;
    const startX = -(cardData.length - 1) * (spacing / 2);

    cardData.forEach((data, i) => {
      const cardObj = new CardGameObject(
        this.scene,
        this.container.x + startX + i * spacing,
        this.container.y,
        data,
        faceUp,
      );
      this.cards.push(cardObj);
    });
  }

  getCards(): CardGameObject[] {
    return this.cards;
  }

  get type(): ZoneType {
    return this.zoneType;
  }

  destroy(): void {
    this.cards.forEach((c) => c.destroy());
    this.container.destroy();
  }
}
