import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GameCommands,
  GameEvents,
  ChatMessageInterface,
} from '@dm/shared';
import { SocketService } from '../../core/services/socket.service';
import { DuelEngineService } from '../../core/services/duel-engine.service';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-duel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  template: `
    <div class="duel-layout">
      <div id="phaser-container" #phaserContainer class="phaser-container"></div>

      <aside class="side-panel">
        <!-- Panel header -->
        <div class="panel-header">
          <span class="panel-dot"></span>
          <span class="panel-title">COMMS</span>
          <span class="panel-badge">{{ chatMessages.length }}</span>
        </div>

        <!-- Messages -->
        <div class="chat-messages" #chatScroll>
          <div *ngFor="let msg of chatMessages" class="chat-msg">
            <span class="msg-name">{{ msg.username }}</span>
            <span class="msg-sep"> › </span>
            <span class="msg-text">{{ msg.message }}</span>
          </div>
          <div *ngIf="chatMessages.length === 0" class="chat-empty">
            <span>// NO TRANSMISSIONS</span>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-area">
          <div class="input-wrap">
            <span class="input-prefix">&gt;</span>
            <input
              class="chat-input"
              [(ngModel)]="chatInput"
              (keyup.enter)="sendChat()"
              placeholder="TRANSMIT MESSAGE..."
              autocomplete="off"
            />
          </div>
          <button class="send-btn" (click)="sendChat()" [disabled]="!chatInput.trim()">
            <mat-icon>send</mat-icon>
          </button>
        </div>

        <!-- Divider -->
        <div class="panel-divider"></div>

        <!-- Status readout -->
        <div class="status-readout">
          <div class="readout-line">
            <span class="readout-key">GAME ID</span>
            <span class="readout-val">{{ gameId || '—' }}</span>
          </div>
          <div class="readout-line">
            <span class="readout-key">ENGINE</span>
            <span class="readout-val readout-val--on">ACTIVE</span>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .duel-layout {
      display: flex;
      height: calc(100vh - 56px);
      overflow: hidden;
    }

    /* ── Phaser canvas ── */
    .phaser-container {
      flex: 1;
      overflow: hidden;
      background: #000;
    }

    /* ── Side panel ── */
    .side-panel {
      width: 260px;
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-left: 1px solid var(--border-dim);
      display: flex;
      flex-direction: column;
      padding: 0;
      position: relative;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-dim);
    }
    .panel-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--neon-green);
      box-shadow: 0 0 6px var(--neon-green);
      animation: blink-dot 2s ease-in-out infinite;
      flex-shrink: 0;
    }
    .panel-title {
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: var(--text-secondary);
      flex: 1;
    }
    .panel-badge {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--neon-cyan);
      background: var(--neon-cyan-dim);
      border: 1px solid rgba(0, 245, 255, 0.2);
      padding: 1px 7px;
      min-width: 24px;
      text-align: center;
    }

    /* ── Messages ── */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .chat-msg {
      font-size: 12px;
      line-height: 1.5;
      word-break: break-word;
      animation: fade-in 0.2s ease;
    }
    .msg-name {
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: var(--neon-cyan);
    }
    .msg-sep {
      color: var(--text-dim);
      font-size: 12px;
    }
    .msg-text {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-primary);
    }
    .chat-empty {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.12em;
      color: var(--text-dim);
      text-align: center;
      padding-top: 24px;
    }

    /* ── Input ── */
    .chat-input-area {
      display: flex;
      align-items: center;
      gap: 0;
      border-top: 1px solid var(--border-dim);
      padding: 10px 12px;
    }
    .input-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-void);
      border: 1px solid var(--border-dim);
      padding: 6px 10px;
      transition: border-color 0.2s;
    }
    .input-wrap:focus-within {
      border-color: var(--neon-cyan);
      box-shadow: inset 0 0 12px var(--neon-cyan-dim);
    }
    .input-prefix {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--neon-cyan);
      flex-shrink: 0;
    }
    .chat-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-bright);
      font-family: var(--font-mono);
      font-size: 12px;
      caret-color: var(--neon-cyan);
    }
    .chat-input::placeholder { color: var(--text-dim); }
    .send-btn {
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1px solid var(--border-dim);
      border-left: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .send-btn mat-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: var(--text-secondary);
      transition: color 0.2s;
    }
    .send-btn:hover:not([disabled]) {
      background: var(--neon-cyan-dim);
      border-color: var(--neon-cyan);
    }
    .send-btn:hover:not([disabled]) mat-icon { color: var(--neon-cyan); }
    .send-btn[disabled] { opacity: 0.3; cursor: default; }

    /* ── Status readout ── */
    .panel-divider {
      height: 1px;
      background: var(--border-dim);
      margin: 0 12px;
    }
    .status-readout {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .readout-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .readout-key {
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.2em;
      color: var(--text-dim);
    }
    .readout-val {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
    }
    .readout-val--on {
      color: var(--neon-green);
      text-shadow: 0 0 6px var(--neon-green);
    }
  `],
})
export class DuelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('phaserContainer') phaserContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private socketService = inject(SocketService);
  private duelEngineService = inject(DuelEngineService);
  private gameService = inject(GameService);
  private destroyRef = inject(DestroyRef);

  gameId = '';
  chatMessages: ChatMessageInterface[] = [];
  chatInput = '';

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    const localUserId = this.socketService.currentUserId;

    this.socketService
      .on<ChatMessageInterface>(GameEvents.CHAT_MESSAGE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((msg) => { this.chatMessages.push(msg); });

    this.gameService.gameState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        if (state) {
          this.duelEngineService.applyGameState(state, localUserId);
        }
      });
  }

  ngAfterViewInit(): void {
    this.duelEngineService.createGame('phaser-container');
  }

  ngOnDestroy(): void {
    this.duelEngineService.destroyGame();
  }

  sendChat(): void {
    if (!this.chatInput.trim()) return;
    this.socketService.emit(GameCommands.SEND_CHAT, {
      gameId: this.gameId,
      message: this.chatInput.trim(),
    });
    this.chatInput = '';
  }
}
