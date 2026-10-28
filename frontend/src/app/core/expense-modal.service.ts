import { Injectable, signal } from '@angular/core';
import { Expense } from './models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseModalService {
  private readonly state = signal(false);
  private readonly target = signal<Expense | null>(null);

  readonly isOpen = this.state.asReadonly();
  readonly editing = this.target.asReadonly();

  open(): void {
    this.target.set(null);
    this.state.set(true);
  }

  edit(expense: Expense): void {
    this.target.set(expense);
    this.state.set(true);
  }

  close(): void {
    this.state.set(false);
    this.target.set(null);
  }
}
