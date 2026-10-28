import { Injectable, computed, inject, signal } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { MOCK_CATEGORIES } from './mock-data';
import { Category, CategoryDraft } from './models/category.model';
import { RecurringService } from './recurring.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly expenses = inject(ExpensesService);
  private readonly recurring = inject(RecurringService);

  private readonly items = signal<readonly Category[]>(MOCK_CATEGORIES);
  private readonly index = computed(() => new Map(this.items().map((c) => [c.id, c] as const)));

  readonly all = this.items.asReadonly();

  byId(id: string): Category | undefined {
    return this.index().get(id);
  }

  usageOf(id: string): number {
    return this.expenses.countByCategory(id) + this.recurring.countByCategory(id);
  }

  nameTaken(name: string, exceptId: string | null = null): boolean {
    const wanted = name.trim().toLowerCase();
    return this.items().some((c) => c.id !== exceptId && c.name.toLowerCase() === wanted);
  }

  add(draft: CategoryDraft): void {
    this.items.update((list) => [...list, { ...draft, id: crypto.randomUUID() }]);
  }

  update(id: string, draft: CategoryDraft): void {
    this.items.update((list) => list.map((c) => (c.id === id ? { ...c, ...draft } : c)));
  }

  remove(id: string): void {
    this.items.update((list) => list.filter((c) => c.id !== id));
  }

  restore(category: Category): void {
    this.items.update((list) => [...list.filter((c) => c.id !== category.id), category]);
  }
}
