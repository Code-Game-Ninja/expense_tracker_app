import type { SQLiteDatabase } from "expo-sqlite";

/**
 * Runs on every app launch via <SQLiteProvider onInit>. Uses PRAGMA
 * user_version so migrations apply exactly once and are additive.
 * To add a schema change: bump DATABASE_VERSION and add an `if` block.
 */
const DATABASE_VERSION = 2;

export async function migrateDb(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let version = row?.user_version ?? 0;

  if (version >= DATABASE_VERSION) return;

  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS transactions (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        amount      REAL    NOT NULL,
        type        TEXT    NOT NULL CHECK (type IN ('expense','income')),
        categoryId  TEXT    NOT NULL,
        note        TEXT,
        date        TEXT    NOT NULL,
        createdAt   TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_tx_category ON transactions(categoryId);
    `);
    version = 1;
  }

  if (version === 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS budgets (
        categoryId  TEXT PRIMARY KEY,
        amount      REAL NOT NULL,
        period      TEXT NOT NULL DEFAULT 'monthly'
      );
    `);
    version = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
