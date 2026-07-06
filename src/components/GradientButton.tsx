import { type ReactNode } from "react";
import { Text, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PressableScale } from "./PressableScale";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Optional leading icon (already colored by caller if needed). */
  icon?: ReactNode;
  className?: string;
  style?: ViewStyle;
};

/**
 * Primary call-to-action: a pill filled with the active theme's accent
 * gradient, with dark-on-accent ink. Replaces the old flat bg-accent
 * buttons so every CTA picks up the redesign gradient automatically.
 */
export function GradientButton({
  label,
  onPress,
  disabled = false,
  icon,
  className = "",
  style,
}: Props) {
  const { gradient, colors } = useTheme();

  return (
    <PressableScale
      onPress={disabled ? undefined : onPress}
      haptic={!disabled}
      scaleTo={0.97}
      style={[{ opacity: disabled ? 0.4 : 1, borderRadius: 999 }, style]}
      className={className}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 999,
          paddingVertical: 17,
          paddingHorizontal: 24,
        }}
      >
        <View className="flex-row items-center justify-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text
            className="font-semibold text-base"
            style={{ color: colors.accentText }}
          >
            {label}
          </Text>
        </View>
      </LinearGradient>
    </PressableScale>
  );
}
