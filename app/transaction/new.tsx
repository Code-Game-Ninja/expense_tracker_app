import { useSQLiteContext } from "expo-sqlite";
import { TransactionForm } from "@/components/TransactionForm";
import { insertTransaction } from "@/db/queries";
import type { NewTransaction } from "@/db/types";

export default function NewTransaction() {
  const db = useSQLiteContext();

  return (
    <TransactionForm
      title="Add Transaction"
      submitLabel="Save"
      onSubmit={async (tx: NewTransaction) => {
        await insertTransaction(db, tx);
      }}
    />
  );
}
