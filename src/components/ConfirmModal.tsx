import { Modal, Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { AlertTriangle } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmModalProps) {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <BlurView
        intensity={isDark ? 40 : 20}
        tint={isDark ? "dark" : "light"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Pressable
          onPress={onCancel}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        />

        <View
          className="mx-5 rounded-2xl p-5 w-[85%]"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* Icon */}
          <View
            className="w-14 h-14 rounded-full items-center justify-center mb-4 self-center"
            style={{
              backgroundColor: destructive
                ? colors.expense + "20"
                : colors.accent + "20",
            }}
          >
            <AlertTriangle
              size={28}
              color={destructive ? colors.expense : colors.accent}
            />
          </View>

          {/* Title */}
          <Text
            className="font-display-bold text-center text-xl mb-2"
            style={{ color: colors.text }}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            className="font-sans text-center text-[14px] mb-6"
            style={{ color: colors.muted }}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={onCancel}
              className="flex-1 h-12 rounded-pill items-center justify-center active:opacity-70"
              style={{ backgroundColor: colors.surface2 }}
            >
              <Text
                className="font-semibold text-[15px]"
                style={{ color: colors.text }}
              >
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 h-12 rounded-pill items-center justify-center active:opacity-70"
              style={{
                backgroundColor: destructive ? colors.expense : colors.accent,
              }}
            >
              <Text
                className="font-semibold text-[15px]"
                style={{
                  color: destructive ? "#fff" : colors.accentText,
                }}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
