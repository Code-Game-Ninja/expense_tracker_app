/**
 * Theme presets. Each theme is a full semantic palette plus a two-stop
 * accent gradient. Colors are consumed two ways:
 *   1. Tailwind classNames (bg-accent, text-text, …) — via CSS variables
 *      wired up in ThemeProvider (`vars()`) + tailwind.config.js.
 *   2. Direct JS `style={{}}` — via the `useTheme()` hook.
 *
 * `accentText` is the ink that sits ON the accent color (buttons, FAB).
 * With light accents (lime/mint) this is near-black, not white.
 */

export type ThemeColors = {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  income: string;
  expense: string;
  text: string;
  muted: string;
};

export type Theme = {
  id: string;
  name: string;
  isDark: boolean;
  colors: ThemeColors;
  /** Two-stop gradient [from, to] for hero cards, primary buttons, bars. */
  gradient: readonly [string, string];
};

export const THEMES: Record<string, Theme> = {
  "midnight-lime": {
    id: "midnight-lime",
    name: "Midnight Lime",
    isDark: true,
    gradient: ["#DCF45E", "#A6E05C"],
    colors: {
      bg: "#0B0B0F",
      surface: "#16161D",
      surface2: "#1F1F29",
      border: "#2A2A36",
      accent: "#C8F135",
      accentSoft: "#A6E05C",
      accentText: "#0B0B0F",
      income: "#3DDC97",
      expense: "#FF6B6B",
      text: "#F5F5F7",
      muted: "#8A8A94",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    isDark: true,
    gradient: ["#22D3EE", "#38BDF8"],
    colors: {
      bg: "#0A0F14",
      surface: "#121A22",
      surface2: "#1A2530",
      border: "#24313D",
      accent: "#38BDF8",
      accentSoft: "#7DD3FC",
      accentText: "#04121A",
      income: "#34D399",
      expense: "#FB7185",
      text: "#EAF2F8",
      muted: "#7C8B99",
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    isDark: true,
    gradient: ["#FB7185", "#FB923C"],
    colors: {
      bg: "#14100F",
      surface: "#201A18",
      surface2: "#2B2321",
      border: "#3A2F2C",
      accent: "#FB923C",
      accentSoft: "#FDBA74",
      accentText: "#1A0F0A",
      income: "#4ADE80",
      expense: "#F87171",
      text: "#F8EFEA",
      muted: "#99897F",
    },
  },
  "light-mint": {
    id: "light-mint",
    name: "Light Mint",
    isDark: false,
    gradient: ["#C4EAD8", "#9FE0C4"],
    colors: {
      bg: "#F4F5F0",
      surface: "#FFFFFF",
      surface2: "#ECEEE8",
      border: "#E2E4DD",
      accent: "#9FE0C4",
      accentSoft: "#B8E6D0",
      accentText: "#0B0B0F",
      income: "#1FB980",
      expense: "#E5484D",
      text: "#14161A",
      muted: "#6B6F76",
    },
  },
};

/** The single light theme (used when appearance resolves to "light"). */
export const LIGHT_THEME_ID = "light-mint";
/** Default dark theme. */
export const DEFAULT_DARK_THEME_ID = "midnight-lime";

/** Themes shown as selectable swatches in Settings, in display order. */
export const THEME_ORDER = [
  "midnight-lime",
  "ocean",
  "sunset",
  "light-mint",
] as const;

export function getTheme(id: string): Theme {
  return THEMES[id] ?? THEMES[DEFAULT_DARK_THEME_ID];
}
