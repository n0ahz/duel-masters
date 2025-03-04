import { ZoneCardInterface } from '../interfaces/zone-card.interface';
import { Card } from './card';
import * as Phaser from 'phaser';
import DuelZone from './duel-zone';
import { CARD, GAME } from '../constants/game';
import { PlayerSidesEnum } from '../enums/player-sides.enum';
import { ZoneVisibilitiesEnum } from '../enums/zone-visibilities.enum';
import { ZoneTypesEnum } from '../enums/zone-types.enum';
import { DuelEventsEnum } from '../enums/gateway/duel-events.enum';
import { ZoneSpacingEnum } from '../enums/zone-spacing.enum';


export class ZoneCard implements ZoneCardInterface {

  card: Card;
  uid: string;
  ownerId?: string;
  isTapped?: boolean;
  cardImg?: Phaser.GameObjects.Image;

  constructor(zoneCardDto: ZoneCardInterface) {
    this.card = new Card(zoneCardDto.card);
    this.uid = zoneCardDto.uid;
    this.ownerId = zoneCardDto.ownerId;
    this.isTapped = zoneCardDto.isTapped === undefined ? false : zoneCardDto.isTapped;
  }

  cardImageLoadHandler(zone: DuelZone, texture: string, destinationX?: number, destinationY?: number) {
    const self = this;
    if (!destinationX) destinationX = zone.dropArea.x;
    if (!destinationY) destinationY = zone.dropArea.y;
    this.cardImg = zone.scene.add.image(destinationX, destinationY, texture).setInteractive(); // at middle..
    const factor = zone.side !== undefined ? ((zone.dropArea.height / CARD.CONTAINER.HEIGHT) * 0.95) : 1;
    this.cardImg.displayWidth = CARD.CONTAINER.WIDTH * factor;
    this.cardImg.displayHeight = CARD.CONTAINER.HEIGHT * factor;
    this.setCardImageDirection(zone);
    if (!zone.cardStacked) {
      if (zone.side !== undefined) {
        this.positionAllCards(zone);
      } else {
        if (this.ownerId !== zone.scene.socketService.getCurrentSocketId()) {
          const x = GAME.WORLD.WIDTH / 2 + (GAME.WORLD.WIDTH / 2 - this.cardImg.x);
          const y = GAME.WORLD.HEIGHT / 2 + (GAME.WORLD.HEIGHT / 2 - this.cardImg.y);
          this.cardImg.setX(x);
          this.cardImg.setY(y);
        }
        if (this.isTapped) {
          this.cardImg.setAngle(Phaser.Math.RadToDeg(this.tapUntapCard()));
        }
      }
    }
    zone.incrementCardRenderedCount();

    if (zone.side === PlayerSidesEnum.BOTTOM || this.ownerId === zone.scene.socketService.getCurrentSocketId()) {
      zone.scene.input.setDraggable(this.cardImg);
      this.cardImg.off('drag').on('drag', function (pointer, dragX, dragY) {
        if (zone.canDrawCards) {
          this.x = dragX;
          this.y = dragY;
        }
      });
      this.cardImg.off('dragstart').on('dragstart', function (pointer, dragX, dragY) {
        zone.scene.children.bringToTop(this);
        // change image size to smaller for hand zone
        if (zone.name === 'Hand') {
          this.displayWidth /= factor;
          this.displayHeight /= factor;
        }
      });
      this.cardImg.off('dragend').on('dragend', function (pointer, dragX, dragY, dropped) {
        if (!dropped) {
          self.negateCardDragDropEffect(this, zone, factor);
        }
      });
      this.cardImg.off('drop').on('drop', function (pointer, targetDropZone) {
        const targetZone = targetDropZone.data.values.zone;
        if (targetZone !== undefined && targetZone.canPutCards && zone.canDrawCards && (!targetZone.side || targetZone.side === zone.side)) {
          if (zone.uid !== targetZone.uid || zone.side === undefined) {
            const data = { zoneCard: self, fromZone: zone.uid, toZone: targetZone.uid };
            if (!targetZone.side) {
              data['x'] = this.x;
              data['y'] = this.y;
            }
            zone.scene.socketService.emitTo(zone.scene.gameService.game.gameIdentifier, DuelEventsEnum.DROP_CARDS, data);
          } else {
            self.negateCardDragDropEffect(this, zone, factor);
          }
        } else {
          self.negateCardDragDropEffect(this, zone, factor);
        }
      });
      this.cardImg.off('pointerdown').on('pointerdown', function (pointer) {
        if (pointer.rightButtonDown()) {
          if (pointer.getDuration() < 500) {
            if (zone.cardsCanTap) {
              zone.scene.socketService.emitTo(zone.scene.gameService.game.gameIdentifier, DuelEventsEnum.TAP_UNTAP_CARD, {
                zoneCardId: self.uid,
                zoneId: zone.uid,
              });
            }
          }
        } else {
          // open a popup menu
          console.log(self.card);
          // if (!(zone.visibility === ZoneVisibilitiesEnum.OFF || (zone.type === ZoneTypesEnum.OWN && zone.visibility === ZoneVisibilitiesEnum.PRIVATE && zone.side !== PlayerSidesEnum.BOTTOM))) {
          //   zone.scene.renderCardInfo(self);
          // }
        }
      });
    }
    this.cardImg.off('pointer').on('pointerover', function (pointer) {
      zone.scene.renderCardDisplay(this);
    });
    this.cardImg.off('pointerout').on('pointerout', function (pointer) {
      zone.scene.destroyCardDisplay();
    });
    this.cardImg.off('dragleave').on('dragleave', function (pointer) {
      zone.scene.destroyCardDisplay();
    });
  }

