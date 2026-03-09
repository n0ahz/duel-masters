import { Injectable } from '@angular/core';
import Phaser from 'phaser';
import { Subject } from 'rxjs';
import { GameStateInterface } from '@dm/shared';

@Injectable({ providedIn: 'root' })
export class DuelEngineService {
  private game: Phaser.Game | null = null;
  stateUpdate$ = new Subject<GameStateInterface>();

  createGame(containerId: string): void {
    if (this.game) this.destroyGame();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerId,
      width: '100%',
      height: '100%',
      backgroundColor: '#0d1117',
      scene: [],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
    this.game = new Phaser.Game(config);
  }

  destroyGame(): void {
    this.game?.destroy(true);
    this.game = null;
  }

  onStateUpdate(state: GameStateInterface): void {
    this.stateUpdate$.next(state);
  }

  getGame(): Phaser.Game | null {
    return this.game;
  }
}
