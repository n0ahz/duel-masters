import { Injectable, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'dm-theme';

  isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    // Default to dark theme for gaming UI; only go light if explicitly saved
    const prefersDark = saved !== 'light';
    this.isDark.set(prefersDark);
    this.applyTheme(prefersDark);
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    localStorage.setItem(this.storageKey, next ? 'dark' : 'light');
    this.applyTheme(next);
  }

  private applyTheme(dark: boolean): void {
    if (dark) {
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
    }
  }
}