  positionAllCards(zone: DuelZone) {
    const cardWidth = (zone.cardsCanTap ? this.cardImg.displayHeight : this.cardImg.displayWidth);
    const allCards = zone.cards.map(c => c.cardImg);
    switch (zone.zoneCardSpacing) {
      case ZoneSpacingEnum.QUEUED:
        allCards.forEach((eachCardImg, index) => {
          const cardSpacing = cardWidth / 2 + index * cardWidth;
          if (zone.side === PlayerSidesEnum.BOTTOM) {
            eachCardImg.setX(zone.dropArea.x - zone.dropArea.width / 2 + cardSpacing);
          } else {
            eachCardImg.setX(zone.dropArea.x + zone.dropArea.width / 2 - cardSpacing);
          }
        });
        break;
      case ZoneSpacingEnum.EVEN:
        const internalSpacing = (zone.dropArea.width - allCards.length * cardWidth) / (allCards.length + 1);
        allCards.forEach((eachCardImg, index) => {
          const cardSpacing = (cardWidth / 2) + (index * cardWidth) + (internalSpacing * (index + 1));
          if (zone.side === PlayerSidesEnum.BOTTOM) {
            eachCardImg.setX(zone.dropArea.x - zone.dropArea.width / 2 + cardSpacing);
          } else {
            eachCardImg.setX(zone.dropArea.x + zone.dropArea.width / 2 - cardSpacing);
          }
        });
        break;
      default:
        break;
    }
  }

  negateCardDragDropEffect(cardImg: Phaser.GameObjects.Image, zone: DuelZone, factor: number) {
    cardImg.x = cardImg.input.dragStartX;
    cardImg.y = cardImg.input.dragStartY;
    if (zone.name === 'Hand') {
      cardImg.displayWidth *= factor;
      cardImg.displayHeight *= factor;
    }
  }

  tapUntapCard(): number {
    let isTapped = false;
    let rotation = 0;
    let objAngle = Phaser.Math.DegToRad(this.cardImg.angle).toFixed(2);
    switch (objAngle) {
      case '0.00':
        rotation = Phaser.Math.DegToRad(90);
        isTapped = true;
        break;
      case Phaser.Math.DegToRad(-180).toFixed(2):
        rotation = Phaser.Math.DegToRad(-90);
        isTapped = true;
        break;
      case Phaser.Math.DegToRad(-90).toFixed(2):
        rotation = Phaser.Math.DegToRad(-180);
        break;
      default:
        rotation = 0;
        break;
    }
    this.isTapped = isTapped;
    return rotation;
  }

  setCardImageDirection(zone: DuelZone) {
    let cardAngle = 0;
    if (this.ownerId !== zone.scene.socketService.getCurrentSocketId()) {
      cardAngle += 180;
    }
    if (!zone.cardStraight) {
      cardAngle += 180;
    }
    this.cardImg.setAngle(cardAngle);
  }

  render(zone: DuelZone, xOrd?: number, yOrd?: number) {
    if (zone.visibility === ZoneVisibilitiesEnum.OFF || (zone.type === ZoneTypesEnum.OWN && zone.visibility === ZoneVisibilitiesEnum.PRIVATE && zone.side !== PlayerSidesEnum.BOTTOM)) {
      this.cardImageLoadHandler(zone, 'cardBack', xOrd, yOrd);
    } else {
      zone.scene.load.image(this.card.image, 'assets/imgs/cards/' + this.card.image);
      zone.scene.load.once('complete', () => {
        this.cardImageLoadHandler(zone, this.card.image, xOrd, yOrd);
      });
      zone.scene.load.start();
    }
  }
}
