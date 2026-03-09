import Phaser from 'phaser';
import { PlayerSide, GameStateInterface } from '@dm/shared';
import { Player } from './player';

export class DuelZone {
  private scene: Phaser.Scene;
  private side: PlayerSide;
  private player: Player | null = null;
  private boardWidth: number;
  private boardHeight: number;

  constructor(
    scene: Phaser.Scene,
    side: PlayerSide,
    boardWidth: number,
    boardHeight: number,
  ) {
    this.scene = scene;
    this.side = side;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
  }

  applyPlayerState(state: GameStateInterface, userId: string): void {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    const playerState = state.players[userId];
    if (!playerState) return;

    const isBottom = this.side === PlayerSide.BOTTOM;
    this.player = new Player(
      this.scene,
      playerState,
      isBottom,
      this.boardWidth,
      this.boardHeight,
    );
  }

  destroy(): void {
    this.player?.destroy();
  }
}
