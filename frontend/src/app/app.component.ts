import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-sigil">⚔</span>
        <div class="brand-text-block">
          <span class="brand-title">DUEL MASTERS</span>
          <span class="brand-subtitle">TCG // ONLINE</span>
        </div>
      </div>

      <div class="nav-divider"></div>

      <div class="nav-links">
        <a class="nav-link" routerLink="/" routerLinkActive="nav-link--active" [routerLinkActiveOptions]="{exact:true}">
          <span class="nav-link-dot"></span>LOBBY
        </a>
        <a class="nav-link" routerLink="/cards" routerLinkActive="nav-link--active">
          <span class="nav-link-dot"></span>CARDS
        </a>
        <a class="nav-link" routerLink="/decks" routerLinkActive="nav-link--active">
          <span class="nav-link-dot"></span>DECKS
        </a>
      </div>

      <span class="spacer"></span>

      <div class="nav-status">
        <span class="status-dot"></span>
        <span class="status-label">{{ devUserName || 'ONLINE' }}</span>
      </div>

      <button
        mat-icon-button
        class="theme-toggle"
        (click)="theme.toggle()"
        [matTooltip]="theme.isDark() ? 'Light mode' : 'Dark mode'"
        aria-label="Toggle theme"
      >
        <mat-icon>{{ theme.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
    </nav>

    <router-outlet />
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 20px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-dim);
      position: relative;
      z-index: 100;
      animation: flicker 12s infinite;
    }
    .navbar::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg,
        transparent 0%,
        var(--neon-cyan) 20%,
        rgba(0,245,255,0.4) 50%,
        var(--neon-cyan) 80%,
        transparent 100%
      );
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-sigil {
      font-size: 22px;
      filter: drop-shadow(0 0 8px var(--neon-cyan));
      line-height: 1;
    }
    .brand-text-block {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .brand-title {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 900;
      color: var(--neon-cyan);
      letter-spacing: 0.2em;
      text-shadow: var(--neon-cyan-glow);
      line-height: 1;
    }
    .brand-subtitle {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-dim);
      letter-spacing: 0.3em;
      line-height: 1;
    }
    .nav-divider {
      width: 1px;
      height: 28px;
      background: var(--border-dim);
      margin: 0 20px;
    }
    .nav-links {
      display: flex;
      gap: 4px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.22em;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 6px 14px;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      position: relative;
    }
    .nav-link:hover {
      color: var(--neon-cyan);
      border-color: var(--border-mid);
      background: var(--neon-cyan-dim);
    }
    .nav-link--active {
      color: var(--neon-cyan) !important;
      border-color: var(--border-mid) !important;
      background: var(--neon-cyan-dim) !important;
      text-shadow: 0 0 8px var(--neon-cyan);
    }
    .nav-link-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }
    .nav-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: 12px;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--neon-green);
      box-shadow: 0 0 6px var(--neon-green);
      animation: blink-dot 2s ease-in-out infinite;
    }
    .status-label {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--neon-green);
      letter-spacing: 0.2em;
    }
    .spacer { flex: 1 1 auto; }
    .theme-toggle { opacity: 0.7; transition: opacity 0.2s; }
    .theme-toggle:hover { opacity: 1; }
  `],
})
export class AppComponent {
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);
  title = 'Duel Masters';

  get devUserName(): string | null {
    if (!this.auth.isDevBypass) return null;
    return localStorage.getItem('dm_dev_user_name');
  }
}
