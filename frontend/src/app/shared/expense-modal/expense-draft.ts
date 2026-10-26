export interface ExpenseDraft {
  readonly description: string;
  readonly categoryId: string;
  readonly amountMinor: number;
  readonly spentAt: string;
}
