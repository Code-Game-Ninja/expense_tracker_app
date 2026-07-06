import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

/** A single shimmering placeholder block. */
export function Skeleton({
  width = "100%",
  height = 20,
  radius = 8,
  className = "",
}: {
  width?: number | string;
  height?: number;
  radius?: number;
  className?: string;
}) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 800 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={`bg-surface2 ${className}`}
      style={[{ width: width as number, height, borderRadius: radius }, style]}
    />
  );
}

/** A few stacked rows to stand in for a transaction list while loading. */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View className="gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="flex-row items-center">
          <Skeleton width={44} height={44} radius={22} />
          <View className="flex-1 ml-3 gap-2">
            <Skeleton width={"55%" as unknown as number} height={14} />
            <Skeleton width={"35%" as unknown as number} height={12} />
          </View>
          <Skeleton width={60} height={16} />
        </View>
      ))}
    </View>
  );
}
