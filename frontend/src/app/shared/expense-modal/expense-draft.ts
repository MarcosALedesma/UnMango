export interface ExpenseDraft {
  readonly description: string;
  readonly categoryId: string;
  readonly amountMinor: number;
  readonly spentAt: string;
}

export interface ExpenseSubmission {
  readonly id: string | null;
  readonly draft: ExpenseDraft;
}
