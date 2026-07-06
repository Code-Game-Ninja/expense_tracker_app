/**
 * Design tokens. Colors here are the STATIC DEFAULT (Midnight Lime) —
 * a fallback for module-scope contexts that can't call hooks. Live,
 * theme-aware colors come from `useTheme()` (see ThemeProvider). Fonts,
 * radii and spacing are theme-independent and used directly.
 */
import { THEMES } from "./themes";

export const colors = {
  ...THEMES["midnight-lime"].colors,
} as const;

export const radius = {
  card: 24,
  pill: 999,
} as const;

export const spacing = {
  screen: 20,
} as const;

export const font = {
  display: "SpaceGrotesk_600SemiBold",
  displayBold: "SpaceGrotesk_700Bold",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
} as const;
