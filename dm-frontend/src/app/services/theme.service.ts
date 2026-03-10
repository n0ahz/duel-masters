import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'dm-theme';

  private _isDark = new BehaviorSubject<boolean>(true);
  readonly isDark$ = this._isDark.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const isDark = saved !== null ? saved === 'dark' : true;
    this._isDark.next(isDark);
    this.applyTheme(isDark);
  }

  get isDark(): boolean {
    return this._isDark.value;
  }

  toggle(): void {
    const next = !this._isDark.value;
    this._isDark.next(next);
    localStorage.setItem(this.STORAGE_KEY, next ? 'dark' : 'light');
    this.applyTheme(next);
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.classList.toggle('theme-light', !isDark);
  }
}
