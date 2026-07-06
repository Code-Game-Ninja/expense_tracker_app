import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import type { Transaction } from "@/db/types";
import { getCategory } from "@/utils/categories";
import { relativeDay } from "@/utils/date";
import { AmountText } from "./AmountText";
import { CategoryBadge } from "./CategoryBadge";

/**
 * A transaction line. When `onDelete` is provided, the row becomes
 * swipeable (swipe left to reveal a delete action) — used in the full
 * transactions list. Without it, the row is a plain tappable link.
 */
export function TransactionRow({
  tx,
  onDelete,
}: {
  tx: Transaction;
  onDelete?: (tx: Transaction) => void;
}) {
  const swipeRef = useRef<SwipeableMethods>(null);

  const content = <RowContent tx={tx} />;

  if (!onDelete) return content;

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={() => (
        <Pressable
          onPress={() => {
            swipeRef.current?.close();
            onDelete(tx);
          }}
          className="bg-expense rounded-2xl items-center justify-center my-1.5 ml-2"
          style={{ width: 72 }}
        >
          <Trash2 size={22} color="#fff" strokeWidth={2} />
        </Pressable>
      )}
    >
      {content}
    </ReanimatedSwipeable>
  );
}

function RowContent({ tx }: { tx: Transaction }) {
  const cat = getCategory(tx.categoryId);
  const signedValue = tx.type === "income" ? tx.amount : -tx.amount;

  return (
    <Pressable
      onPress={() => router.push(`/transaction/${tx.id}`)}
      className="flex-row items-center py-3.5 px-4 bg-surface rounded-2xl active:opacity-70 my-1"
    >
      <CategoryBadge categoryId={tx.categoryId} />

      <View className="flex-1 ml-3.5">
        <Text className="font-semibold text-text text-[15px]" numberOfLines={1}>
          {cat.name}
        </Text>
        <Text className="font-sans text-muted text-[12px] mt-1" numberOfLines={1}>
          {tx.note?.trim() ? tx.note : relativeDay(tx.date)}
        </Text>
      </View>

      <AmountText
        value={signedValue}
        signed
        className={`text-[16px] font-semibold ${
          tx.type === "income" ? "text-income" : "text-text"
        }`}
      />
    </Pressable>
  );
}
