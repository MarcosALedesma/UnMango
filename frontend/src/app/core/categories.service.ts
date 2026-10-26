import { Injectable, computed, signal } from '@angular/core';
import { MOCK_CATEGORIES } from './mock-data';
import { Category } from './models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly items = signal<readonly Category[]>(MOCK_CATEGORIES);
  private readonly index = computed(() => new Map(this.items().map((c) => [c.id, c] as const)));

  readonly all = this.items.asReadonly();

  byId(id: string): Category | undefined {
    return this.index().get(id);
  }
}
