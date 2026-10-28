import { Injectable, computed, inject, signal } from '@angular/core';
import { format } from 'date-fns';
import { ExpensesService } from './expenses.service';
import { MOCK_RECURRING } from './mock-data';
import { RecurringDraft, RecurringExpense } from './models/recurring-expense.model';
import { advanceDueDate, nextDueDate } from './recurrence';

@Injectable({ providedIn: 'root' })
export class RecurringService {
  private readonly expenses = inject(ExpensesService);
  private readonly items = signal<readonly RecurringExpense[]>(MOCK_RECURRING);

  readonly all = this.items.asReadonly();

  readonly upcoming = computed(() =>
    this.items()
      .filter((item) => item.active)
      .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate)),
  );

  add(draft: RecurringDraft): void {
    const item: RecurringExpense = {
      ...draft,
      id: crypto.randomUUID(),
      active: true,
      nextDueDate: nextDueDate(draft.periodicity, draft.dueDay),
    };
    this.items.update((list) => [...list, item]);
  }

  update(id: string, draft: RecurringDraft): void {
    this.items.update((list) =>
      list.map((item) => {
        if (item.id !== id) {
          return item;
        }
        const scheduleChanged =
          item.periodicity !== draft.periodicity || item.dueDay !== draft.dueDay;
        return {
          ...item,
          ...draft,
          nextDueDate: scheduleChanged
            ? nextDueDate(draft.periodicity, draft.dueDay)
            : item.nextDueDate,
        };
      }),
    );
  }

  toggleActive(id: string): void {
    this.items.update((list) =>
      list.map((item) => (item.id === id ? { ...item, active: !item.active } : item)),
    );
  }

  remove(id: string): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
  }

  restore(item: RecurringExpense): void {
    this.items.update((list) => [...list.filter((i) => i.id !== item.id), item]);
  }

  markPaid(id: string): void {
    const item = this.items().find((i) => i.id === id);
    if (!item) {
      return;
    }
    this.expenses.add({
      description: item.name,
      categoryId: item.categoryId,
      amountMinor: item.amountMinor,
      spentAt: format(new Date(), 'yyyy-MM-dd'),
      origin: 'RECURRING',
    });
    this.items.update((list) =>
      list.map((i) =>
        i.id === id
          ? { ...i, nextDueDate: advanceDueDate(i.periodicity, i.dueDay, i.nextDueDate) }
          : i,
      ),
    );
  }

  countByCategory(categoryId: string): number {
    return this.items().filter((item) => item.categoryId === categoryId).length;
  }
}
