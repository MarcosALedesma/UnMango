import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { Expense } from '../../core/models/expense.model';
import { CategoryIconComponent } from '../category-icon/category-icon.component';
import { IconComponent } from '../icon/icon.component';
import { MoneyPipe } from '../pipes/money.pipe';
import { ShortDatePipe } from '../pipes/short-date.pipe';

export interface ExpenseRow {
  readonly expense: Expense;
  readonly category: Category | undefined;
}

export type SortField = 'date' | 'amount';

export interface SortState {
  readonly field: SortField;
  readonly dir: 'asc' | 'desc';
}

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CategoryIconComponent, IconComponent, MoneyPipe, ShortDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <table class="table">
        <thead>
          <tr>
            <th class="col-date" scope="col" [attr.aria-sort]="ariaSort('date')">
              @if (sort()) {
                <button type="button" class="sort" (click)="sortChange.emit('date')">
                  Fecha
                  @if (sort()?.field === 'date') {
                    <app-icon
                      [name]="sort()?.dir === 'asc' ? 'arrow-up' : 'arrow-down'"
                      [size]="14"
                    />
                  }
                </button>
              } @else {
                Fecha
              }
            </th>
            <th scope="col">Descripción</th>
            <th class="col-cat" scope="col">Categoría</th>
            <th class="amount" scope="col" [attr.aria-sort]="ariaSort('amount')">
              @if (sort()) {
                <button type="button" class="sort" (click)="sortChange.emit('amount')">
                  Monto
                  @if (sort()?.field === 'amount') {
                    <app-icon
                      [name]="sort()?.dir === 'asc' ? 'arrow-up' : 'arrow-down'"
                      [size]="14"
                    />
                  }
                </button>
              } @else {
                Monto
              }
            </th>
            @if (actions()) {
              <th scope="col"><span class="sr-only">Acciones</span></th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.expense.id) {
            <tr>
              <td class="col-date">{{ row.expense.spentAt | shortDate }}</td>
              <td class="desc">
                <strong>{{ row.expense.description }}</strong>
                <small class="sub">
                  {{ row.expense.spentAt | shortDate }} ·
                  {{ row.category?.name ?? 'Sin categoría' }}
                </small>
              </td>
              <td class="col-cat">
                <span class="cat">
                  <app-category-icon [category]="row.category" [size]="14" />
                  {{ row.category?.name ?? 'Sin categoría' }}
                </span>
              </td>
              <td class="amount">{{ row.expense.amountMinor | money }}</td>
              @if (actions()) {
                <td class="row-actions">
                  <button
                    type="button"
                    class="icon-action"
                    [attr.aria-label]="'Editar ' + row.expense.description"
                    (click)="edit.emit(row.expense)"
                  >
                    <app-icon name="edit" [size]="16" />
                  </button>
                  <button
                    type="button"
                    class="icon-action danger"
                    [attr.aria-label]="'Eliminar ' + row.expense.description"
                    (click)="remove.emit(row.expense)"
                  >
                    <app-icon name="trash" [size]="16" />
                  </button>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .wrap {
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      padding: 10px 12px;
      border-bottom: 1px solid var(--color-line);
      color: var(--color-muted);
      font-size: 12px;
      font-weight: 600;
      text-align: left;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid var(--color-line);
      font-size: 13px;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    .amount {
      font-weight: 700;
      text-align: right;
      white-space: nowrap;
    }

    th.amount {
      font-weight: 600;
    }

    .cat {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .sort {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 0;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .sub {
      display: none;
      color: var(--color-muted);
      font-size: 11px;
    }
    .row-actions {
      text-align: right;
      white-space: nowrap;
    }
    @media (max-width: 860px) {
      .col-date,
      .col-cat {
        display: none;
      }

      .sub {
        display: block;
      }
    }
  `,
})
export class ExpenseTableComponent {
  readonly rows = input.required<readonly ExpenseRow[]>();
  readonly sort = input<SortState | null>(null);
  readonly sortChange = output<SortField>();
  readonly actions = input<boolean>(false);
  readonly edit = output<Expense>();
  readonly remove = output<Expense>();

  protected ariaSort(field: SortField): 'ascending' | 'descending' | 'none' | null {
    const current = this.sort();
    if (!current) {
      return null;
    }
    if (current.field !== field) {
      return 'none';
    }
    return current.dir === 'asc' ? 'ascending' : 'descending';
  }
}
