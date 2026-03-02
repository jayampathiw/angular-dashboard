import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark-theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private darkMode = signal(this.loadSavedTheme());

  isDarkMode = this.darkMode.asReadonly();

  constructor() {
    if (this.darkMode()) {
      this.document.body.classList.add(DARK_CLASS);
    }
  }

  toggleTheme(): void {
    this.darkMode.update((v) => !v);
    this.document.body.classList.toggle(DARK_CLASS, this.darkMode());
    localStorage.setItem(
      STORAGE_KEY,
      this.darkMode() ? THEME_DARK : THEME_LIGHT,
    );
  }

  private loadSavedTheme(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === THEME_DARK;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
