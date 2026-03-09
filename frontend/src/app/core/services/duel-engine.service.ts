import { Injectable } from '@angular/core';
import Phaser from 'phaser';
import { Subject } from 'rxjs';
import { GameStateInterface } from '@dm/shared';
import { BootScene } from '../../game-engine/scenes/boot.scene';
import { PreloadScene } from '../../game-engine/scenes/preload.scene';
import { DuelScene } from '../../game-engine/scenes/duel.scene';

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
      scene: [BootScene, PreloadScene, DuelScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
    this.game = new Phaser.Game(config);
  }

  applyGameState(state: GameStateInterface, localUserId: string): void {
    if (!this.game) return;
    // Store in registry so DuelScene can read it when it creates
    this.game.registry.set('gameState', state);
    this.game.registry.set('localUserId', localUserId);
    // If DuelScene is already active, apply immediately
    const scene = this.game.scene.getScene('DuelScene') as DuelScene | null;
    if (scene?.scene.isActive()) {
      scene.applyState(state, localUserId);
    }
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
