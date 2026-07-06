import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { MonthSummary } from "@/db/types";
import { useSettings } from "@/store/settings";
import { useTheme } from "@/theme/ThemeProvider";
import { AmountText } from "./AmountText";
import { PressableScale } from "./PressableScale";

/**
 * The dashboard hero: a gradient card carrying the balance (dark ink on
 * the accent gradient, à la the reference), with an eye toggle for the
 * hide-amounts privacy mode, and an income/expense split below.
 */
export function BalanceHeader({
  summary,
  monthLabel,
}: {
  summary: MonthSummary;
  monthLabel: string;
}) {
  const { colors, gradient } = useTheme();
  const hideAmounts = useSettings((s) => s.hideAmounts);
  const toggleHideAmounts = useSettings((s) => s.toggleHideAmounts);
  const EyeIcon = hideAmounts ? EyeOff : Eye;

  return (
    <View>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 28,
          padding: 22,
          shadowColor: gradient[1],
          shadowOpacity: 0.35,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Text
            className="font-medium text-[13px] uppercase tracking-wider"
            style={{ color: colors.accentText, opacity: 0.7 }}
          >
            {monthLabel} · Available balance
          </Text>
          <PressableScale
            onPress={toggleHideAmounts}
            scaleTo={0.85}
            className="items-center justify-center rounded-full"
            style={{
              width: 34,
              height: 34,
              backgroundColor: colors.accentText + "1A",
            }}
          >
            <EyeIcon size={18} color={colors.accentText} />
          </PressableScale>
        </View>

        <AmountText
          value={summary.balance}
          animate
          color={colors.accentText}
          className="text-[40px] mt-3"
        />
      </LinearGradient>

      <View className="flex-row mt-3 gap-3">
        <Stat
          label="Income"
          value={summary.income}
          color={colors.income}
          icon={<ArrowDownLeft size={16} color={colors.income} />}
        />
        <Stat
          label="Expense"
          value={summary.expense}
          color={colors.expense}
          icon={<ArrowUpRight size={16} color={colors.expense} />}
        />
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="flex-1 flex-row items-center bg-surface rounded-2xl px-3 py-3">
      <View
        className="w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: color + "22" }}
      >
        {icon}
      </View>
      <View className="ml-2.5 flex-1">
        <Text className="font-sans text-muted text-[11px]">{label}</Text>
        <AmountText value={value} className="text-[15px] text-text" />
      </View>
    </View>
  );
}
