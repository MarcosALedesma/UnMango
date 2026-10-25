import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExpenseModalService {
  private readonly state = signal(false);
  readonly isOpen = this.state.asReadonly();

  open(): void {
    this.state.set(true);
  }

  close(): void {
    this.state.set(false);
  }
}
