import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CardInterface, Civilization, CardType } from '@dm/shared';
import { CardDetailDialogComponent } from './card-detail-dialog.component';

@Component({
  selector: 'app-card-browser',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="browser-page">

      <!-- Page header -->
      <div class="browser-header">
        <div class="header-left">
          <div class="header-tag">// DATABASE ACCESS GRANTED</div>
          <h1 class="header-title">CARD ARCHIVE</h1>
        </div>
        <div class="results-counter">
          <span class="counter-value">{{ cards.length }}</span>
          <span class="counter-label">RECORDS FOUND</span>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <span class="filter-label">FILTER:</span>
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
            <mat-option value="Creature">CREATURE</mat-option>
            <mat-option value="Spell">SPELL</mat-option>
            <mat-option value="Cross Gear">CROSS GEAR</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Card grid -->
      <div class="card-grid">
        <div
          *ngFor="let card of cards; let i = index"
          class="card-tile"
          (click)="openDetail(card)"
          [style.animation-delay]="(i % 20) * 25 + 'ms'"
        >
          <!-- Corner accent -->
          <span class="tile-corner tile-corner--tl"></span>
          <span class="tile-corner tile-corner--br"></span>

          <!-- Civ color bar -->
          <div class="civ-bar" [class]="getCivClass(card.civilizations)"></div>

          <div class="tile-content">
            <div class="tile-name">{{ card.name }}</div>
            <div class="tile-civ">{{ card.civilizations?.join(' / ') }}</div>
            <div class="tile-stats">
              <span class="stat-chip">COST {{ card.cost }}</span>
              <span *ngIf="card.power" class="stat-chip stat-chip--power">PWR {{ card.power }}</span>
            </div>
            <div class="tile-type">{{ card.type }}</div>
          </div>

          <div class="tile-hover-glow"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="cards.length === 0" class="empty-state">
        <span class="empty-icon">◈</span>
        <span>NO RECORDS MATCH QUERY</span>
      </div>

    </div>
  `,
  styles: [`
    .browser-page {
      padding: 28px 32px;
      position: relative;
      z-index: 1;
      animation: fade-in 0.3s ease both;
    }

    /* ── Header ── */
    .browser-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
    }
    .header-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-secondary);
      letter-spacing: 0.15em;
      margin-bottom: 4px;
    }
    .header-title {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 900;
      color: var(--text-bright);
      letter-spacing: 0.2em;
      margin: 0;
      text-shadow: 0 0 20px rgba(0, 245, 255, 0.15);
    }
    .results-counter {
      text-align: right;
    }
    .counter-value {
      display: block;
      font-family: var(--font-display);
      font-size: 32px;
      font-weight: 900;
      color: var(--neon-cyan);
      line-height: 1;
      text-shadow: var(--neon-cyan-glow);
    }
    .counter-label {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-secondary);
      letter-spacing: 0.2em;
    }

    /* ── Filters ── */
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-secondary);
      letter-spacing: 0.2em;
      flex-shrink: 0;
    }
    .filter-field { flex: 1; min-width: 160px; }
    .filter-field--sm { flex: 0 0 150px; }
    .search-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: var(--text-secondary) !important;
      margin-right: 4px;
    }

    /* ── Card Grid ── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 10px;
    }

    .card-tile {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      height: 175px;
      cursor: pointer;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
      animation: slide-in-up 0.3s ease both;
    }
    .card-tile:hover {
      border-color: var(--neon-cyan);
      transform: translateY(-3px);
    }
    .card-tile:hover .tile-hover-glow {
      opacity: 1;
    }
    .card-tile:hover .tile-corner { opacity: 1; }

    .tile-hover-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(0, 245, 255, 0.08) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }

    .tile-corner {
      position: absolute;
      width: 8px;
      height: 8px;
      border-color: var(--neon-cyan);
      border-style: solid;
      opacity: 0.3;
      transition: opacity 0.2s;
      z-index: 2;
    }
    .tile-corner--tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
    .tile-corner--br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

    /* Civilization color bar */
    .civ-bar {
      height: 3px;
      width: 100%;
    }
    .civ-bar.civ-light    { background: linear-gradient(90deg, #fffde7, #fff9c4); }
    .civ-bar.civ-water    { background: linear-gradient(90deg, #00bcd4, #0288d1); }
    .civ-bar.civ-darkness { background: linear-gradient(90deg, #673ab7, #311b92); }
    .civ-bar.civ-fire     { background: linear-gradient(90deg, #f44336, #e91e63); }
    .civ-bar.civ-nature   { background: linear-gradient(90deg, #4caf50, #2e7d32); }
    .civ-bar.civ-multi    { background: linear-gradient(90deg, #f44336, #4caf50, #00bcd4, #673ab7, #fffde7); }
    .civ-bar.civ-default  { background: var(--border-dim); }

    .tile-content {
      padding: 8px 10px;
    }
    .tile-name {
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 700;
      color: var(--text-bright);
      letter-spacing: 0.05em;
      line-height: 1.3;
      margin-bottom: 4px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tile-civ {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-secondary);
      letter-spacing: 0.1em;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .tile-stats {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: 6px;
    }
    .stat-chip {
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.1em;
      color: var(--neon-cyan);
      background: var(--neon-cyan-dim);
      border: 1px solid rgba(0, 245, 255, 0.2);
      padding: 1px 5px;
    }
    .stat-chip--power {
      color: var(--neon-magenta);
      background: var(--neon-magenta-dim);
      border-color: rgba(255, 0, 144, 0.2);
    }
    .tile-type {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* ── Empty state ── */
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 64px 24px;
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: 0.2em;
      color: var(--text-dim);
    }
    .empty-icon { font-size: 22px; }
  `],
})
export class CardBrowserComponent implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  cards: CardInterface[] = [];
  search = '';
  civilization = '';
  cardType = '';
  civilizations = Object.values(Civilization);

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    const params: Record<string, string> = {};
    if (this.search) params['search'] = this.search;
    if (this.civilization) params['civilization'] = this.civilization;
    if (this.cardType) params['type'] = this.cardType;

    this.http
      .get<CardInterface[]>('http://localhost:3000/cards', { params })
      .subscribe((cards) => (this.cards = cards));
  }

  openDetail(card: CardInterface): void {
    this.dialog.open(CardDetailDialogComponent, {
      data: card,
      width: '500px',
    });
  }

  getCivClass(civs: string[] | undefined): string {
    if (!civs || civs.length === 0) return 'civ-default';
    if (civs.length > 1) return 'civ-multi';
    const civ = civs[0].toLowerCase();
    if (civ.includes('light'))    return 'civ-light';
    if (civ.includes('water'))    return 'civ-water';
    if (civ.includes('dark'))     return 'civ-darkness';
    if (civ.includes('fire'))     return 'civ-fire';
    if (civ.includes('nature'))   return 'civ-nature';
    return 'civ-default';
  }
}
