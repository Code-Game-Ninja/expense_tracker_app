import "../global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { migrateDb } from "@/db/schema";
import { useSettings } from "@/store/settings";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";
import { ToastProvider } from "@/components/Toast";
import { colors as defaultColors } from "@/theme/tokens";

SplashScreen.preventAutoHideAsync();

async function initDb(db: SQLiteDatabase) {
  await migrateDb(db);
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: defaultColors.bg }}
    >
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <SQLiteProvider databaseName="expenses.db" onInit={initDb}>
              <ThemedShell />
            </SQLiteProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** Renders inside ThemeProvider so it can read the live palette. */
function ThemedShell() {
  const { colors, isDark } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <OnboardingGate />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="budgets" />
        <Stack.Screen
          name="transaction/new"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="budget/[categoryId]"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </View>
  );
}

/**
 * Redirects to onboarding on first launch and away from it once done.
 * Waits for the persisted settings to hydrate so we don't flash the
 * wrong screen. This is the documented expo-router "protected route"
 * pattern using segments + an effect.
 */
function OnboardingGate() {
  const segments = useSegments();
  const router = useRouter();
  const hydrated = useSettings((s) => s.hydrated);
  const onboarded = useSettings((s) => s.onboarded);

  useEffect(() => {
    if (!hydrated) return;
    const inOnboarding = segments[0] === "onboarding";
    if (!onboarded && !inOnboarding) {
      router.replace("/onboarding");
    } else if (onboarded && inOnboarding) {
      router.replace("/(tabs)");
    }
  }, [hydrated, onboarded, segments, router]);

  return null;
}
