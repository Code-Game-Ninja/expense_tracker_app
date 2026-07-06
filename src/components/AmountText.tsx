import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSettings } from "@/store/settings";
import { formatMoney } from "@/utils/currency";

// The `text` animated prop is only supported on TextInput, so the
// count-up variant renders a non-editable, unstyled-as-input TextInput.
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  value: number;
  className?: string;
  /** Animate the number counting up on mount / when value changes. */
  animate?: boolean;
  /** Force a leading + / - sign (useful in transaction rows). */
  signed?: boolean;
  /** Explicit color override (e.g. dark ink on the accent gradient). */
  color?: string;
};

/**
 * The hero money component. Uses the display font and can count up for
 * that premium "value rolling into place" feel.
 */
export function AmountText({
  value,
  className = "",
  animate = false,
  signed = false,
  color,
}: Props) {
  const colorStyle = color ? { color } : undefined;
  const currency = useSettings((s) => s.currency);
  const hideAmounts = useSettings((s) => s.hideAmounts);
  const animationsEnabled = useSettings((s) => s.animationsEnabled);
  const shouldAnimate = animate && animationsEnabled && !hideAmounts;
  const progress = useSharedValue(shouldAnimate ? 0 : value);

  useEffect(() => {
    progress.value = shouldAnimate
      ? withTiming(value, { duration: 700 })
      : value;
  }, [value, shouldAnimate, progress]);

  const animatedProps = useAnimatedProps(() => {
    const n = progress.value;
    const prefix = signed ? (n >= 0 ? "+" : "") : "";
    return { text: prefix + formatMoney(n, currency), defaultValue: "" } as {
      text: string;
      defaultValue: string;
    };
  });

  // Privacy mode: mask every money value with dots.
  if (hideAmounts) {
    return (
      <Text className={`font-display text-text ${className}`} style={colorStyle}>
        ••••••
      </Text>
    );
  }

  if (!shouldAnimate) {
    const prefix = signed ? (value >= 0 ? "+" : "") : "";
    return (
      <Text className={`font-display text-text ${className}`} style={colorStyle}>
        {prefix + formatMoney(value, currency)}
      </Text>
    );
  }

  return (
    <AnimatedTextInput
      className={`font-display text-text ${className}`}
      animatedProps={animatedProps}
      editable={false}
      // Strip default TextInput chrome/padding so it reads as plain text.
      // pointerEvents lives in style (the prop is deprecated on the New Arch).
      style={{ padding: 0, margin: 0, pointerEvents: "none", ...colorStyle }}
      underlineColorAndroid="transparent"
    />
  );
}
