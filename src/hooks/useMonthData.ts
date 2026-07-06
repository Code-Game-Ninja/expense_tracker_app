import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  getCategoryBreakdown,
  getMonthSummary,
  listByMonth,
} from "@/db/queries";
import type { CategoryTotal, MonthSummary, Transaction } from "@/db/types";

const EMPTY_SUMMARY: MonthSummary = { income: 0, expense: 0, balance: 0 };

/**
 * Loads everything a screen needs for a given month and refreshes
 * automatically whenever the screen regains focus (e.g. after adding
 * an expense on the modal and navigating back).
 */
export function useMonthData(month: string) {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<MonthSummary>(EMPTY_SUMMARY);
  const [breakdown, setBreakdown] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [txs, sum, bd] = await Promise.all([
      listByMonth(db, month),
      getMonthSummary(db, month),
      getCategoryBreakdown(db, month),
    ]);
    setTransactions(txs);
    setSummary(sum);
    setBreakdown(bd);
    setLoading(false);
  }, [db, month]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      reload().catch((e) => {
        if (active) console.warn("useMonthData load failed", e);
      });
      return () => {
        active = false;
      };
    }, [reload])
  );

  return { transactions, summary, breakdown, loading, reload };
}
