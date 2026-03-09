import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameCommands, DeckInterface } from '@dm/shared';
import { SocketService } from '../../core/services/socket.service';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="decks-page">
      <div class="page-header">
        <div class="header-left">
          <div class="header-tag">// ARMORY ACCESS</div>
          <h1 class="header-title">MY DECKS</h1>
          <div class="header-meta">{{ decks.length }} DECK{{ decks.length !== 1 ? 'S' : '' }} REGISTERED</div>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" routerLink="/decks/new" class="action-btn">
            <mat-icon>add</mat-icon>
            BUILD DECK
          </button>
        </div>
      </div>

      <div class="deck-grid">
        <div *ngFor="let deck of decks" class="deck-card">
          <span class="corner corner--tl"></span>
          <span class="corner corner--br"></span>

          <div class="deck-card__header">
            <div class="deck-card__name">{{ deck.name }}</div>
            <div class="deck-card__actions">
              <button class="deck-action-btn" [routerLink]="['/decks', deck._id]" title="Edit deck">
                <mat-icon>edit</mat-icon>
              </button>
              <button class="deck-action-btn deck-action-btn--danger" (click)="deleteDeck(deck)" title="Delete deck">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </div>
          </div>

          <div class="deck-card__stats">
            <div class="deck-stat">
              <span class="deck-stat__value">{{ getDeckCardCount(deck) }}</span>
              <span class="deck-stat__label">/ 40 CARDS</span>
            </div>
            <div class="deck-stat">
              <span class="deck-stat__value">{{ deck.cards.length }}</span>
              <span class="deck-stat__label">UNIQUE</span>
            </div>
          </div>

          <div class="deck-card__civs">
            <div class="deck-civ-bar" [style.width.%]="getDeckCardCount(deck) / 40 * 100"></div>
          </div>
        </div>
      </div>

      <div *ngIf="decks.length === 0" class="empty-state">
        <span class="empty-icon">◈</span>
        <span class="empty-text">NO DECKS REGISTERED</span>
        <span class="empty-sub">BUILD YOUR FIRST DECK TO BEGIN DUELING</span>
        <button mat-raised-button color="primary" routerLink="/decks/new" class="empty-btn">
          <mat-icon>add</mat-icon>
          BUILD DECK
        </button>
      </div>
    </div>
  `,
  styles: [`
    .decks-page {
      padding: 32px 40px;
      max-width: 960px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      animation: slide-in-down 0.4s ease both;
    }

    .page-header {
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
    }
    .header-meta {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--neon-cyan);
      letter-spacing: 0.1em;
    }
    .action-btn { height: 38px !important; padding: 0 18px !important; }

    /* Deck grid */
    .deck-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }
    .deck-card {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      padding: 16px;
      transition: border-color 0.2s;
    }
    .deck-card:hover { border-color: var(--border-mid); }

    .corner {
      position: absolute;
      width: 10px;
      height: 10px;
      border-color: var(--neon-cyan);
      border-style: solid;
      opacity: 0.4;
    }
    .corner--tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
    .corner--br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

    .deck-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
    }
    .deck-card__name {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--text-bright);
      letter-spacing: 0.1em;
      flex: 1;
    }
    .deck-card__actions { display: flex; gap: 4px; }
    .deck-action-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-dim);
      padding: 2px;
      display: flex;
      transition: color 0.2s;
    }
    .deck-action-btn:hover { color: var(--neon-cyan); }
    .deck-action-btn--danger:hover { color: #f44336; }
    .deck-action-btn mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; }

    .deck-card__stats {
      display: flex;
      gap: 16px;
      margin-bottom: 10px;
    }
    .deck-stat { display: flex; align-items: baseline; gap: 4px; }
    .deck-stat__value {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 900;
      color: var(--neon-cyan);
      line-height: 1;
    }
    .deck-stat__label {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-secondary);
      letter-spacing: 0.1em;
    }

    .deck-card__civs { height: 3px; background: var(--bg-panel); overflow: hidden; }
    .deck-civ-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
      transition: width 0.3s;
      min-width: 4px;
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 80px 24px;
      font-family: var(--font-mono);
      letter-spacing: 0.15em;
    }
    .empty-icon { font-size: 36px; color: var(--border-dim); }
    .empty-text { font-size: 14px; color: var(--text-dim); }
    .empty-sub { font-size: 10px; color: var(--text-dim); opacity: 0.6; }
    .empty-btn { margin-top: 8px; height: 38px !important; padding: 0 20px !important; }
  `],
})
export class DeckListComponent implements OnInit {
  private socketService = inject(SocketService);
  private gameService = inject(GameService);
  private destroyRef = inject(DestroyRef);

  decks: DeckInterface[] = [];

  ngOnInit(): void {
    this.gameService.decks$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((decks) => (this.decks = decks));

    this.socketService.emit(GameCommands.GET_DECKS);
  }

  getDeckCardCount(deck: DeckInterface): number {
    return deck.cards.reduce((sum, c) => sum + c.copies, 0);
  }

  deleteDeck(deck: DeckInterface): void {
    if (!confirm(`Delete deck "${deck.name}"?`)) return;
    this.socketService.emit(GameCommands.DELETE_DECK, { deckId: deck._id });
  }
}
