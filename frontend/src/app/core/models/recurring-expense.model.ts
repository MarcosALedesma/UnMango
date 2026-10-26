export type Periodicity = 'WEEKLY' | 'MONTHLY';

export const PERIODICITY_LABEL: Record<Periodicity, string> = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensual',
};

export interface RecurringExpense {
  readonly id: string;
  readonly name: string;
  readonly categoryId: string;
  readonly amountMinor: number;
  readonly periodicity: Periodicity;
  readonly nextDueDate: string;
  readonly active: boolean;
}
