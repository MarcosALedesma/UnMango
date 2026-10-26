import { format, subMonths } from 'date-fns';
import { Expense, ExpenseOrigin } from './models/expense.model';

export interface CategoryTotal {
  readonly categoryId: string;
  readonly totalMinor: number;
}

export function monthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function previousMonthKey(date: Date): string {
  return monthKey(subMonths(date, 1));
}

export function inMonth(
  expenses: readonly Expense[],
  month: string,
  origin?: ExpenseOrigin,
): readonly Expense[] {
  return expenses.filter(
    (e) => e.spentAt.startsWith(month) && (origin === undefined || e.origin === origin),
  );
}

export function totalOf(expenses: readonly Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amountMinor, 0);
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return null;
  }
  return Math.round(((current - previous) / previous) * 100);
}

export function totalsByCategory(expenses: readonly Expense[]): readonly CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const e of expenses) {
    totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + e.amountMinor);
  }
  return [...totals]
    .map(([categoryId, totalMinor]) => ({ categoryId, totalMinor }))
    .sort((a, b) => b.totalMinor - a.totalMinor);
}
