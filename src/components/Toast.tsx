import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Check, Info, TriangleAlert } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";

type ToastKind = "success" | "error" | "info";
type ToastState = { id: number; message: string; kind: ToastKind };

type ToastContextValue = {
  show: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Lightweight animated toast. A single toast at a time drops in from the
 * top (Reanimated FadeInUp/FadeOutUp) and auto-dismisses. Fired from
 * anywhere via `useToast().show(...)`.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const show = useCallback((message: string, kind: ToastKind = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message, kind });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const accent =
    toast?.kind === "error"
      ? colors.expense
      : toast?.kind === "info"
        ? colors.accent
        : colors.income;
  const Icon =
    toast?.kind === "error"
      ? TriangleAlert
      : toast?.kind === "info"
        ? Info
        : Check;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          entering={FadeInUp.springify().damping(18)}
          exiting={FadeOutUp.duration(200)}
          pointerEvents="none"
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <View
            className="flex-row items-center rounded-pill px-4 py-3"
            style={{
              backgroundColor: colors.surface2,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}
          >
            <View
              className="items-center justify-center rounded-full mr-3"
              style={{ width: 26, height: 26, backgroundColor: accent + "22" }}
            >
              <Icon size={16} color={accent} strokeWidth={2.5} />
            </View>
            <Text
              className="font-medium flex-1"
              style={{ color: colors.text }}
              numberOfLines={2}
            >
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) return { show: () => {} };
  return ctx;
}
