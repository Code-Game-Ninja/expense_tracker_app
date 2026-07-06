import * as Haptics from "expo-haptics";
import { useSQLiteContext } from "expo-sqlite";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useCallback, useState } from "react";
import { RefreshControl, SectionList, Text, View } from "react-native";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeleton";
import { TransactionRow } from "@/components/TransactionRow";
import { useToast } from "@/components/Toast";
import { deleteTransaction } from "@/db/queries";
import type { Transaction } from "@/db/types";
import { useMonthData } from "@/hooks/useMonthData";
import { useTheme } from "@/theme/ThemeProvider";
import { currentMonthKey, monthLabel, relativeDay, shiftMonth } from "@/utils/date";

/** Group a month's transactions into day-labelled sections. */
function groupByDay(txs: Transaction[]) {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const key = relativeDay(tx.date);
    (map.get(key) ?? map.set(key, []).get(key)!).push(tx);
  }
  return Array.from(map, ([title, data]) => ({ title, data }));
}

export default function Transactions() {
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const toast = useToast();
  const [month, setMonth] = useState(currentMonthKey());
  const { transactions, loading, reload } = useMonthData(month);
  const sections = groupByDay(transactions);

  const handleDelete = useCallback(
    async (tx: Transaction) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await deleteTransaction(db, tx.id);
      await reload();
      toast.show("Transaction deleted", "error");
    },
    [db, reload, toast]
  );

  return (
    <View className="flex-1 bg-bg">
      {/* Fixed Header */}
      <View
        className="px-5 bg-bg"
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 12,
        }}
      >
        <Text className="font-display-bold text-text text-2xl mb-4">
          Transactions
        </Text>

        {/* Month switcher */}
        <View className="flex-row items-center justify-center bg-surface rounded-pill px-3 py-2">
          <Pressable
            onPress={() => setMonth((m) => shiftMonth(m, -1))}
            className="w-10 h-10 items-center justify-center rounded-full active:opacity-50"
            style={{ backgroundColor: colors.surface2 }}
          >
            <ChevronLeft size={20} color={colors.text} />
          </Pressable>
          <Text className="flex-1 font-semibold text-text text-[15px] text-center mx-3">
            {monthLabel(month)}
          </Text>
          <Pressable
            onPress={() => setMonth((m) => shiftMonth(m, 1))}
            className="w-10 h-10 items-center justify-center rounded-full active:opacity-50"
            style={{ backgroundColor: colors.surface2 }}
          >
            <ChevronRight size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View className="px-5 pt-2">
          <ListSkeleton rows={6} />
        </View>
      ) : sections.length === 0 ? (
        <EmptyState
          title="No transactions"
          subtitle={`Nothing recorded for ${monthLabel(month)}.`}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ 
            paddingHorizontal: 20, 
            paddingTop: 8,
            paddingBottom: 120 
          }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={reload}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          renderSectionHeader={({ section }) => (
            <Text className="font-medium text-muted text-[11px] uppercase tracking-wider mt-5 mb-2.5 px-1">
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <TransactionRow tx={item} onDelete={handleDelete} />
          )}
        />
      )}
    </View>
  );
}
