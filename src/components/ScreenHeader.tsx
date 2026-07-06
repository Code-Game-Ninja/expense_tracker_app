import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { ChevronLeft, X } from "lucide-react-native";
import { PressableScale } from "./PressableScale";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  title: string;
  /** "back" = chevron, "close" = X, "none" = no leading button. */
  leading?: "back" | "close" | "none";
  onLeadingPress?: () => void;
  /** Optional trailing element (e.g. a + button). */
  trailing?: ReactNode;
};

/**
 * Shared screen/modal header: a circular leading button, centered title
 * and an optional trailing slot. Dedupes the hand-rolled headers that
 * used to live in budgets, budget/[id] and the transaction form.
 */
export function ScreenHeader({
  title,
  leading = "back",
  onLeadingPress,
  trailing,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between mb-2">
      {leading === "none" ? (
        <View style={{ width: 40, height: 40 }} />
      ) : (
        <PressableScale
          onPress={onLeadingPress}
          scaleTo={0.9}
          className="items-center justify-center rounded-full"
          style={{ width: 40, height: 40, backgroundColor: colors.surface }}
        >
          {leading === "close" ? (
            <X size={20} color={colors.text} />
          ) : (
            <ChevronLeft size={22} color={colors.text} />
          )}
        </PressableScale>
      )}

      <Text className="font-display text-lg" style={{ color: colors.text }}>
        {title}
      </Text>

      {trailing ?? <View style={{ width: 40, height: 40 }} />}
    </View>
  );
}
