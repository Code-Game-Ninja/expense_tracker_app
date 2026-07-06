import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AmountText } from "@/components/AmountText";
import { Card } from "@/components/Card";
import { CategoryBadge } from "@/components/CategoryBadge";
import { EmptyState } from "@/components/EmptyState";
import { PressableScale } from "@/components/PressableScale";
import { ProgressBar } from "@/components/ProgressBar";
import { ScreenHeader } from "@/components/ScreenHeader";
import { getBudgetsWithSpent } from "@/db/queries";
import type { BudgetWithSpent } from "@/db/types";
import { useTheme } from "@/theme/ThemeProvider";
import { useMotion } from "@/theme/useMotion";
import { getCategory } from "@/utils/categories";
import { currentMonthKey, monthLabel } from "@/utils/date";

export default function Budgets() {
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const motion = useMotion();
  const month = currentMonthKey();
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);

  useFocusEffect(
    useCallback(() => {
      getBudgetsWithSpent(db, month).then(setBudgets);
    }, [db, month])
  );

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overall = totalBudget > 0 ? totalSpent / totalBudget : 0;

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-5">
        <ScreenHeader
          title="Budgets"
          leading="back"
          onLeadingPress={() => router.back()}
          trailing={
            <PressableScale
              onPress={() => router.push("/budget/food")}
              scaleTo={0.9}
              className="items-center justify-center rounded-full"
              style={{ width: 40, height: 40, backgroundColor: colors.surface }}
            >
              <Plus size={22} color={colors.text} />
            </PressableScale>
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 40,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall summary */}
        <Card elevated>
          <Text className="font-medium text-muted text-[13px] uppercase tracking-wider">
            {monthLabel(month)} · Total
          </Text>
          <View className="flex-row items-end justify-between mt-2 mb-3">
            <AmountText value={totalSpent} className="text-3xl text-text" />
            <Text className="font-sans text-muted text-[14px] mb-1">
              of <AmountTextInline value={totalBudget} />
            </Text>
          </View>
          <ProgressBar
            progress={overall}
            color={overall >= 1 ? colors.expense : undefined}
          />
        </Card>

        {/* Per-category budgets */}
        {budgets.length === 0 ? (
          <Card className="mt-5">
            <EmptyState
              title="No budgets set"
              subtitle="Tap a category below or the + button to set a monthly limit."
            />
          </Card>
        ) : (
          <View className="mt-5 gap-3">
            {budgets.map((b, i) => (
              <Animated.View
                key={b.categoryId}
                entering={motion.entering(
                  FadeInDown.delay(50 * i).springify().damping(18)
                )}
              >
                <BudgetRow budget={b} />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function BudgetRow({ budget }: { budget: BudgetWithSpent }) {
  const { colors } = useTheme();
  const cat = getCategory(budget.categoryId);
  const ratio = budget.amount > 0 ? budget.spent / budget.amount : 0;
  const over = ratio >= 1;
  const remaining = budget.amount - budget.spent;

  return (
    <PressableScale onPress={() => router.push(`/budget/${budget.categoryId}`)}>
      <Card>
        <View className="flex-row items-center mb-3">
          <CategoryBadge categoryId={budget.categoryId} size={40} />
          <View className="flex-1 ml-3">
            <Text className="font-semibold text-text text-[15px]">
              {cat.name}
            </Text>
            <Text
              className="font-sans text-[13px] mt-0.5"
              style={{ color: over ? colors.expense : colors.muted }}
            >
              {over ? "Over by " : "Left: "}
              <AmountTextInline value={Math.abs(remaining)} />
            </Text>
          </View>
          <View className="items-end">
            <AmountText value={budget.spent} className="text-[15px] text-text" />
            <Text className="font-sans text-muted text-[12px]">
              of <AmountTextInline value={budget.amount} />
            </Text>
          </View>
        </View>
        <ProgressBar progress={ratio} color={over ? colors.expense : cat.color} />
      </Card>
    </PressableScale>
  );
}

/** Inline (non-animated) money text for use inside sentences. */
function AmountTextInline({ value }: { value: number }) {
  return <AmountText value={value} className="text-muted" />;
}
