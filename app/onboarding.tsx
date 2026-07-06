import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChartPie,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientButton } from "@/components/GradientButton";
import { useSettings } from "@/store/settings";
import { useTheme } from "@/theme/ThemeProvider";
import { useMotion } from "@/theme/useMotion";
import type { ThemeColors } from "@/theme/themes";

type TintKey = keyof Pick<ThemeColors, "accent" | "income" | "accentSoft">;

const FEATURES: {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: TintKey;
}[] = [
  {
    icon: Wallet,
    title: "Track every rupee",
    body: "Log expenses and income in seconds with a fast, tactile keypad.",
    tint: "accent",
  },
  {
    icon: ChartPie,
    title: "See where it goes",
    body: "Beautiful breakdowns show your spending by category at a glance.",
    tint: "income",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Everything stays on your device. No account, no cloud, no tracking.",
    tint: "accentSoft",
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { colors, gradient } = useTheme();
  const motion = useMotion();
  const completeOnboarding = useSettings((s) => s.completeOnboarding);

  const start = () => {
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View
      className="flex-1 bg-bg px-6"
      style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }}
    >
      {/* Hero */}
      <Animated.View
        entering={motion.entering(FadeInDown.duration(500))}
        className="items-center"
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 26,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            shadowColor: gradient[1],
            shadowOpacity: 0.5,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 10,
          }}
        >
          <Sparkles size={36} color={colors.accentText} strokeWidth={2} />
        </LinearGradient>
        <Text className="font-display-bold text-text text-3xl text-center">
          Expense Tracker
        </Text>
        <Text className="font-sans text-muted text-[15px] text-center mt-2 leading-6">
          A calmer, clearer way to{"\n"}manage your money.
        </Text>
      </Animated.View>

      {/* Feature list */}
      <View className="mt-12 gap-5">
        {FEATURES.map((f, i) => {
          const tint = colors[f.tint];
          return (
            <Animated.View
              key={f.title}
              entering={motion.entering(
                FadeInUp.delay(200 + i * 120).duration(500)
              )}
              className="flex-row items-center bg-surface rounded-card p-4"
            >
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center"
                style={{ backgroundColor: tint + "22" }}
              >
                <f.icon size={24} color={tint} strokeWidth={2} />
              </View>
              <View className="flex-1 ml-4">
                <Text className="font-semibold text-text text-[16px]">
                  {f.title}
                </Text>
                <Text className="font-sans text-muted text-[13px] mt-0.5 leading-5">
                  {f.body}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* CTA */}
      <Animated.View
        entering={motion.entering(FadeInUp.delay(700).duration(500))}
        className="mt-auto"
      >
        <GradientButton label="Get Started" onPress={start} />
        <Text className="font-sans text-muted text-[12px] text-center mt-4">
          Free · Offline · No sign-up required
        </Text>
      </Animated.View>
    </View>
  );
}
