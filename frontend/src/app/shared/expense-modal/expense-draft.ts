export interface ExpenseDraft {
  readonly description: string;
  readonly category: string;
  readonly amountMinor: number;
  readonly spentAt: string;
}
