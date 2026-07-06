import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_DARK_THEME_ID,
  getTheme,
  LIGHT_THEME_ID,
} from "@/theme/themes";

/**
 * App-wide UI settings. Persisted to AsyncStorage so choices survive
 * restarts. Transaction *data* lives in SQLite, not here — keep this
 * store small and about preferences only.
 */
export type Appearance = "system" | "light" | "dark";
export type Density = "comfortable" | "compact";

interface SettingsState {
  currency: string;
  onboarded: boolean;
  /** True once persisted values have loaded — gates the onboarding redirect. */
  hydrated: boolean;

  // --- Appearance / theming ---
  /** Selected DARK theme preset id (midnight-lime | ocean | sunset). */
  themeId: string;
  /** System follows OS; light/dark force a mode. */
  appearance: Appearance;
  density: Density;
  hideAmounts: boolean;
  animationsEnabled: boolean;

  setCurrency: (code: string) => void;
  completeOnboarding: () => void;
  setAppearance: (a: Appearance) => void;
  /** Select a theme swatch; also aligns appearance with its light/dark. */
  selectTheme: (id: string) => void;
  setDensity: (d: Density) => void;
  toggleHideAmounts: () => void;
  setAnimationsEnabled: (v: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      currency: "INR",
      onboarded: false,
      hydrated: false,

      themeId: DEFAULT_DARK_THEME_ID,
      appearance: "dark",
      density: "comfortable",
      hideAmounts: false,
      animationsEnabled: true,

      setCurrency: (code) => set({ currency: code }),
      completeOnboarding: () => set({ onboarded: true }),
      setAppearance: (appearance) => set({ appearance }),
      selectTheme: (id) => {
        const theme = getTheme(id);
        if (theme.isDark) {
          // Remember the chosen dark preset and switch to dark mode.
          set({ themeId: id, appearance: "dark" });
        } else {
          // The single light theme — just flip appearance to light.
          set({ appearance: "light" });
        }
      },
      setDensity: (density) => set({ density }),
      toggleHideAmounts: () => set((s) => ({ hideAmounts: !s.hideAmounts })),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        currency: s.currency,
        onboarded: s.onboarded,
        themeId: s.themeId,
        appearance: s.appearance,
        density: s.density,
        hideAmounts: s.hideAmounts,
        animationsEnabled: s.animationsEnabled,
      }),
      onRehydrateStorage: () => () => {
        // Flip the flag once persisted values are loaded.
        useSettings.setState({ hydrated: true });
      },
    }
  )
);

/** The theme id that Settings should highlight as active. */
export function activeThemeId(
  appearance: Appearance,
  themeId: string,
  systemIsDark: boolean
): string {
  if (appearance === "light") return LIGHT_THEME_ID;
  if (appearance === "dark") return themeId;
  return systemIsDark ? themeId : LIGHT_THEME_ID;
}
