import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CategoriesService } from '../../core/categories.service';
import {
  PERIODICITY_LABEL,
  RecurringDraft,
  RecurringExpense,
} from '../../core/models/recurring-expense.model';
import { RecurringService } from '../../core/recurring.service';
import { ToastService } from '../../core/toast.service';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { ShortDatePipe } from '../../shared/pipes/short-date.pipe';
import { RecurringFormComponent } from './recurring-form/recurring-form.component';

type Editing = RecurringExpense | 'new' | null;

@Component({
  selector: 'app-gastos-fijos',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CategoryIconComponent,
    IconComponent,
    RecurringFormComponent,
    MoneyPipe,
    ShortDatePipe,
  ],
  templateUrl: './gastos-fijos.component.html',
  styleUrl: './gastos-fijos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GastosFijosComponent {
  private readonly recurring = inject(RecurringService);
  private readonly categories = inject(CategoriesService);
  private readonly toast = inject(ToastService);

  protected readonly periodicityLabel = PERIODICITY_LABEL;
  protected readonly editing = signal<Editing>(null);

  protected readonly editingItem = computed(() => {
    const current = this.editing();
    return current === 'new' || current === null ? null : current;
  });

  protected readonly rows = computed(() =>
    [...this.recurring.all()]
      .sort(
        (a, b) => Number(b.active) - Number(a.active) || a.nextDueDate.localeCompare(b.nextDueDate),
      )
      .map((item) => ({ item, category: this.categories.byId(item.categoryId) })),
  );

  protected openNew(): void {
    this.editing.set('new');
  }

  protected openEdit(item: RecurringExpense): void {
    this.editing.set(item);
  }

  protected closeForm(): void {
    this.editing.set(null);
  }

  protected save(draft: RecurringDraft): void {
    const target = this.editingItem();
    if (target) {
      this.recurring.update(target.id, draft);
      this.toast.show('Gasto fijo actualizado');
    } else {
      this.recurring.add(draft);
      this.toast.show('Gasto fijo creado');
    }
    this.closeForm();
  }

  protected markPaid(item: RecurringExpense): void {
    this.recurring.markPaid(item.id);
    this.toast.show(`${item.name} marcado como pagado`);
  }

  protected toggle(item: RecurringExpense): void {
    this.recurring.toggleActive(item.id);
  }

  protected remove(item: RecurringExpense): void {
    this.recurring.remove(item.id);
    this.toast.show('Gasto fijo eliminado', {
      action: { label: 'Deshacer', run: () => this.recurring.restore(item) },
    });
  }
}
