import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface ToastAction {
  readonly label: string;
  readonly run: () => void;
}

export interface Toast {
  readonly id: number;
  readonly kind: ToastKind;
  readonly message: string;
  readonly action: ToastAction | null;
}

interface ToastOptions {
  readonly kind?: ToastKind;
  readonly action?: ToastAction;
}

const DURATION_MS = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly items = signal<readonly Toast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 1;

  readonly all = this.items.asReadonly();

  show(message: string, options: ToastOptions = {}): void {
    const toast: Toast = {
      id: this.nextId++,
      kind: options.kind ?? 'success',
      message,
      action: options.action ?? null,
    };
    this.items.update((list) => [...list, toast]);
    this.timers.set(
      toast.id,
      setTimeout(() => this.dismiss(toast.id), DURATION_MS),
    );
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.items.update((list) => list.filter((toast) => toast.id !== id));
  }
}
