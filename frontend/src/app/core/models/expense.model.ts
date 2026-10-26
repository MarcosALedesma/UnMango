export type ExpenseOrigin = 'PERSONAL' | 'RECURRING' | 'EVENT';

export interface Expense {
  readonly id: string;
  readonly description: string;
  readonly categoryId: string;
  readonly amountMinor: number;
  readonly spentAt: string;
  readonly origin: ExpenseOrigin;
}

export type NewExpense = Omit<Expense, 'id'>;
