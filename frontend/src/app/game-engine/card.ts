import Phaser from 'phaser';
import { ZoneCardInterface, CardInterface, CARD_DIMENSIONS } from '@dm/shared';
import { CivilizationFactory } from './factories/civilization.factory';

export class CardGameObject extends Phaser.GameObjects.Container {
  private cardData: ZoneCardInterface;
  private faceRect!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private costText!: Phaser.GameObjects.Text;
  private tapped = false;

  static readonly WIDTH = CARD_DIMENSIONS.WIDTH;
  static readonly HEIGHT = CARD_DIMENSIONS.HEIGHT;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cardData: ZoneCardInterface,
    faceUp = true,
  ) {
    super(scene, x, y);
    this.cardData = cardData;
    this.build(faceUp);
    scene.add.existing(this);
  }

  private build(faceUp: boolean): void {
    const w = CardGameObject.WIDTH;
    const h = CardGameObject.HEIGHT;

    if (!faceUp) {
      // Card back
      const back = this.scene.add.rectangle(0, 0, w, h, 0x2244aa);
      back.setStrokeStyle(1, 0x4466cc);
      this.add(back);
      return;
    }

    const card = this.cardData.card as CardInterface;
    const civColor = CivilizationFactory.getColor(card.civilizations?.[0]);

    // Card face background
    this.faceRect = this.scene.add.rectangle(0, 0, w, h, 0x111122);
    this.faceRect.setStrokeStyle(1, civColor);
    this.add(this.faceRect);

    // Civilization color bar at top
    const civBar = this.scene.add.rectangle(0, -h / 2 + 10, w, 20, civColor, 0.6);
    this.add(civBar);

    // Card name
    this.nameText = this.scene.add.text(0, -h / 2 + 24, card.name || '', {
      font: '9px monospace',
      color: '#ffffff',
      wordWrap: { width: w - 8 },
    });
    this.nameText.setOrigin(0.5, 0);
    this.add(this.nameText);

    // Cost
    this.costText = this.scene.add.text(-w / 2 + 4, -h / 2 + 2, `${card.cost}`, {
      font: '11px monospace',
      color: '#ffdd44',
      backgroundColor: '#000000aa',
      padding: { x: 2, y: 1 },
    });
    this.add(this.costText);

    // Power (if creature)
    if (card.power) {
      const powerText = this.scene.add.text(w / 2 - 4, h / 2 - 2, card.power, {
        font: '9px monospace',
        color: '#ff8844',
      });
      powerText.setOrigin(1, 1);
      this.add(powerText);
    }

    // Make interactive
    this.setSize(w, h);
    this.setInteractive({ cursor: 'pointer' });
  }

  tapCard(): void {
    if (this.tapped) return;
    this.tapped = true;
    this.scene.tweens.add({
      targets: this,
      angle: 90,
      duration: 250,
      ease: 'Power2',
    });
  }

  untapCard(): void {
    if (!this.tapped) return;
    this.tapped = false;
    this.scene.tweens.add({
      targets: this,
      angle: 0,
      duration: 250,
      ease: 'Power2',
    });
  }

  get isTapped(): boolean {
    return this.tapped;
  }

  getCardData(): ZoneCardInterface {
    return this.cardData;
  }
}
