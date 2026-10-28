import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../../core/categories.service';
import {
  PERIODICITIES,
  PERIODICITY_LABEL,
  Periodicity,
  RecurringDraft,
  RecurringExpense,
} from '../../../core/models/recurring-expense.model';
import { WEEKDAYS } from '../../../core/recurrence';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

@Component({
  selector: 'app-recurring-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog
      [title]="isEdit() ? 'Editar gasto fijo' : 'Nuevo gasto fijo'"
      (closed)="cancelled.emit()"
    >
      <form class="form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="rec-name">Nombre <b class="req">*</b></label>
          <input id="rec-name" formControlName="name" placeholder="Alquiler" />
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <small class="field-error">Ingresá un nombre.</small>
          }
        </div>

        <div class="field">
          <label for="rec-category">Categoría <b class="req">*</b></label>
          <select id="rec-category" formControlName="categoryId">
            @for (c of categories.all(); track c.id) {
              <option [value]="c.id">{{ c.name }}</option>
            }
          </select>
        </div>

        <div class="field">
          <label for="rec-amount">Monto <b class="req">*</b></label>
          <div class="money">
            <span class="pre">$</span>
            <input id="rec-amount" type="number" step="0.01" formControlName="amount" />
            <span class="post">ARS</span>
          </div>
          @if (form.controls.amount.touched && form.controls.amount.invalid) {
            <small class="field-error">El monto debe ser mayor a cero.</small>
          }
        </div>

        <div class="row-2">
          <div class="field">
            <label for="rec-period">Periodicidad</label>
            <select id="rec-period" formControlName="periodicity" (change)="onPeriodicityChange()">
              @for (p of periodicities; track p) {
                <option [value]="p">{{ periodicityLabel[p] }}</option>
              }
            </select>
          </div>

          @if (form.controls.periodicity.value === 'WEEKLY') {
            <div class="field">
              <label for="rec-day-week">Día de la semana</label>
              <select id="rec-day-week" formControlName="dueDay">
                @for (day of weekdays; track day) {
                  <option [ngValue]="$index + 1">{{ day }}</option>
                }
              </select>
            </div>
          } @else {
            <div class="field">
              <label for="rec-day-month">Día del mes</label>
              <input id="rec-day-month" type="number" min="1" max="31" formControlName="dueDay" />
            </div>
          }
        </div>

        @if (form.controls.periodicity.value === 'MONTHLY') {
          <small class="hint">Si el mes no tiene ese día, se usa el último día del mes.</small>
        }

        <button type="submit" class="cta">Guardar</button>
      </form>
    </app-dialog>
  `,
  styles: `
    .hint {
      color: var(--color-muted);
      font-size: 12px;
    }
  `,
})
export class RecurringFormComponent implements OnInit {
  protected readonly categories = inject(CategoriesService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly item = input<RecurringExpense | null>(null);
  readonly saved = output<RecurringDraft>();
  readonly cancelled = output<void>();

  protected readonly isEdit = computed(() => this.item() !== null);
  protected readonly periodicities = PERIODICITIES;
  protected readonly periodicityLabel = PERIODICITY_LABEL;
  protected readonly weekdays = WEEKDAYS;

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    categoryId: [this.categories.all()[0]?.id ?? '', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    periodicity: ['MONTHLY' as Periodicity, Validators.required],
    dueDay: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
  });

  ngOnInit(): void {
    const item = this.item();
    if (!item) {
      return;
    }
    this.form.reset({
      name: item.name,
      categoryId: item.categoryId,
      amount: item.amountMinor / 100,
      periodicity: item.periodicity,
      dueDay: item.dueDay,
    });
  }

  protected onPeriodicityChange(): void {
    this.form.controls.dueDay.setValue(1);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      name: value.name.trim(),
      categoryId: value.categoryId,
      amountMinor: Math.round(value.amount * 100),
      periodicity: value.periodicity,
      dueDay: value.dueDay,
    });
  }
}
