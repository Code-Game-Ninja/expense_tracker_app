import * as Haptics from "expo-haptics";
import { Delete } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

/**
 * Custom numeric keypad. Drives amount entry on the add/edit screens —
 * feels far more "app-like" than a raw <TextInput> and lets us add
 * haptics on every press.
 */
export function NumberPad({ onKey }: { onKey: (key: string) => void }) {
  const { colors } = useTheme();
  const press = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onKey(key);
  };

  return (
    <View className="flex-row flex-wrap">
      {KEYS.map((key) => (
        <Pressable
          key={key}
          onPress={() => press(key)}
          className="items-center justify-center active:opacity-50"
          style={{ width: "33.33%", height: 68 }}
        >
          {key === "del" ? (
            <Delete size={26} color={colors.text} strokeWidth={2} />
          ) : (
            <Text className="font-display text-text text-3xl">{key}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

/**
 * Pure reducer for keypad input so the entry logic is testable and
 * shared between the add and edit screens.
 */
export function applyKey(current: string, key: string): string {
  if (key === "del") return current.length <= 1 ? "0" : current.slice(0, -1);
  if (key === ".") return current.includes(".") ? current : current + ".";
  // block a third decimal digit
  if (current.includes(".") && current.split(".")[1].length >= 2) return current;
  if (current === "0") return key === "." ? "0." : key;
  return current + key;
}
