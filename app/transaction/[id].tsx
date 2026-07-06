import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { TransactionForm } from "@/components/TransactionForm";
import {
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "@/db/queries";
import type { NewTransaction, Transaction } from "@/db/types";

export default function EditTransaction() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const txId = Number(id);
  const [tx, setTx] = useState<Transaction | null>(null);

  useEffect(() => {
    getTransaction(db, txId).then(setTx);
  }, [db, txId]);

  // Wait for the record to load before mounting the form so its initial
  // state is correct.
  if (!tx) return <View className="flex-1 bg-bg" />;

  return (
    <TransactionForm
      title="Edit Transaction"
      submitLabel="Update"
      initial={tx}
      onSubmit={async (next: NewTransaction) => {
        await updateTransaction(db, txId, next);
      }}
      onDelete={async () => {
        await deleteTransaction(db, txId);
      }}
    />
  );
}
