import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CategoriesService } from '../../core/categories.service';
import { ExpenseModalService } from '../../core/expense-modal.service';
import { ExpensesService } from '../../core/expenses.service';
import { Expense } from '../../core/models/expense.model';
import { ToastService } from '../../core/toast.service';
import {
  ExpenseRow,
  ExpenseTableComponent,
  SortField,
  SortState,
} from '../../shared/expense-table/expense-table.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

const PAGE_SIZE = 6;

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [PageHeaderComponent, ExpenseTableComponent, PaginatorComponent, IconComponent],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GastosComponent {
  private readonly expenses = inject(ExpensesService);
  private readonly toast = inject(ToastService);
  protected readonly categories = inject(CategoriesService);
  protected readonly modal = inject(ExpenseModalService);

  protected readonly search = signal('');
  protected readonly categoryId = signal<string | null>(null);
  protected readonly sort = signal<SortState>({ field: 'date', dir: 'desc' });
  protected readonly page = signal(1);

  private readonly rows = computed<readonly ExpenseRow[]>(() =>
    this.expenses
      .all()
      .map((expense) => ({ expense, category: this.categories.byId(expense.categoryId) })),
  );

  private readonly filtered = computed(() => {
    const term = normalize(this.search());
    const categoryId = this.categoryId();
    return this.rows().filter(
      (row) =>
        (categoryId === null || row.expense.categoryId === categoryId) &&
        (term === '' ||
          normalize(row.expense.description).includes(term) ||
          normalize(row.category?.name ?? '').includes(term)),
    );
  });

  private readonly sorted = computed(() => {
    const { field, dir } = this.sort();
    const factor = dir === 'asc' ? 1 : -1;
    return [...this.filtered()].sort(
      (a, b) =>
        factor *
        (field === 'date'
          ? a.expense.spentAt.localeCompare(b.expense.spentAt)
          : a.expense.amountMinor - b.expense.amountMinor),
    );
  });

  protected readonly total = computed(() => this.sorted().length);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  protected readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));

  protected readonly pageRows = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.sorted().slice(start, start + PAGE_SIZE);
  });

  protected readonly range = computed(() => ({
    from: this.total() === 0 ? 0 : (this.currentPage() - 1) * PAGE_SIZE + 1,
    to: Math.min(this.currentPage() * PAGE_SIZE, this.total()),
  }));

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  protected selectCategory(id: string | null): void {
    this.categoryId.set(id);
    this.page.set(1);
  }

  protected toggleSort(field: SortField): void {
    const current = this.sort();
    this.sort.set(
      current.field === field
        ? { field, dir: current.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'desc' },
    );
    this.page.set(1);
  }

  protected goTo(page: number): void {
    this.page.set(page);
  }

  protected edit(expense: Expense): void {
    this.modal.edit(expense);
  }

  protected remove(expense: Expense): void {
    this.expenses.remove(expense.id);
    this.toast.show('Gasto eliminado', {
      action: { label: 'Deshacer', run: () => this.expenses.restore(expense) },
    });
  }
}
