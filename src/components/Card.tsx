import { View, type ViewProps } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

/**
 * Elevated surface with soft depth. `elevated` bumps it to the lighter
 * surface2 tone for stacking cards on cards. Padding responds to the
 * Display-density setting (comfortable vs compact).
 */
export function Card({
  className = "",
  elevated = false,
  style,
  ...props
}: ViewProps & { className?: string; elevated?: boolean }) {
  const { density } = useTheme();
  const pad = density === "compact" ? "p-4" : "p-5";
  return (
    <View
      className={`rounded-card ${pad} ${elevated ? "bg-surface2" : "bg-surface"} ${className}`}
      style={[
        {
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        },
        style,
      ]}
      {...props}
    />
  );
}
