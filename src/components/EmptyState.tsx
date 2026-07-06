import { Receipt } from "lucide-react-native";
import { Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function EmptyState({
  title = "Nothing here yet",
  subtitle = "Add your first transaction to get started.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const { colors } = useTheme();
  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="w-16 h-16 rounded-full bg-surface2 items-center justify-center mb-4">
        <Receipt size={28} color={colors.muted} strokeWidth={1.75} />
      </View>
      <Text className="font-display text-text text-lg text-center">{title}</Text>
      <Text className="font-sans text-muted text-[13px] text-center mt-1.5 leading-5">
        {subtitle}
      </Text>
    </View>
  );
}
