import type { SQLiteDatabase } from "expo-sqlite";
import type {
  Budget,
  BudgetWithSpent,
  CategoryTotal,
  MonthSummary,
  NewTransaction,
  Transaction,
} from "./types";

/** Insert a transaction. Returns the new row id. */
export async function insertTransaction(
  db: SQLiteDatabase,
  tx: NewTransaction
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO transactions (amount, type, categoryId, note, date)
     VALUES (?, ?, ?, ?, ?)`,
    tx.amount,
    tx.type,
    tx.categoryId,
    tx.note ?? null,
    tx.date
  );
  return result.lastInsertRowId;
}

export async function updateTransaction(
  db: SQLiteDatabase,
  id: number,
  tx: NewTransaction
): Promise<void> {
  await db.runAsync(
    `UPDATE transactions
     SET amount = ?, type = ?, categoryId = ?, note = ?, date = ?
     WHERE id = ?`,
    tx.amount,
    tx.type,
    tx.categoryId,
    tx.note ?? null,
    tx.date,
    id
  );
}

export async function deleteTransaction(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, id);
}

export async function getTransaction(
  db: SQLiteDatabase,
  id: number
): Promise<Transaction | null> {
  return db.getFirstAsync<Transaction>(
    `SELECT * FROM transactions WHERE id = ?`,
    id
  );
}

/** All transactions in a month ("YYYY-MM"), newest first. */
export async function listByMonth(
  db: SQLiteDatabase,
  month: string
): Promise<Transaction[]> {
  return db.getAllAsync<Transaction>(
    `SELECT * FROM transactions
     WHERE substr(date, 1, 7) = ?
     ORDER BY date DESC, id DESC`,
    month
  );
}

/** Most recent N transactions across all time. */
export async function listRecent(
  db: SQLiteDatabase,
  limit = 5
): Promise<Transaction[]> {
  return db.getAllAsync<Transaction>(
    `SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ?`,
    limit
  );
}

/** Income / expense / balance totals for a month. */
export async function getMonthSummary(
  db: SQLiteDatabase,
  month: string
): Promise<MonthSummary> {
  const row = await db.getFirstAsync<{ income: number; expense: number }>(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'income'  THEN amount END), 0) AS income,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS expense
     FROM transactions
     WHERE substr(date, 1, 7) = ?`,
    month
  );
  const income = row?.income ?? 0;
  const expense = row?.expense ?? 0;
  return { income, expense, balance: income - expense };
}

/** Expense totals grouped by category for a month, largest first. */
export async function getCategoryBreakdown(
  db: SQLiteDatabase,
  month: string
): Promise<CategoryTotal[]> {
  return db.getAllAsync<CategoryTotal>(
    `SELECT categoryId, SUM(amount) AS total
     FROM transactions
     WHERE type = 'expense' AND substr(date, 1, 7) = ?
     GROUP BY categoryId
     ORDER BY total DESC`,
    month
  );
}

/* ------------------------------- Budgets -------------------------------- */

/** Create or update a category's monthly budget. */
export async function setBudget(
  db: SQLiteDatabase,
  categoryId: string,
  amount: number
): Promise<void> {
  await db.runAsync(
    `INSERT INTO budgets (categoryId, amount, period)
     VALUES (?, ?, 'monthly')
     ON CONFLICT(categoryId) DO UPDATE SET amount = excluded.amount`,
    categoryId,
    amount
  );
}

export async function deleteBudget(
  db: SQLiteDatabase,
  categoryId: string
): Promise<void> {
  await db.runAsync(`DELETE FROM budgets WHERE categoryId = ?`, categoryId);
}

export async function getBudget(
  db: SQLiteDatabase,
  categoryId: string
): Promise<Budget | null> {
  return db.getFirstAsync<Budget>(
    `SELECT * FROM budgets WHERE categoryId = ?`,
    categoryId
  );
}

/**
 * All budgets joined with actual spend for the given month, largest
 * budget first. Spend is computed via a correlated subquery so
 * categories with zero transactions still report spent = 0.
 */
export async function getBudgetsWithSpent(
  db: SQLiteDatabase,
  month: string
): Promise<BudgetWithSpent[]> {
  return db.getAllAsync<BudgetWithSpent>(
    `SELECT
       b.categoryId AS categoryId,
       b.amount     AS amount,
       b.period     AS period,
       COALESCE((
         SELECT SUM(t.amount) FROM transactions t
         WHERE t.categoryId = b.categoryId
           AND t.type = 'expense'
           AND substr(t.date, 1, 7) = ?
       ), 0) AS spent
     FROM budgets b
     ORDER BY b.amount DESC`,
    month
  );
}

/* ------------------------------- Clear All Data -------------------------------- */

/** Delete all transactions and budgets. Use with caution! */
export async function clearAllData(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    DELETE FROM transactions;
    DELETE FROM budgets;
  `);
}
