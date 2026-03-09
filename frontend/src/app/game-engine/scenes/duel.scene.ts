import Phaser from 'phaser';
import { GameStateInterface, ZoneType, PlayerSide, ZONE_LAYOUT, CARD_DIMENSIONS } from '@dm/shared';
import { DuelZone } from '../duel-zone';

export class DuelScene extends Phaser.Scene {
  private bottomZones!: DuelZone;
  private topZones!: DuelZone;
  private statusText!: Phaser.GameObjects.Text;
  private onStateUpdate?: (state: GameStateInterface) => void;

  constructor() {
    super({ key: 'DuelScene' });
  }

  init(data: { onStateUpdate?: (state: GameStateInterface) => void }): void {
    this.onStateUpdate = data?.onStateUpdate;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Draw board background
    this.drawBoard(width, height);

    // Create zone managers for both sides
    this.bottomZones = new DuelZone(this, PlayerSide.BOTTOM, width, height);
    this.topZones = new DuelZone(this, PlayerSide.TOP, width, height);

    // Phase/status display
    this.statusText = this.add
      .text(width / 2, height / 2, '', {
        font: '16px monospace',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(10);
  }

  override update(_time: number, _delta: number): void {
    // Per-frame logic (animations, hover effects)
  }

  applyState(state: GameStateInterface): void {
    const playerIds = Object.keys(state.players);
    if (playerIds.length < 2) return;

    // Update status text
    this.statusText.setText(
      `Phase: ${state.currentPhase} | Turn: ${state.turnNumber}`,
    );
  }

  private drawBoard(width: number, height: number): void {
    const g = this.add.graphics();

    // Background
    g.fillStyle(0x0d1117, 1);
    g.fillRect(0, 0, width, height);

    // Center divider line
    g.lineStyle(1, 0x2a2a4a, 0.8);
    g.strokeLineShape(new Phaser.Geom.Line(0, height / 2, width, height / 2));

    // Zone label helper
    const labelStyle = { font: '11px monospace', color: '#555577' };

    const zones: Array<{ label: string; x: number; y: number; w: number; h: number }> = [
      { label: 'BATTLE ZONE', x: 80, y: height / 2 + 20, w: width - 240, h: 120 },
      { label: 'BATTLE ZONE', x: 80, y: height / 2 - 140, w: width - 240, h: 120 },
      { label: 'MANA', x: 80, y: height - 200, w: width - 240, h: 80 },
      { label: 'MANA', x: 80, y: 120, w: width - 240, h: 80 },
      { label: 'HAND', x: 80, y: height - 110, w: width - 240, h: 90 },
      { label: 'HAND', x: 80, y: 20, w: width - 240, h: 90 },
    ];

    zones.forEach(({ label, x, y, w, h }) => {
      g.lineStyle(1, 0x1a1a3a, 1);
      g.strokeRect(x, y, w, h);
      this.add.text(x + 4, y + 2, label, labelStyle);
    });
  }
}
