import { ZoneInterface } from '../interfaces/zone.interface';
import { ZonesEnum } from '../enums/zones.enum';
import { PlayerSidesEnum } from '../enums/player-sides.enum';
import { ZoneTypesEnum } from '../enums/zone-types.enum';
import { ZoneVisibilitiesEnum } from '../enums/zone-visibilities.enum';
import { ZoneCard } from './zone-card';
import { DuelScene } from './scenes/duel.scene';
import * as Phaser from 'phaser';
import * as _ from 'lodash';
import { PositionsEnum } from '../enums/positions.enum';
import { ZoneSpacingEnum } from '../enums/zone-spacing.enum';

export default class DuelZone implements ZoneInterface {

  name: ZonesEnum;
  side?: PlayerSidesEnum;
  cardsCanTap?: boolean;
  type?: ZoneTypesEnum;
  uid?: string;
  visibility?: ZoneVisibilitiesEnum;
  cardStraight?: boolean;
  cardStacked?: boolean;
  zoneCardSpacing?: ZoneSpacingEnum;
  canSwitchCardSpacing?: boolean;
  canDrawCards?: boolean;
  canPutCards?: boolean;

  scene?: DuelScene;
  cards?: ZoneCard[];
  cardsRendered?: number;
  dropArea?: Phaser.GameObjects.Zone;
  outline?: Phaser.GameObjects.Graphics;

  constructor(zoneDto: ZoneInterface, scene: DuelScene) {
    this.name = zoneDto.name;
    this.side = zoneDto.side;
    this.cardsCanTap = zoneDto.cardsCanTap === undefined ? false : zoneDto.cardsCanTap;
    this.type = zoneDto.type === undefined ? ZoneTypesEnum.OWN : zoneDto.type;
    this.uid = zoneDto.uid;
    this.visibility = zoneDto.visibility === undefined ? ZoneVisibilitiesEnum.PRIVATE : zoneDto.visibility;
    this.cardStraight = zoneDto.cardStraight === undefined ? true : zoneDto.cardStraight;
    this.cardStacked = zoneDto.cardStacked === undefined ? false : zoneDto.cardStacked;
    this.zoneCardSpacing = zoneDto.zoneCardSpacing === undefined ? ZoneSpacingEnum.QUEUED : zoneDto.zoneCardSpacing;
    this.canSwitchCardSpacing = zoneDto.canSwitchCardSpacing === undefined ? false : zoneDto.canSwitchCardSpacing;
    this.canDrawCards = true;  // will be set programmatically to true at certain states
    this.canPutCards = true; // will be set programmatically to true at certain states
    this.scene = scene;
    this.cards = [];
    this.cardsRendered = 0;
  }

  putCards(zoneCards: ZoneCard[], xOrd?: number, yOrd?: number) {
    zoneCards.forEach(zoneCard => {
      this.cards.push(zoneCard);
      zoneCard.render(this, xOrd, yOrd);
    });
  }

  removeCard(zoneCard: ZoneCard, all?: boolean) {
    if (all === undefined) all = false;
    if (all) {
      this.cards = this.cards.filter(each => {
        if (each.card === zoneCard.card) {
          this.destroyRenderedCard(each);
        }
        return each.card !== zoneCard.card;
      });
    } else {
      this.cards = this.cards.filter(each => {
        if (each.uid === zoneCard.uid) {
          this.destroyRenderedCard(each);
        }
        return each.uid !== zoneCard.uid;
      });
    }
  }

  destroyRenderedCard(zoneCard: ZoneCard) {
    zoneCard.cardImg.destroy();
    this.decrementCardRenderedCount();
    if (!this.cardStacked && this.side !== undefined) {
      setTimeout(() => {
        zoneCard.positionAllCards(this);
      }, 1000);
    }
  }

  takeCards(count?: number, position?: PositionsEnum) {
    if (!count) count = 1;
    if (!position) position = PositionsEnum.TOP;
    let cards = [];
    switch (position) {
      case PositionsEnum.TOP:
        cards = _.take(this.cards, count);
        break;
      case PositionsEnum.MIDDLE:
        let middleIndex = 0;
        for (let i = 0; i < count; i++) {
          middleIndex = _.floor(this.cards.length / 2);
          if (this.cards[middleIndex] !== undefined) {
            cards.push(this.cards[middleIndex]);
          }
        }
        break;
      case PositionsEnum.BOTTOM:
        cards = _.takeRight(this.cards, count);
        break;
      case PositionsEnum.RANDOM:
        cards = _.sample(this.cards, count);
        break;
      default:
        break;
    }
    return cards;
  }

  transferCards(zoneCards: ZoneCard[], targetZone: DuelZone, xOrd?: number, yOrd?: number) {
    zoneCards.forEach((zoneCard) => {
      this.removeCard(zoneCard);
      targetZone.putCards([zoneCard], xOrd, yOrd);
    });
  }

  empty() {
    this.cards = [];
  }

  switchCardSpacingType() {
    if (this.canSwitchCardSpacing) {
      if (this.cardsRendered >= 11) {
        this.zoneCardSpacing = ZoneSpacingEnum.EVEN;
      } else {
        this.zoneCardSpacing = ZoneSpacingEnum.QUEUED;
      }
    }
  }

  incrementCardRenderedCount() {
    this.switchCardSpacingType();
    this.cardsRendered++;
  }

  decrementCardRenderedCount() {
    this.switchCardSpacingType();
    this.cardsRendered--;
  }

  noOfCards() {
    return this.cards.length;
  }

  lock() {
    this.canDrawCards = false;
    this.canPutCards = false;
  }

  unlock() {
    this.canDrawCards = true;
    this.canPutCards = false;
  }

  render(xCoordinate, yCoordinate, width, height) {
    const self = this;
    this.dropArea = this.scene.add.zone(xCoordinate, yCoordinate, width, height).setRectangleDropZone(width, height);
    this.dropArea.setData({
      zone: self,
    });
    this.dropArea.on('pointerdown', (pointer) => {
      console.log(this);
    });
    this.outline = this.scene.add.graphics();
    this.outline.lineStyle(1, 0xBFFF00);
    this.outline.strokeRoundedRect(this.dropArea.x - this.dropArea.input.hitArea.width / 2, this.dropArea.y - this.dropArea.input.hitArea.height / 2, this.dropArea.input.hitArea.width, this.dropArea.input.hitArea.height, {
      tl: 5,
      tr: 5,
      bl: 5,
      br: 5,
    });
  }
}
