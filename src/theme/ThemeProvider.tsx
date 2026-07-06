import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import { vars } from "nativewind";
import { activeThemeId, useSettings } from "@/store/settings";
import { getTheme, type Theme, type ThemeColors } from "./themes";

type ThemeContextValue = {
  theme: Theme;
  colors: ThemeColors;
  gradient: readonly [string, string];
  isDark: boolean;
  density: "comfortable" | "compact";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** "#0B0B0F" -> "11 11 15" (space-separated RGB channels for `vars()`). */
function hexToChannels(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function cssVars(c: ThemeColors) {
  return vars({
    "--color-bg": hexToChannels(c.bg),
    "--color-surface": hexToChannels(c.surface),
    "--color-surface2": hexToChannels(c.surface2),
    "--color-border": hexToChannels(c.border),
    "--color-accent": hexToChannels(c.accent),
    "--color-accent-soft": hexToChannels(c.accentSoft),
    "--color-accent-text": hexToChannels(c.accentText),
    "--color-income": hexToChannels(c.income),
    "--color-expense": hexToChannels(c.expense),
    "--color-text": hexToChannels(c.text),
    "--color-muted": hexToChannels(c.muted),
  });
}

/**
 * Resolves the active theme from settings + OS scheme, publishes the
 * palette as CSS variables (so every Tailwind color class re-themes),
 * and exposes the same palette to JS via `useTheme()`.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const appearance = useSettings((s) => s.appearance);
  const themeId = useSettings((s) => s.themeId);
  const density = useSettings((s) => s.density);
  const systemScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    const id = activeThemeId(appearance, themeId, systemScheme === "dark");
    const theme = getTheme(id);
    return {
      theme,
      colors: theme.colors,
      gradient: theme.gradient,
      isDark: theme.isDark,
      density,
    };
  }, [appearance, themeId, density, systemScheme]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, cssVars(value.colors)]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback before the provider mounts (should not happen in practice).
    const theme = getTheme("midnight-lime");
    return {
      theme,
      colors: theme.colors,
      gradient: theme.gradient,
      isDark: theme.isDark,
      density: "comfortable",
    };
  }
  return ctx;
}
