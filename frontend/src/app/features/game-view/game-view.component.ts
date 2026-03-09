import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GameCommands,
  GameEvents,
  ChatMessageInterface,
  DeckInterface,
} from '@dm/shared';
import { SocketService } from '../../core/services/socket.service';
import { GameService } from '../../core/services/game.service';

type GameViewPhase = 'waiting' | 'coin-toss' | 'decide' | 'deck-select';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="game-view-page">
      <div class="bg-hex-grid"></div>

      <div class="game-room">

        <!-- ── Left Column ── -->
        <div class="left-col">

          <!-- Game Info Panel -->
          <div class="info-panel">
            <div class="info-panel__tag">// GAME SESSION</div>
            <div class="info-panel__name">{{ gameName || gameId }}</div>
            <div class="info-panel__status">
              <span class="status-dot" [class.status-dot--active]="phase !== 'waiting'"></span>
              <span class="status-text">{{ phaseLabel }}</span>
            </div>
            <div class="info-panel__players">
              <div class="player-row">
                <span class="player-role">HOST</span>
                <span class="player-name">{{ inviterName || '—' }}</span>
                <span class="player-self-badge" *ngIf="myId === inviterId">YOU</span>
              </div>
              <div class="player-row">
                <span class="player-role">CHALLENGER</span>
                <span class="player-name">{{ challengerName || 'WAITING...' }}</span>
                <span class="player-self-badge" *ngIf="myId !== inviterId && challengerName">YOU</span>
              </div>
            </div>
          </div>

          <!-- Chat Panel -->
          <div class="chat-panel">
            <div class="chat-panel__header">
              <span class="chat-panel__title">// COMMS CHANNEL</span>
            </div>
            <div class="messages-list" #messagesList>
              <div
                *ngFor="let msg of messages"
                class="message-row"
                [class.message-row--log]="msg.isLog"
                [class.message-row--mine]="!msg.isLog && msg.userId === myId"
              >
                <ng-container *ngIf="msg.isLog">
                  <span class="log-entry">◈ {{ msg.message }}</span>
                </ng-container>
                <ng-container *ngIf="!msg.isLog">
                  <span class="msg-sender">{{ msg.username }}</span>
                  <span class="msg-text">{{ msg.message }}</span>
                </ng-container>
              </div>
              <div *ngIf="messages.length === 0" class="chat-empty">
                NO TRANSMISSIONS YET
              </div>
            </div>
            <div class="chat-input-row">
              <input
                class="chat-input"
                [(ngModel)]="chatInput"
                placeholder="TRANSMIT..."
                (keyup.enter)="sendChat()"
                maxlength="300"
              />
              <button class="chat-send-btn" (click)="sendChat()" [disabled]="!chatInput.trim()">
                <mat-icon>send</mat-icon>
              </button>
            </div>
          </div>

        </div>

        <!-- ── Right Column ── -->
        <div class="right-col">

          <!-- Phase steps -->
          <div class="phase-steps">
            <div class="phase-step" [class.phase-step--active]="phase === 'waiting'" [class.phase-step--done]="phase !== 'waiting'">
              <span class="phase-num">01</span>
              <span class="phase-name">STANDBY</span>
            </div>
            <div class="phase-connector"></div>
            <div class="phase-step"
              [class.phase-step--active]="phase === 'coin-toss'"
              [class.phase-step--done]="phase === 'decide' || phase === 'deck-select'">
              <span class="phase-num">02</span>
              <span class="phase-name">COIN FLIP</span>
            </div>
            <div class="phase-connector"></div>
            <div class="phase-step"
              [class.phase-step--active]="phase === 'decide'"
              [class.phase-step--done]="phase === 'deck-select'">
              <span class="phase-num">03</span>
              <span class="phase-name">INITIATIVE</span>
            </div>
            <div class="phase-connector"></div>
            <div class="phase-step" [class.phase-step--active]="phase === 'deck-select'">
              <span class="phase-num">04</span>
              <span class="phase-name">ARMORY</span>
            </div>
          </div>

          <!-- Main panel -->
          <div class="phase-panel">
            <span class="corner corner--tl"></span>
            <span class="corner corner--tr"></span>
            <span class="corner corner--bl"></span>
            <span class="corner corner--br"></span>

            <div class="panel-header">
              <span class="panel-tag">// PHASE_{{ phaseCode }}</span>
              <h2 class="panel-title">{{ phaseTitle }}</h2>
            </div>

            <!-- WAITING -->
            <div *ngIf="phase === 'waiting'" class="phase-content waiting-content">
              <div class="hourglass-wrap">
                <mat-icon class="hourglass-icon">hourglass_empty</mat-icon>
                <div class="ping-rings">
                  <div class="ping-ring ring-1"></div>
                  <div class="ping-ring ring-2"></div>
                  <div class="ping-ring ring-3"></div>
                </div>
              </div>
              <p class="waiting-text">SCANNING FOR OPPONENT...</p>
              <div class="waiting-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>

            <!-- COIN TOSS -->
            <div *ngIf="phase === 'coin-toss'" class="phase-content coin-content">
              <p class="instruction-text">SELECT COIN FACE:</p>
              <div class="coin-options">
                <button
                  class="coin-btn"
                  [class.coin-btn--selected]="picked && pickedSide === 'heads'"
                  [class.coin-btn--unselected]="picked && pickedSide !== 'heads'"
                  [disabled]="picked"
                  (click)="pick('heads')"
                >
                  <span class="coin-symbol">Ω</span>
                  <span class="coin-label">HEADS</span>
                </button>
                <div class="coin-vs">VS</div>
                <button
                  class="coin-btn"
                  [class.coin-btn--selected]="picked && pickedSide === 'tails'"
                  [class.coin-btn--unselected]="picked && pickedSide !== 'tails'"
                  [disabled]="picked"
                  (click)="pick('tails')"
                >
                  <span class="coin-symbol">∞</span>
                  <span class="coin-label">TAILS</span>
                </button>
              </div>
              <button
                mat-raised-button
                color="accent"
                class="flip-btn"
                *ngIf="picked && !coinResult"
                (click)="flip()"
              >
                <mat-icon>casino</mat-icon>
                EXECUTE FLIP
              </button>
              <div *ngIf="coinResult" class="coin-result"
                [class.coin-result--win]="isWinner"
                [class.coin-result--loss]="!isWinner">
                <div class="result-label">RESULT</div>
                <div class="result-value">{{ coinResult | uppercase }}</div>
                <div class="result-status" *ngIf="!isWinner">AWAITING OPPONENT DECISION...</div>
              </div>
            </div>

            <!-- DECIDE -->
            <div *ngIf="phase === 'decide'" class="phase-content decide-content">
              <div class="win-badge">
                <span class="win-icon">◈</span>
                <span class="win-text">COIN TOSS VICTORY</span>
              </div>
              <p class="instruction-text">ASSIGN FIRST TURN:</p>
              <div class="decide-options">
                <button class="decide-btn decide-btn--self" (click)="decideFirst('me')">
                  <span class="decide-icon">▶</span>
                  <div>
                    <span class="decide-label">I GO FIRST</span>
                    <span class="decide-sub">PRESS ADVANTAGE</span>
                  </div>
                </button>
                <button class="decide-btn decide-btn--opp" (click)="decideFirst('opponent')">
                  <span class="decide-icon">◁</span>
                  <div>
                    <span class="decide-label">OPPONENT FIRST</span>
                    <span class="decide-sub">STRATEGIC DELAY</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- DECK SELECT -->
            <div *ngIf="phase === 'deck-select'" class="phase-content deck-content">
              <ng-container *ngIf="!deckSubmitted">
                <p class="instruction-text">SELECT YOUR DECK:</p>

                <div *ngIf="availableDecks.length === 0" class="deck-empty">
                  <span class="deck-empty__icon">◈</span>
                  <span class="deck-empty__text">NO DECKS FOUND</span>
                  <a routerLink="/decks" class="deck-empty__link">BUILD ONE FIRST →</a>
                </div>

                <div class="deck-list" *ngIf="availableDecks.length > 0">
                  <button
                    *ngFor="let deck of availableDecks"
                    class="deck-option"
                    (click)="submitDeck(deck._id!)"
                  >
                    <div class="deck-option__name">{{ deck.name }}</div>
                    <div class="deck-option__count">
                      {{ getDeckCardCount(deck) }} / 40 CARDS
                    </div>
                  </button>
                </div>
              </ng-container>

              <ng-container *ngIf="deckSubmitted">
                <div class="deck-locked">
                  <span class="deck-locked__icon">✓</span>
                  <span class="deck-locked__text">DECK LOCKED IN</span>
                </div>
                <div class="deck-waiting" *ngIf="!opponentDeckSubmitted">
                  <mat-spinner diameter="24"></mat-spinner>
                  <span>AWAITING OPPONENT...</span>
                </div>
                <div class="deck-ready" *ngIf="opponentDeckSubmitted">
                  <span>⚡ BOTH READY — INITIATING DUEL</span>
                </div>
              </ng-container>

              <div class="deck-status-row" *ngIf="deckSubmitted">
                <div class="deck-status-item" [class.deck-status-item--done]="deckSubmitted">
                  <span>{{ myUsername || 'YOU' }}</span>
                  <mat-icon *ngIf="deckSubmitted">check_circle</mat-icon>
                </div>
                <div class="deck-status-item" [class.deck-status-item--done]="opponentDeckSubmitted">
                  <span>OPPONENT</span>
                  <mat-icon *ngIf="opponentDeckSubmitted">check_circle</mat-icon>
                  <mat-spinner *ngIf="!opponentDeckSubmitted" diameter="16"></mat-spinner>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .game-view-page {
      min-height: calc(100vh - 56px);
      padding: 24px;
      position: relative;
      z-index: 1;
    }
    .bg-hex-grid {
      position: fixed;
      inset: 0;
      background-image: radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.03) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }

    /* ── Layout ── */
    .game-room {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
      max-width: 1100px;
      margin: 0 auto;
      height: calc(100vh - 104px);
    }
    .left-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    }
    .right-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 8px;
    }

    /* ── Info Panel ── */
    .info-panel {
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      padding: 16px;
      flex-shrink: 0;
    }
    .info-panel__tag {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-secondary);
      letter-spacing: 0.2em;
      margin-bottom: 4px;
    }
    .info-panel__name {
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 900;
      color: var(--text-bright);
      letter-spacing: 0.15em;
      margin-bottom: 8px;
      word-break: break-all;
    }
    .info-panel__status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-dim);
    }
    .status-dot--active {
      background: var(--neon-green);
      box-shadow: 0 0 6px var(--neon-green);
      animation: blink-dot 1.5s ease-in-out infinite;
    }
    .status-text {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-secondary);
      letter-spacing: 0.1em;
    }
    .info-panel__players { display: flex; flex-direction: column; gap: 6px; }
    .player-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .player-role {
      font-family: var(--font-mono);
      font-size: 8px;
      letter-spacing: 0.15em;
      color: var(--text-dim);
      width: 72px;
      flex-shrink: 0;
    }
    .player-name {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--neon-gold);
      flex: 1;
    }
    .player-self-badge {
      font-family: var(--font-mono);
      font-size: 8px;
      letter-spacing: 0.1em;
      color: var(--neon-cyan);
      background: var(--neon-cyan-dim);
      border: 1px solid rgba(0,245,255,0.3);
      padding: 1px 5px;
    }

    /* ── Chat Panel ── */
    .chat-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      overflow: hidden;
      min-height: 0;
    }
    .chat-panel__header {
      padding: 10px 12px 8px;
      border-bottom: 1px solid var(--border-dim);
      flex-shrink: 0;
    }
    .chat-panel__title {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-secondary);
      letter-spacing: 0.2em;
    }
    .messages-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 0;
      scrollbar-width: thin;
      scrollbar-color: var(--border-mid) transparent;
    }
    .message-row {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .message-row--mine {
      align-items: flex-end;
    }
    .log-entry {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-dim);
      letter-spacing: 0.08em;
      text-align: center;
      width: 100%;
      padding: 2px 0;
    }
    .msg-sender {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--neon-cyan);
      letter-spacing: 0.1em;
    }
    .message-row--mine .msg-sender { color: var(--neon-gold); }
    .msg-text {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-primary);
      background: var(--bg-panel);
      border: 1px solid var(--border-dim);
      padding: 4px 8px;
      max-width: 90%;
      word-break: break-word;
    }
    .message-row--mine .msg-text {
      border-color: rgba(255, 215, 0, 0.2);
      background: rgba(255, 215, 0, 0.05);
    }
    .chat-empty {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-dim);
      letter-spacing: 0.15em;
      text-align: center;
      padding: 24px 0;
    }
    .chat-input-row {
      display: flex;
      gap: 0;
      border-top: 1px solid var(--border-dim);
      flex-shrink: 0;
    }
    .chat-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      padding: 10px 12px;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-primary);
    }
    .chat-send-btn {
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      border-left: 1px solid var(--border-dim);
      cursor: pointer;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s;
    }
    .chat-send-btn:hover:not([disabled]) {
      color: var(--neon-cyan);
      background: var(--neon-cyan-dim);
    }
    .chat-send-btn[disabled] { opacity: 0.3; cursor: default; }
    .chat-send-btn mat-icon { font-size: 16px !important; width: 16px !important; height: 16px !important; }

    /* ── Phase steps ── */
    .phase-steps {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 28px;
      z-index: 1;
    }
    .phase-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      opacity: 0.35;
      transition: opacity 0.3s;
    }
    .phase-step--active { opacity: 1; }
    .phase-step--done   { opacity: 0.6; }
    .phase-num {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 900;
      color: var(--neon-cyan);
      line-height: 1;
    }
    .phase-step--active .phase-num { text-shadow: var(--neon-cyan-glow); }
    .phase-name {
      font-family: var(--font-mono);
      font-size: 8px;
      letter-spacing: 0.15em;
      color: var(--text-secondary);
    }
    .phase-step--active .phase-name { color: var(--text-primary); }
    .phase-connector {
      width: 32px;
      height: 1px;
      background: linear-gradient(90deg, var(--border-dim), var(--border-mid), var(--border-dim));
      margin: 0 4px;
      margin-bottom: 12px;
    }

    /* ── Main panel ── */
    .phase-panel {
      position: relative;
      width: 100%;
      max-width: 460px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      padding: 24px;
      z-index: 1;
    }
    .corner {
      position: absolute;
      width: 12px;
      height: 12px;
      border-color: var(--neon-cyan);
      border-style: solid;
      opacity: 0.5;
    }
    .corner--tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
    .corner--tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
    .corner--bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
    .corner--br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

    .panel-header { margin-bottom: 24px; }
    .panel-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-secondary);
      letter-spacing: 0.2em;
      display: block;
      margin-bottom: 4px;
    }
    .panel-title {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 900;
      color: var(--text-bright);
      letter-spacing: 0.18em;
      margin: 0;
    }
    .phase-content { min-height: 160px; }
    .instruction-text {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.2em;
      color: var(--text-secondary);
      margin: 0 0 16px;
    }

    /* Waiting */
    .waiting-content {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
    }
    .hourglass-wrap {
      position: relative; display: flex; align-items: center; justify-content: center;
      width: 70px; height: 70px;
    }
    .hourglass-icon {
      font-size: 36px !important; width: 36px !important; height: 36px !important;
      color: var(--neon-cyan) !important;
      filter: drop-shadow(0 0 8px var(--neon-cyan));
      animation: hourglass-rotate 3s ease-in-out infinite; position: relative; z-index: 1;
    }
    .ping-rings { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .ping-ring { position: absolute; border-radius: 50%; border: 1px solid var(--neon-cyan); animation: ping-expand 2s ease-out infinite; }
    .ring-1 { width: 44px; height: 44px; animation-delay: 0s; }
    .ring-2 { width: 56px; height: 56px; animation-delay: 0.5s; }
    .ring-3 { width: 68px; height: 68px; animation-delay: 1s; }
    @keyframes ping-expand {
      0%   { opacity: 0.6; transform: scale(0.6); }
      100% { opacity: 0; transform: scale(1); }
    }
    .waiting-text { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--text-secondary); margin: 0; }
    .waiting-dots { display: flex; gap: 6px; }
    .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--neon-cyan); animation: blink-dot 1.2s ease-in-out infinite; }
    .dot:nth-child(2) { animation-delay: 0.3s; }
    .dot:nth-child(3) { animation-delay: 0.6s; }

    /* Coin toss */
    .coin-options { display: flex; gap: 14px; align-items: center; margin-bottom: 20px; }
    .coin-vs { font-family: var(--font-display); font-size: 10px; font-weight: 700; color: var(--text-dim); letter-spacing: 0.2em; }
    .coin-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 18px 10px; background: var(--bg-panel); border: 1px solid var(--border-mid);
      cursor: pointer; transition: all 0.2s;
    }
    .coin-btn:hover:not([disabled]) { border-color: var(--neon-cyan); background: var(--neon-cyan-dim); box-shadow: var(--neon-cyan-glow); }
    .coin-btn[disabled] { cursor: default; }
    .coin-btn--selected { border-color: var(--neon-cyan) !important; background: var(--neon-cyan-dim) !important; box-shadow: var(--neon-cyan-glow) !important; }
    .coin-btn--unselected { opacity: 0.4; }
    .coin-symbol { font-size: 28px; color: var(--neon-gold); text-shadow: var(--neon-gold-glow); line-height: 1; }
    .coin-label { font-family: var(--font-display); font-size: 9px; font-weight: 700; letter-spacing: 0.2em; color: var(--text-bright); }
    .flip-btn { width: 100%; height: 40px !important; font-size: 11px !important; letter-spacing: 0.15em !important; animation: glow-pulse-magenta 2s ease-in-out infinite !important; }
    .coin-result { margin-top: 18px; padding: 14px; border: 1px solid var(--border-dim); text-align: center; }
    .coin-result--win  { border-color: var(--neon-gold); box-shadow: 0 0 16px rgba(255,215,0,0.15); }
    .result-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.3em; color: var(--text-secondary); margin-bottom: 4px; }
    .result-value { font-family: var(--font-display); font-size: 22px; font-weight: 900; color: var(--neon-gold); text-shadow: var(--neon-gold-glow); letter-spacing: 0.2em; }
    .result-status { font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary); letter-spacing: 0.12em; margin-top: 6px; }

    /* Decide */
    .win-badge { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .win-icon { font-size: 16px; color: var(--neon-gold); text-shadow: var(--neon-gold-glow); }
    .win-text { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: var(--neon-gold); }
    .decide-options { display: flex; flex-direction: column; gap: 8px; }
    .decide-btn {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px;
      background: var(--bg-panel); border: 1px solid var(--border-dim);
      cursor: pointer; transition: all 0.2s; text-align: left; width: 100%;
    }
    .decide-btn:hover { border-color: var(--neon-cyan); background: var(--neon-cyan-dim); }
    .decide-btn--opp:hover { border-color: var(--neon-magenta); background: var(--neon-magenta-dim); }
    .decide-icon { font-size: 16px; color: var(--neon-cyan); flex-shrink: 0; width: 18px; }
    .decide-btn--opp .decide-icon { color: var(--neon-magenta); }
    .decide-label { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: var(--text-bright); display: block; }
    .decide-sub { font-family: var(--font-mono); font-size: 9px; color: var(--text-secondary); letter-spacing: 0.12em; display: block; margin-top: 1px; }

    /* Deck select */
    .deck-list { display: flex; flex-direction: column; gap: 8px; }
    .deck-option {
      width: 100%; display: flex; justify-content: space-between; align-items: center;
      padding: 12px 16px; background: var(--bg-panel); border: 1px solid var(--border-dim);
      cursor: pointer; transition: all 0.2s; text-align: left;
    }
    .deck-option:hover { border-color: var(--neon-cyan); background: var(--neon-cyan-dim); }
    .deck-option__name { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--text-bright); }
    .deck-option__count { font-family: var(--font-mono); font-size: 9px; color: var(--neon-cyan); letter-spacing: 0.1em; }
    .deck-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px 0; }
    .deck-empty__icon { font-size: 22px; color: var(--border-dim); }
    .deck-empty__text { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--text-dim); }
    .deck-empty__link { font-family: var(--font-mono); font-size: 10px; color: var(--neon-cyan); letter-spacing: 0.15em; text-decoration: none; }
    .deck-empty__link:hover { text-decoration: underline; }
    .deck-locked { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .deck-locked__icon { font-size: 20px; color: var(--neon-green); }
    .deck-locked__text { font-family: var(--font-display); font-size: 13px; font-weight: 700; letter-spacing: 0.2em; color: var(--neon-green); }
    .deck-waiting { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); letter-spacing: 0.12em; margin-bottom: 12px; }
    .deck-ready { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--neon-cyan); letter-spacing: 0.15em; animation: glow-pulse 1s ease-in-out infinite; margin-bottom: 12px; }
    .deck-status-row { display: flex; gap: 12px; }
    .deck-status-item {
      flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px 12px;
      background: var(--bg-panel); border: 1px solid var(--border-dim);
      font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--text-dim);
    }
    .deck-status-item--done { border-color: var(--neon-green); color: var(--neon-green); }
    .deck-status-item mat-icon { font-size: 14px !important; width: 14px !important; height: 14px !important; }
  `],
})
export class GameViewComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesList') private messagesList!: ElementRef<HTMLDivElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private socketService = inject(SocketService);
  private gameService = inject(GameService);
  private destroyRef = inject(DestroyRef);

  gameId = '';
  gameName = '';
  inviterId = '';
  inviterName = '';
  challengerName = '';
  phase: GameViewPhase = 'waiting';
  myId = '';
  myUsername = '';
  opponentId = '';
  coinResult = '';
  isWinner = false;
  picked = false;
  pickedSide: 'heads' | 'tails' | null = null;

  messages: ChatMessageInterface[] = [];
  chatInput = '';
  private shouldScrollChat = false;

  availableDecks: DeckInterface[] = [];
  deckSubmitted = false;
  opponentDeckSubmitted = false;

  get phaseTitle(): string {
    const titles: Record<GameViewPhase, string> = {
      waiting: 'AWAITING OPPONENT',
      'coin-toss': 'COIN TOSS',
      decide: 'FIRST TURN',
      'deck-select': 'SELECT DECK',
    };
    return titles[this.phase];
  }

  get phaseCode(): string {
    const codes: Record<GameViewPhase, string> = {
      waiting: '01_STANDBY',
      'coin-toss': '02_FLIP',
      decide: '03_INITIATIVE',
      'deck-select': '04_ARMORY',
    };
    return codes[this.phase];
  }

  get phaseLabel(): string {
    const labels: Record<GameViewPhase, string> = {
      waiting: 'WAITING',
      'coin-toss': 'COIN TOSS',
      decide: 'DECIDING',
      'deck-select': 'DECK SELECT',
    };
    return labels[this.phase];
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    this.myId = this.socketService.currentUserId;
    this.myUsername = this.socketService.currentUsername;

    const state = history.state as any;
    this.gameName = state?.gameName || '';
    this.inviterId = state?.inviterId || '';
    this.inviterName = state?.inviterName || '';

    this.socketService
      .on<any>(GameEvents.CHALLENGED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.phase = 'coin-toss';
        this.challengerName = data.challengerName || '';
        if (this.myId === data.challengerId) {
          this.opponentId = this.inviterId;
        } else {
          this.opponentId = data.challengerId;
        }
        this.pushLog(`${data.challengerName} accepted the challenge`);
      });

    this.socketService
      .on<any>(GameEvents.COIN_TOSS_RESULT)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.coinResult = data.result;
        if (data.winnerId === this.myId) {
          this.isWinner = true;
          this.phase = 'decide';
        }
      });

    this.socketService
      .on<any>(GameEvents.DUEL_STARTED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.router.navigate(['/duel', data.gameId || this.gameId]);
      });

    this.socketService
      .on<any>(GameEvents.CHAT_MESSAGE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.messages.push({ ...data, isLog: false });
        this.shouldScrollChat = true;
      });

    this.socketService
      .on<any>(GameEvents.PLAYER_JOINED_ROOM)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.pushLog(`${data.username} joined the room`);
      });

    this.socketService
      .on<any>(GameEvents.PLAYER_LEFT_ROOM)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.pushLog(`${data.username} left the room`);
      });

    this.socketService
      .on<any>(GameEvents.DECK_SUBMITTED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data.userId !== this.myId) {
          this.opponentDeckSubmitted = true;
        }
      });

    this.gameService.decks$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((decks) => {
        this.availableDecks = decks;
      });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat && this.messagesList) {
      const el = this.messagesList.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScrollChat = false;
    }
  }

  pick(side: 'heads' | 'tails'): void {
    this.socketService.emit(GameCommands.COIN_TOSS_PICK, { gameId: this.gameId, side });
    this.picked = true;
    this.pickedSide = side;
  }

  flip(): void {
    this.socketService.emit(GameCommands.COIN_TOSS_FLIP, { gameId: this.gameId });
  }

  decideFirst(who: 'me' | 'opponent'): void {
    const firstPlayerId = who === 'me' ? this.myId : this.opponentId;
    this.socketService.emit(GameCommands.DECIDE_WHO_GOES_FIRST, {
      gameId: this.gameId,
      firstPlayerId,
    });
    this.phase = 'deck-select';
    this.loadDecks();
  }

  sendChat(): void {
    const text = this.chatInput.trim();
    if (!text) return;
    this.socketService.emit(GameCommands.SEND_CHAT, { gameId: this.gameId, message: text });
    this.chatInput = '';
  }

  loadDecks(): void {
    this.socketService.emit(GameCommands.GET_DECKS);
  }

  submitDeck(deckId: string): void {
    this.socketService.emit(GameCommands.SUBMIT_DECK, { gameId: this.gameId, deckId });
    this.deckSubmitted = true;
  }

  getDeckCardCount(deck: DeckInterface): number {
    return deck.cards.reduce((sum, c) => sum + c.copies, 0);
  }

  private pushLog(message: string): void {
    this.messages.push({
      gameId: this.gameId,
      userId: 'system',
      username: 'SYSTEM',
      message,
      timestamp: new Date(),
      isLog: true,
    });
    this.shouldScrollChat = true;
  }
}
