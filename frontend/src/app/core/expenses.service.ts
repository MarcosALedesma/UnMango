import { Injectable, signal } from '@angular/core';
import { MOCK_EXPENSES } from './mock-data';
import { Expense, NewExpense } from './models/expense.model';

function sortByDateDesc(list: readonly Expense[]): readonly Expense[] {
  return [...list].sort((a, b) => b.spentAt.localeCompare(a.spentAt));
}

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly items = signal<readonly Expense[]>(sortByDateDesc(MOCK_EXPENSES));

  readonly all = this.items.asReadonly();

  add(input: NewExpense): Expense {
    const expense: Expense = { ...input, id: crypto.randomUUID() };
    this.items.update((list) => sortByDateDesc([expense, ...list]));
    return expense;
  }
}
