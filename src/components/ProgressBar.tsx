import { useEffect } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSettings } from "@/store/settings";
import { useTheme } from "@/theme/ThemeProvider";

/**
 * Animated progress bar. `progress` is 0..1 (clamped). By default the
 * fill uses the theme's accent gradient; pass a solid `color` (e.g.
 * expense red) to override — the caller does this to signal "over budget".
 */
export function ProgressBar({
  progress,
  color,
  track,
  height = 8,
}: {
  progress: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const { colors, gradient } = useTheme();
  const animationsEnabled = useSettings((s) => s.animationsEnabled);
  const clamped = Math.max(0, Math.min(progress, 1));
  const width = useSharedValue(animationsEnabled ? 0 : clamped);

  useEffect(() => {
    width.value = animationsEnabled
      ? withTiming(clamped, { duration: 600 })
      : clamped;
  }, [clamped, width, animationsEnabled]);

  const style = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      style={{
        height,
        borderRadius: height,
        backgroundColor: track ?? colors.surface2,
        overflow: "hidden",
      }}
    >
      <Animated.View style={[{ height, borderRadius: height }, style]}>
        {color ? (
          <View
            style={{ flex: 1, borderRadius: height, backgroundColor: color }}
          />
        ) : (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: height }}
          />
        )}
      </Animated.View>
    </View>
  );
}
