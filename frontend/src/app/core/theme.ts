import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>('light');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const stored = this.document.defaultView?.localStorage.getItem('theme');
    this.apply(stored === 'dark' ? 'dark' : 'light');
  }

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    const root = this.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');

    if (isPlatformBrowser(this.platformId)) {
      this.document.defaultView?.localStorage.setItem('theme', theme);
    }
  }
}
