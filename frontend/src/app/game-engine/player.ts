import Phaser from 'phaser';
import { PlayerState, ZoneType } from '@dm/shared';
import { Zone } from './zone';
import { ZONE_LAYOUT } from '@dm/shared';

export class Player {
  readonly userId: string;
  readonly username: string;
  readonly isBottom: boolean;
  private zones: Map<ZoneType, Zone> = new Map();

  constructor(
    scene: Phaser.Scene,
    state: PlayerState,
    isBottom: boolean,
    boardWidth: number,
    boardHeight: number,
  ) {
    this.userId = state.userId;
    this.username = state.username;
    this.isBottom = isBottom;

    this.createZones(scene, state, isBottom, boardWidth, boardHeight);
  }

  private createZones(
    scene: Phaser.Scene,
    state: PlayerState,
    isBottom: boolean,
    w: number,
    h: number,
  ): void {
    const deckX = w - 80;
    const graveX = w - 80;
    const midX = w / 2;
    const cardW = 80;
    const cardH = 112;

    const yMap = isBottom
      ? {
          hand: h - 60,
          mana: h - 180,
          battle: h / 2 + 80,
          shields: h / 2 + 200,
          deck: h - 120,
          grave: h - 220,
        }
      : {
          hand: 60,
          mana: 180,
          battle: h / 2 - 80,
          shields: h / 2 - 200,
          deck: 120,
          grave: 220,
        };

    const zoneConfigs: Array<{ type: ZoneType; x: number; y: number; w: number; h: number; label: string; faceUp: boolean }> = [
      { type: ZoneType.HAND, x: midX, y: yMap.hand, w: w - 200, h: cardH + 10, label: 'HAND', faceUp: isBottom },
      { type: ZoneType.MANA, x: midX, y: yMap.mana, w: w - 200, h: cardH + 10, label: 'MANA', faceUp: true },
      { type: ZoneType.BATTLE_ZONE, x: midX, y: yMap.battle, w: w - 200, h: cardH + 10, label: 'BATTLE ZONE', faceUp: true },
      { type: ZoneType.SHIELDS, x: midX, y: yMap.shields, w: 300, h: cardH + 10, label: 'SHIELDS', faceUp: false },
      { type: ZoneType.DECK, x: deckX, y: yMap.deck, w: cardW + 10, h: cardH + 10, label: 'DECK', faceUp: false },
      { type: ZoneType.GRAVEYARD, x: graveX, y: yMap.grave, w: cardW + 10, h: cardH + 10, label: 'GY', faceUp: true },
    ];

    for (const cfg of zoneConfigs) {
      const zone = new Zone(scene, cfg.type, cfg.x, cfg.y, cfg.w, cfg.h, cfg.label);
      const cardData = state.zones[cfg.type] ?? [];
      zone.setCards(cardData, cfg.faceUp);
      this.zones.set(cfg.type, zone);
    }
  }

  getZone(type: ZoneType): Zone | undefined {
    return this.zones.get(type);
  }

  destroy(): void {
    this.zones.forEach((z) => z.destroy());
    this.zones.clear();
  }
}
