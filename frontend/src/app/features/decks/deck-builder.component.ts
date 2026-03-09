import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CardInterface, GameCommands, GAME_CONSTANTS, Civilization, CardType, CardSet } from '@dm/shared';
import { SocketService } from '../../core/services/socket.service';
import { GameService } from '../../core/services/game.service';

interface DeckEntry {
  card: CardInterface;
  copies: number;
}

@Component({
  selector: 'app-deck-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <div class="builder-page">

      <!-- Header -->
      <div class="builder-header">
        <div class="header-left">
          <a routerLink="/decks" class="back-link">
            <mat-icon>arrow_back</mat-icon>
            DECKS
          </a>
          <h1 class="header-title">{{ editingDeckId ? 'EDIT DECK' : 'BUILD DECK' }}</h1>
        </div>
        <div class="header-right">
          <mat-form-field appearance="outline" class="name-field">
            <mat-label>Deck Name</mat-label>
            <input matInput [(ngModel)]="deckName" placeholder="My Deck" maxlength="50" />
          </mat-form-field>
          <button
            mat-raised-button
            color="primary"
            class="save-btn"
            [disabled]="!deckName.trim() || totalCards === 0 || saving"
            (click)="saveDeck()"
          >
            <mat-icon>save</mat-icon>
            {{ editingDeckId ? 'UPDATE DECK' : 'SAVE DECK' }}
          </button>
        </div>
      </div>

      <div class="builder-body">

        <!-- Left: Deck canvas -->
        <div class="deck-canvas">
          <div class="canvas-header">
            <span class="canvas-title">// CURRENT DECK</span>
            <span class="canvas-count" [class.canvas-count--full]="totalCards === DECK_MAX">
              {{ totalCards }} / {{ DECK_MAX }}
            </span>
          </div>

          <div class="deck-entries">
            <div *ngFor="let entry of deckEntries" class="deck-entry">
              <div class="entry-civ-dot" [class]="getCivClass(entry.card.civilizations)"></div>
              <div class="entry-info">
                <span class="entry-name">{{ entry.card.name }}</span>
                <span class="entry-cost">COST {{ entry.card.cost }}</span>
              </div>
              <div class="entry-controls">
                <button class="copy-btn" (click)="removeCopy(entry)" title="Remove copy">−</button>
                <span class="entry-copies">{{ entry.copies }}</span>
                <button
                  class="copy-btn"
                  (click)="addCopy(entry)"
                  [disabled]="entry.copies >= 4 || totalCards >= DECK_MAX"
                  title="Add copy"
                >+</button>
              </div>
            </div>
          </div>

          <div *ngIf="deckEntries.length === 0" class="canvas-empty">
            <span class="canvas-empty__icon">◈</span>
            <span class="canvas-empty__text">ADD CARDS FROM THE BROWSER →</span>
          </div>

          <div class="canvas-footer" *ngIf="deckEntries.length > 0">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="totalCards / DECK_MAX * 100"></div>
            </div>
          </div>
        </div>

        <!-- Right: Card browser -->
        <div class="card-browser">
          <div class="browser-filters">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Search</mat-label>
              <mat-icon matPrefix class="search-icon">search</mat-icon>
              <input matInput [(ngModel)]="search" (ngModelChange)="loadCards()" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field filter-field--sm">
              <mat-label>Civilization</mat-label>
              <mat-select [(ngModel)]="civilization" (ngModelChange)="loadCards()">
                <mat-option value="">ALL</mat-option>
                <mat-option *ngFor="let civ of civilizations" [value]="civ">{{ civ }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field filter-field--sm">
              <mat-label>Type</mat-label>
              <mat-select [(ngModel)]="cardType" (ngModelChange)="loadCards()">
                <mat-option value="">ALL</mat-option>
                <mat-option *ngFor="let t of cardTypes" [value]="t">{{ t }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field filter-field--md">
              <mat-label>Set</mat-label>
              <mat-select [(ngModel)]="cardSet" (ngModelChange)="loadCards()">
                <mat-option value="">ALL</mat-option>
                <mat-option *ngFor="let s of cardSets" [value]="s">{{ s }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="card-list">
            <div *ngFor="let card of cards" class="card-row">
              <div class="card-civ-bar" [class]="getCivClass(card.civilizations)"></div>
              <div class="card-row__info">
                <span class="card-row__name">{{ card.name }}</span>
                <span class="card-row__meta">{{ card.civilizations?.join(' / ') }} · COST {{ card.cost }}
                  <span *ngIf="card.power">· PWR {{ card.power }}</span>
                </span>
              </div>
              <div class="card-row__copies" *ngIf="getCopiesInDeck(card) > 0">
                <span class="copies-badge">×{{ getCopiesInDeck(card) }}</span>
              </div>
              <button
                class="add-btn"
                (click)="addCard(card)"
                [disabled]="getCopiesInDeck(card) >= 4 || totalCards >= DECK_MAX"
              >
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>

          <div *ngIf="cards.length === 0" class="browser-empty">
            <span>NO RECORDS MATCH QUERY</span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .builder-page {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 56px);
      padding: 16px 24px;
      position: relative;
      z-index: 1;
    }

    /* Header */
    .builder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
      flex-shrink: 0;
    }
    .header-left { display: flex; flex-direction: column; gap: 2px; }
    .back-link {
      display: flex; align-items: center; gap: 4px;
      font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary);
      letter-spacing: 0.15em; text-decoration: none; transition: color 0.2s;
    }
    .back-link:hover { color: var(--neon-cyan); }
    .back-link mat-icon { font-size: 14px !important; width: 14px !important; height: 14px !important; }
    .header-title {
      font-family: var(--font-display); font-size: 22px; font-weight: 900;
      color: var(--text-bright); letter-spacing: 0.2em; margin: 0;
    }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .name-field { width: 220px; }
    .save-btn { height: 38px !important; padding: 0 18px !important; }

    /* Body split */
    .builder-body {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 16px;
      flex: 1;
      min-height: 0;
    }

    /* Deck canvas */
    .deck-canvas {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      overflow: hidden;
    }
    .canvas-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 14px; border-bottom: 1px solid var(--border-dim); flex-shrink: 0;
    }
    .canvas-title { font-family: var(--font-mono); font-size: 9px; color: var(--text-secondary); letter-spacing: 0.2em; }
    .canvas-count {
      font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--neon-cyan);
    }
    .canvas-count--full { color: var(--neon-magenta); }
    .deck-entries { flex: 1; overflow-y: auto; padding: 4px 0; min-height: 0; scrollbar-width: thin; }
    .deck-entry {
      display: flex; align-items: center; gap: 8px;
      padding: 5px 14px; border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .deck-entry:hover { background: var(--bg-panel); }
    .entry-civ-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .entry-civ-dot.civ-light    { background: #fffde7; }
    .entry-civ-dot.civ-water    { background: #00bcd4; }
    .entry-civ-dot.civ-darkness { background: #9c27b0; }
    .entry-civ-dot.civ-fire     { background: #f44336; }
    .entry-civ-dot.civ-nature   { background: #4caf50; }
    .entry-civ-dot.civ-multi    { background: linear-gradient(135deg, #f44336, #00bcd4); }
    .entry-civ-dot.civ-default  { background: var(--border-dim); }
    .entry-info { flex: 1; min-width: 0; }
    .entry-name { font-family: var(--font-display); font-size: 10px; font-weight: 600; color: var(--text-bright); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .entry-cost { font-family: var(--font-mono); font-size: 9px; color: var(--text-secondary); }
    .entry-controls { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
    .copy-btn {
      width: 18px; height: 18px; background: var(--bg-panel); border: 1px solid var(--border-dim);
      color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 13px; line-height: 1; padding: 0; transition: all 0.15s;
    }
    .copy-btn:hover:not([disabled]) { border-color: var(--neon-cyan); color: var(--neon-cyan); }
    .copy-btn[disabled] { opacity: 0.3; cursor: default; }
    .entry-copies { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--text-bright); width: 14px; text-align: center; }
    .canvas-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px; }
    .canvas-empty__icon { font-size: 24px; color: var(--border-dim); }
    .canvas-empty__text { font-family: var(--font-mono); font-size: 9px; color: var(--text-dim); letter-spacing: 0.15em; }
    .canvas-footer { padding: 8px 14px; border-top: 1px solid var(--border-dim); flex-shrink: 0; }
    .progress-bar { height: 3px; background: var(--bg-panel); }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta)); transition: width 0.3s; }

    /* Card browser */
    .card-browser {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      overflow: hidden;
    }
    .browser-filters {
      display: flex; flex-wrap: wrap; gap: 10px; padding: 10px 14px;
      border-bottom: 1px solid var(--border-dim); flex-shrink: 0;
    }
    .filter-field { flex: 1; min-width: 120px; }
    .filter-field--sm { flex: 0 0 140px; }
    .filter-field--md { flex: 0 0 180px; }
    .search-icon { font-size: 14px !important; width: 14px !important; height: 14px !important; color: var(--text-secondary) !important; margin-right: 4px; }
    .card-list { flex: 1; overflow-y: auto; min-height: 0; scrollbar-width: thin; }
    .card-row {
      display: flex; align-items: center; gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      padding: 6px 14px; transition: background 0.15s; position: relative;
    }
    .card-row:hover { background: var(--bg-panel); }
    .card-civ-bar { width: 3px; height: 32px; flex-shrink: 0; border-radius: 1px; }
    .card-civ-bar.civ-light    { background: linear-gradient(180deg, #fffde7, #fff9c4); }
    .card-civ-bar.civ-water    { background: linear-gradient(180deg, #00bcd4, #0288d1); }
    .card-civ-bar.civ-darkness { background: linear-gradient(180deg, #9c27b0, #4a148c); }
    .card-civ-bar.civ-fire     { background: linear-gradient(180deg, #f44336, #e91e63); }
    .card-civ-bar.civ-nature   { background: linear-gradient(180deg, #4caf50, #2e7d32); }
    .card-civ-bar.civ-multi    { background: linear-gradient(180deg, #f44336, #4caf50); }
    .card-civ-bar.civ-default  { background: var(--border-dim); }
    .card-row__info { flex: 1; min-width: 0; }
    .card-row__name { font-family: var(--font-display); font-size: 11px; font-weight: 600; color: var(--text-bright); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-row__meta { font-family: var(--font-mono); font-size: 9px; color: var(--text-secondary); }
    .card-row__copies { margin-right: 4px; }
    .copies-badge {
      font-family: var(--font-display); font-size: 10px; font-weight: 700; color: var(--neon-gold);
      background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); padding: 1px 5px;
    }
    .add-btn {
      width: 26px; height: 26px; background: var(--bg-panel); border: 1px solid var(--border-dim);
      color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s; flex-shrink: 0;
    }
    .add-btn:hover:not([disabled]) { border-color: var(--neon-cyan); color: var(--neon-cyan); background: var(--neon-cyan-dim); }
    .add-btn[disabled] { opacity: 0.3; cursor: default; }
    .add-btn mat-icon { font-size: 16px !important; width: 16px !important; height: 16px !important; }
    .browser-empty { padding: 32px; text-align: center; font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.15em; }
  `],
})
export class DeckBuilderComponent implements OnInit {
  private http = inject(HttpClient);
  private socketService = inject(SocketService);
  private gameService = inject(GameService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly DECK_MAX = GAME_CONSTANTS.DECK_MAX;
  readonly civilizations = Object.values(Civilization);
  readonly cardTypes = Object.values(CardType);
  readonly cardSets = Object.values(CardSet);

  editingDeckId: string | null = null;
  saving = false;
  deckName = '';
  search = '';
  civilization = '';
  cardType = '';
  cardSet = '';
  cards: CardInterface[] = [];
  deckEntries: DeckEntry[] = [];

  get totalCards(): number {
    return this.deckEntries.reduce((sum, e) => sum + e.copies, 0);
  }

  ngOnInit(): void {
    const deckId = this.route.snapshot.paramMap.get('deckId');
    if (deckId) {
      this.editingDeckId = deckId;
      this.loadExistingDeck(deckId);
    }
    this.loadCards();
  }

  private loadExistingDeck(deckId: string): void {
    this.gameService.decks$.pipe(
      take(1),
      switchMap((decks) => {
        const found = decks.find((d) => d._id === deckId);
        if (found) return of(found);
        // Decks not yet loaded — request them and wait
        this.socketService.emit(GameCommands.GET_DECKS);
        return this.gameService.decks$.pipe(
          switchMap((d2) => of(d2.find((d) => d._id === deckId) ?? null)),
          take(1),
        );
      }),
    ).subscribe((deck) => {
      if (!deck) return;
      this.deckName = deck.name;
      if (deck.cards.length === 0) return;
      const requests = deck.cards.map((entry) =>
        this.http.get<CardInterface>(`http://localhost:3000/cards/${entry.cardId}`),
      );
      forkJoin(requests).subscribe((cardResults) => {
        this.deckEntries = deck.cards.map((entry, i) => ({
          card: cardResults[i],
          copies: entry.copies,
        }));
      });
    });
  }

  loadCards(): void {
    const params: Record<string, string> = {};
    if (this.search) params['search'] = this.search;
    if (this.civilization) params['civilization'] = this.civilization;
    if (this.cardType) params['type'] = this.cardType;
    if (this.cardSet) params['set'] = this.cardSet;
    this.http
      .get<CardInterface[]>('http://localhost:3000/cards', { params })
      .subscribe((cards) => (this.cards = cards));
  }

  addCard(card: CardInterface): void {
    if (this.totalCards >= this.DECK_MAX) return;
    const existing = this.deckEntries.find((e) => e.card._id === card._id);
    if (existing) {
      if (existing.copies < 4) existing.copies++;
    } else {
      this.deckEntries.push({ card, copies: 1 });
    }
  }

  addCopy(entry: DeckEntry): void {
    if (entry.copies < 4 && this.totalCards < this.DECK_MAX) {
      entry.copies++;
    }
  }

  removeCopy(entry: DeckEntry): void {
    entry.copies--;
    if (entry.copies <= 0) {
      this.deckEntries = this.deckEntries.filter((e) => e !== entry);
    }
  }

  getCopiesInDeck(card: CardInterface): number {
    return this.deckEntries.find((e) => e.card._id === card._id)?.copies ?? 0;
  }

  getCivClass(civs: string[] | undefined): string {
    if (!civs || civs.length === 0) return 'civ-default';
    if (civs.length > 1) return 'civ-multi';
    const civ = civs[0].toLowerCase();
    if (civ.includes('light'))   return 'civ-light';
    if (civ.includes('water'))   return 'civ-water';
    if (civ.includes('dark'))    return 'civ-darkness';
    if (civ.includes('fire'))    return 'civ-fire';
    if (civ.includes('nature'))  return 'civ-nature';
    return 'civ-default';
  }

  saveDeck(): void {
    const name = this.deckName.trim();
    if (!name || this.deckEntries.length === 0) return;
    const cards = this.deckEntries.map((e) => ({
      cardId: e.card._id!,
      copies: e.copies,
    }));
    if (this.editingDeckId) {
      this.socketService.emit(GameCommands.UPDATE_DECK, { deckId: this.editingDeckId, name, cards });
    } else {
      this.socketService.emit(GameCommands.CREATE_DECK, { name, cards });
    }
    this.router.navigate(['/decks']);
  }
}
