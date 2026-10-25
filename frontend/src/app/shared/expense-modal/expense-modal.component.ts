import { ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseModalService } from '../../core/expense-modal.service';
import { ExpenseDraft } from './expense-draft';
import { IconComponent } from '../icon/icon.component';

const CATEGORIES: readonly string[] = [
  'Comida',
  'Transporte',
  'Vivienda',
  'Ocio',
  'Salud',
  'Suscripciones',
  'Otros',
];

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './expense-modal.component.html',
  styleUrl: './expense-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseModalComponent {
  protected readonly modal = inject(ExpenseModalService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly saved = output<ExpenseDraft>();
  protected readonly categories = CATEGORIES;

  protected readonly form = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(120)]],
    category: [CATEGORIES[0] ?? 'Otros', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    spentAt: [this.today(), Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.modal.isOpen()) {
        this.form.reset({
          description: '',
          category: CATEGORIES[0] ?? 'Otros',
          amount: 0,
          spentAt: this.today(),
        });
      }
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      description: value.description.trim(),
      category: value.category,
      amountMinor: Math.round(value.amount * 100),
      spentAt: value.spentAt,
    });
    this.modal.close();
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.modal.close();
    }
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
