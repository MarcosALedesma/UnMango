import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'um-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly current = signal<Theme>(this.initialTheme());

  readonly theme = this.current.asReadonly();
  readonly isDark = computed(() => this.current() === 'dark');

  constructor() {
    this.apply(this.current());
  }

  toggle(): void {
    this.set(this.isDark() ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.current.set(theme);
    this.apply(theme);
    this.save(theme);
  }

  private apply(theme: Theme): void {
    this.doc.documentElement.dataset['theme'] = theme;
  }

  private save(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error: unknown) {
      console.warn('No se pudo guardar el tema', error);
    }
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (error: unknown) {
      console.warn('No se pudo leer el tema guardado', error);
    }
    const prefersDark = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
