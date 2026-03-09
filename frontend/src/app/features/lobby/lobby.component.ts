import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { GameInterface, GameCommands, GameEvents } from '@dm/shared';
import { GameService } from '../../core/services/game.service';
import { SocketService } from '../../core/services/socket.service';
import { CreateGameDialogComponent } from './create-game-dialog.component';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="lobby-page">

      <!-- Header -->
      <div class="lobby-header">
        <div class="header-left">
          <div class="header-tag">// SYSTEM NODE_04</div>
          <h1 class="header-title">GAME LOBBY</h1>
          <div class="header-meta">{{ ((gameService.games$ | async) || []).length }} ACTIVE SESSIONS DETECTED</div>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" class="action-btn" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon>
            NEW SESSION
          </button>
          <button mat-raised-button class="action-btn action-btn--ghost" (click)="refreshGames()">
            <mat-icon>refresh</mat-icon>
            SYNC
          </button>
        </div>
      </div>

      <!-- Table panel -->
      <div class="table-panel">
        <!-- Corner decorations -->
        <span class="corner corner--tl"></span>
        <span class="corner corner--tr"></span>
        <span class="corner corner--bl"></span>
        <span class="corner corner--br"></span>

        <div class="panel-label">ACTIVE DUELS</div>

        <mat-table [dataSource]="(gameService.games$ | async) || []" class="games-table">

          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef>SESSION ID</mat-header-cell>
            <mat-cell *matCellDef="let game">
              <span class="cell-prefix">›</span>
              <span class="cell-text">{{ game.name }}</span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="inviterName">
            <mat-header-cell *matHeaderCellDef>HOST</mat-header-cell>
            <mat-cell *matCellDef="let game">
              <span class="player-tag">{{ game.inviterName || '—' }}</span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="type">
            <mat-header-cell *matHeaderCellDef>MODE</mat-header-cell>
            <mat-cell *matCellDef="let game">
              <span class="type-badge">{{ game.type }}</span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>STATUS</mat-header-cell>
            <mat-cell *matCellDef="let game">
              <span class="status-indicator" [class.status--waiting]="game.status === 'waiting'" [class.status--active]="game.status !== 'waiting'">
                <span class="status-dot-sm"></span>
                {{ game.status | uppercase }}
              </span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef></mat-header-cell>
            <mat-cell *matCellDef="let game">
              <button mat-raised-button color="accent" class="join-btn" (click)="joinGame(game)">
                ENTER
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns" class="game-row"></mat-row>
        </mat-table>

        <div *ngIf="((gameService.games$ | async) || []).length === 0" class="empty-state">
          <span class="empty-icon">◈</span>
          <span class="empty-text">NO ACTIVE SESSIONS — INITIALIZE A NEW DUEL</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .lobby-page {
      padding: 32px 40px;
      max-width: 960px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      animation: slide-in-down 0.4s ease both;
    }

    /* ── Header ── */
    .lobby-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 28px;
    }
    .header-tag {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-secondary);
      letter-spacing: 0.15em;
      margin-bottom: 4px;
    }
    .header-title {
      font-family: var(--font-display);
      font-size: 28px;
      font-weight: 900;
      color: var(--text-bright);
      letter-spacing: 0.2em;
      margin: 0 0 4px;
      text-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
    }
    .header-meta {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--neon-cyan);
      letter-spacing: 0.1em;
    }
    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .action-btn {
      height: 38px !important;
      padding: 0 18px !important;
    }
    .action-btn--ghost {
      background: transparent !important;
      color: var(--text-secondary) !important;
      border: 1px solid var(--border-dim) !important;
      font-family: var(--font-display) !important;
      font-size: 10px !important;
      letter-spacing: 0.15em !important;
      transition: all 0.2s !important;
    }
    .action-btn--ghost:hover {
      border-color: var(--border-mid) !important;
      color: var(--text-primary) !important;
    }

    /* ── Table Panel ── */
    .table-panel {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      padding: 0;
    }
    .panel-label {
      font-family: var(--font-display);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.3em;
      color: var(--text-secondary);
      background: var(--bg-card);
      position: absolute;
      top: -10px;
      left: 20px;
      padding: 0 8px;
      z-index: 2;
    }

    /* Corner brackets */
    .corner {
      position: absolute;
      width: 12px;
      height: 12px;
      border-color: var(--neon-cyan);
      border-style: solid;
      animation: corner-flash 3s ease-in-out infinite;
      z-index: 2;
    }
    .corner--tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
    .corner--tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; animation-delay: 0.75s; }
    .corner--bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; animation-delay: 1.5s; }
    .corner--br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; animation-delay: 2.25s; }

    /* Table */
    .games-table { width: 100%; background: transparent !important; }

    .cell-prefix {
      color: var(--neon-cyan);
      margin-right: 6px;
      font-size: 14px;
    }
    .cell-text { color: var(--text-bright); }

    .player-tag {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--neon-gold);
    }
    .type-badge {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-secondary);
      background: var(--bg-panel);
      border: 1px solid var(--border-dim);
      padding: 2px 8px;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.1em;
    }
    .status-dot-sm {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--text-dim);
    }
    .status--waiting .status-dot-sm {
      background: var(--neon-green);
      box-shadow: 0 0 6px var(--neon-green);
      animation: blink-dot 1.5s ease-in-out infinite;
    }
    .status--waiting { color: var(--neon-green); }
    .status--active .status-dot-sm { background: var(--neon-magenta); box-shadow: 0 0 6px var(--neon-magenta); }
    .status--active { color: var(--neon-magenta); }

    .join-btn {
      height: 30px !important;
      min-width: 72px !important;
      font-size: 9px !important;
      letter-spacing: 0.2em !important;
      padding: 0 12px !important;
    }

    .game-row { cursor: pointer; }

    /* Empty state */
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 48px 24px;
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: 0.15em;
      color: var(--text-dim);
    }
    .empty-icon {
      font-size: 20px;
      color: var(--border-dim);
    }
  `],
})
export class LobbyComponent implements OnInit {
  gameService = inject(GameService);
  private socketService = inject(SocketService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['name', 'inviterName', 'type', 'status', 'actions'];

  ngOnInit(): void {
    this.refreshGames();

    this.socketService
      .on<any>(GameEvents.GAME_CREATED)
      .subscribe((game) => {
        if (game.inviterId === this.getCurrentUserId()) {
          this.router.navigate(['/game', game.id], {
            state: { gameName: game.name, inviterId: game.inviterId, inviterName: game.inviterName },
          });
        }
      });
  }

  refreshGames(): void {
    this.socketService.emit(GameCommands.LIST_GAMES);
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(CreateGameDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.socketService.emit(GameCommands.CREATE_GAME, result);
      }
    });
  }

  joinGame(game: GameInterface): void {
    this.socketService.emit(GameCommands.JOIN_GAME, { gameId: game.id });
    this.router.navigate(['/game', game.id], {
      state: {
        gameName: game.name,
        inviterId: game.inviterId,
        inviterName: game.inviterName,
        alreadyChallenged: !!game.challengerId,
        challengerId: game.challengerId || '',
        challengerName: game.challengerName || '',
      },
    });
  }

  private getCurrentUserId(): string {
    return (this.socketService as any)?.socket?.ioSocket?.auth?.userId || '';
  }
}
