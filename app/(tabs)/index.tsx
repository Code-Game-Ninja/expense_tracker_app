import { router } from "expo-router";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ListChecks,
  Search,
  User,
} from "lucide-react-native";
import { RefreshControl, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { BalanceHeader } from "@/components/BalanceHeader";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { PressableScale } from "@/components/PressableScale";
import { ListSkeleton } from "@/components/Skeleton";
import { TransactionRow } from "@/components/TransactionRow";
import { useMonthData } from "@/hooks/useMonthData";
import { useTheme } from "@/theme/ThemeProvider";
import { useMotion } from "@/theme/useMotion";
import { currentMonthKey, monthLabel } from "@/utils/date";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const motion = useMotion();
  const month = currentMonthKey();
  const { transactions, summary, loading, reload } = useMonthData(month);
  const recent = transactions.slice(0, 6);

  // Small helper so each section can fade+rise in sequence.
  const enter = (i: number) =>
    motion.entering(FadeInDown.delay(60 * i).springify().damping(18));

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={reload}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
    >
      {/* Top app bar */}
      <Animated.View
        entering={enter(0)}
        className="flex-row items-center justify-between mb-5"
      >
        <View>
          <Text className="font-sans text-muted text-[14px]">
            Welcome back 👋
          </Text>
          <Text className="font-display-bold text-text text-2xl">
            Your Money
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <PressableScale
            onPress={() => router.push("/(tabs)/transactions")}
            scaleTo={0.9}
            className="items-center justify-center rounded-full"
            style={{ width: 42, height: 42, backgroundColor: colors.surface }}
          >
            <Search size={20} color={colors.text} />
          </PressableScale>
          <PressableScale
            onPress={() => router.push("/(tabs)/settings")}
            scaleTo={0.9}
            className="items-center justify-center rounded-full"
            style={{ width: 42, height: 42, backgroundColor: colors.surface2 }}
          >
            <User size={20} color={colors.accentSoft} />
          </PressableScale>
        </View>
      </Animated.View>

      <Animated.View entering={enter(1)}>
        <BalanceHeader summary={summary} monthLabel={monthLabel(month)} />
      </Animated.View>

      {/* Quick actions — three tiles à la the reference */}
      <Animated.View entering={enter(2)} className="flex-row gap-3 mt-4">
        <QuickAction
          label="Add Expense"
          icon={<ArrowUpCircle size={22} color={colors.expense} />}
          tint={colors.expense}
          onPress={() => router.push("/transaction/new")}
        />
        <QuickAction
          label="Add Income"
          icon={<ArrowDownCircle size={22} color={colors.income} />}
          tint={colors.income}
          onPress={() => router.push("/transaction/new")}
        />
        <QuickAction
          label="Activity"
          icon={<ListChecks size={22} color={colors.accentSoft} />}
          tint={colors.accentSoft}
          onPress={() => router.push("/(tabs)/transactions")}
        />
      </Animated.View>

      <Animated.View
        entering={enter(3)}
        className="flex-row items-center justify-between mt-7 mb-1"
      >
        <Text className="font-display text-text text-lg">Recent</Text>
        <Text
          className="font-medium text-accent-soft text-[13px]"
          onPress={() => router.push("/(tabs)/transactions")}
        >
          See all
        </Text>
      </Animated.View>

      <Animated.View entering={enter(4)}>
        <Card className="py-2">
          {loading ? (
            <View className="py-3">
              <ListSkeleton rows={4} />
            </View>
          ) : recent.length === 0 ? (
            <EmptyState />
          ) : (
            recent.map((tx, i) => (
              <View key={tx.id}>
                {i > 0 && <View className="h-px bg-border/60" />}
                <TransactionRow tx={tx} />
              </View>
            ))
          )}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

function QuickAction({
  label,
  icon,
  tint,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  tint: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      className="flex-1 items-center bg-surface rounded-2xl px-2 py-4"
    >
      <View
        className="items-center justify-center rounded-full mb-2"
        style={{ width: 44, height: 44, backgroundColor: tint + "22" }}
      >
        {icon}
      </View>
      <Text className="font-medium text-text text-[12px] text-center">
        {label}
      </Text>
    </PressableScale>
  );
}
