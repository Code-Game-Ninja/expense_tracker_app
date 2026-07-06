import { type ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSettings } from "@/store/settings";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  children: ReactNode;
  /** Scale target while pressed (default 0.96). */
  scaleTo?: number;
  /** Fire a light haptic on press-in (default true). */
  haptic?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * A Pressable that springs down slightly when pressed and fires a light
 * haptic — the standard micro-interaction for buttons, tiles and cards.
 * Honors the global Animations toggle (falls back to a plain Pressable).
 */
export function PressableScale({
  children,
  scaleTo = 0.96,
  haptic = true,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: Props) {
  const animationsEnabled = useSettings((s) => s.animationsEnabled);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        if (animationsEnabled) scale.value = withTiming(scaleTo, { duration: 90 });
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 120 });
        onPressOut?.(e);
      }}
      style={[style, animationsEnabled ? animatedStyle : undefined]}
    >
      {children}
    </AnimatedPressable>
  );
}
