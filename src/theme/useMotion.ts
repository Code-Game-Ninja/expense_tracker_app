import { useSettings } from "@/store/settings";

/**
 * Central motion gate. Every animated component checks `enabled` so the
 * Settings "Animations" toggle can disable entrances, count-ups, chart
 * animations and press-scale app-wide (accessibility / performance).
 *
 * `entering(builder)` returns the Reanimated entering animation when
 * motion is on, or `undefined` (instant, no animation) when off.
 */
export function useMotion() {
  const enabled = useSettings((s) => s.animationsEnabled);
  return {
    enabled,
    entering<T>(builder: T): T | undefined {
      return enabled ? builder : undefined;
    },
  };
}
