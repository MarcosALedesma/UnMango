import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  output,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { CategoriesService } from '../../core/categories.service';
import { ExpenseModalService } from '../../core/expense-modal.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ExpenseSubmission } from './expense-draft';

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent],
  templateUrl: './expense-modal.component.html',
  styleUrl: './expense-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseModalComponent {
  protected readonly modal = inject(ExpenseModalService);
  protected readonly categories = inject(CategoriesService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly saved = output<ExpenseSubmission>();

  protected readonly form = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(120)]],
    categoryId: [this.firstCategoryId(), Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    spentAt: [this.today(), Validators.required],
  });

  constructor() {
    effect(() => {
      if (!this.modal.isOpen()) {
        return;
      }
      const expense = this.modal.editing();
      untracked(() =>
        this.form.reset(
          expense
            ? {
                description: expense.description,
                categoryId: expense.categoryId,
                amount: expense.amountMinor / 100,
                spentAt: expense.spentAt,
              }
            : {
                description: '',
                categoryId: this.firstCategoryId(),
                amount: 0,
                spentAt: this.today(),
              },
        ),
      );
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      id: this.modal.editing()?.id ?? null,
      draft: {
        description: value.description.trim(),
        categoryId: value.categoryId,
        amountMinor: Math.round(value.amount * 100),
        spentAt: value.spentAt,
      },
    });
    this.modal.close();
  }

  private firstCategoryId(): string {
    return this.categories.all()[0]?.id ?? '';
  }

  private today(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }
}
