export type TxType = "expense" | "income";

export interface Transaction {
  id: number;
  amount: number; // always stored positive; `type` gives the sign
  type: TxType;
  categoryId: string;
  note: string | null;
  date: string; // ISO 8601
  createdAt: string; // ISO 8601
}

export type NewTransaction = Omit<Transaction, "id" | "createdAt">;

export interface MonthSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryTotal {
  categoryId: string;
  total: number;
}

export interface Budget {
  categoryId: string;
  amount: number;
  period: string;
}

/** A budget joined with how much has been spent in the current period. */
export interface BudgetWithSpent extends Budget {
  spent: number;
}
