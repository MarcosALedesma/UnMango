import { Injectable, computed, signal } from '@angular/core';
import { MOCK_RECURRING } from './mock-data';
import { RecurringExpense } from './models/recurring-expense.model';

@Injectable({ providedIn: 'root' })
export class RecurringService {
  private readonly items = signal<readonly RecurringExpense[]>(MOCK_RECURRING);

  readonly all = this.items.asReadonly();

  readonly upcoming = computed(() =>
    this.items()
      .filter((item) => item.active)
      .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate)),
  );
}
