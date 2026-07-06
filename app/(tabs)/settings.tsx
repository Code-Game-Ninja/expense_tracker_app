import { type ReactNode, useState } from "react";
import {
  Check,
  Coins,
  Eye,
  Palette,
  Smartphone,
  Sparkles,
  SunMoon,
  Trash2,
} from "lucide-react-native";
import { Pressable, Switch, Text, View, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import * as Haptics from "expo-haptics";
import { Card } from "@/components/Card";
import { PressableScale } from "@/components/PressableScale";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";
import {
  type Appearance,
  type Density,
  useSettings,
} from "@/store/settings";
import { useTheme } from "@/theme/ThemeProvider";
import { getTheme, THEME_ORDER } from "@/theme/themes";
import { currencySymbol } from "@/utils/currency";
import { clearAllData } from "@/db/queries";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY", "IDR"];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();
  const db = useSQLiteContext();
  const toast = useToast();
  const [showClearModal, setShowClearModal] = useState(false);

  const currency = useSettings((s) => s.currency);
  const setCurrency = useSettings((s) => s.setCurrency);
  const appearance = useSettings((s) => s.appearance);
  const setAppearance = useSettings((s) => s.setAppearance);
  const selectTheme = useSettings((s) => s.selectTheme);
  const density = useSettings((s) => s.density);
  const setDensity = useSettings((s) => s.setDensity);
  const hideAmounts = useSettings((s) => s.hideAmounts);
  const toggleHideAmounts = useSettings((s) => s.toggleHideAmounts);
  const animationsEnabled = useSettings((s) => s.animationsEnabled);
  const setAnimationsEnabled = useSettings((s) => s.setAnimationsEnabled);

  const handleClearAllData = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await clearAllData(db);
      setShowClearModal(false);
      toast.show("All data cleared successfully", "success");
    } catch (error) {
      console.error("Failed to clear data:", error);
      toast.show("Failed to clear data", "error");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="font-display-bold text-text text-2xl mb-5">Settings</Text>

      {/* Appearance */}
      <SectionLabel icon={<SunMoon size={18} color={colors.muted} />}>
        Appearance
      </SectionLabel>
      <Segmented<Appearance>
        value={appearance}
        onChange={setAppearance}
        options={[
          { value: "system", label: "System" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />

      {/* Theme presets */}
      <SectionLabel icon={<Palette size={18} color={colors.muted} />}>
        Theme
      </SectionLabel>
      <View className="flex-row flex-wrap gap-3">
        {THEME_ORDER.map((id) => {
          const t = getTheme(id);
          const active = t.id === theme.id;
          return (
            <PressableScale
              key={id}
              onPress={() => selectTheme(id)}
              scaleTo={0.95}
              style={{ width: "47%" }}
            >
              <View
                className="rounded-card p-3"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 2,
                  borderColor: active ? colors.accent : "transparent",
                }}
              >
                <LinearGradient
                  colors={t.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ height: 46, borderRadius: 14 }}
                />
                <View className="flex-row items-center justify-between mt-2.5">
                  <Text className="font-medium text-text text-[13px]">
                    {t.name}
                  </Text>
                  {active && <Check size={16} color={colors.accent} />}
                </View>
              </View>
            </PressableScale>
          );
        })}
      </View>

      {/* Display density */}
      <SectionLabel icon={<Smartphone size={18} color={colors.muted} />}>
        Display density
      </SectionLabel>
      <Segmented<Density>
        value={density}
        onChange={setDensity}
        options={[
          { value: "comfortable", label: "Comfortable" },
          { value: "compact", label: "Compact" },
        ]}
      />

      {/* Toggles */}
      <SectionLabel icon={<Sparkles size={18} color={colors.muted} />}>
        Preferences
      </SectionLabel>
      <Card className="py-1">
        <ToggleRow
          icon={<Eye size={18} color={colors.accentSoft} />}
          label="Hide amounts"
          hint="Mask money values for privacy"
          value={hideAmounts}
          onValueChange={toggleHideAmounts}
        />
        <View className="h-px bg-border/60" />
        <ToggleRow
          icon={<Sparkles size={18} color={colors.accentSoft} />}
          label="Animations"
          hint="Motion, count-ups and transitions"
          value={animationsEnabled}
          onValueChange={setAnimationsEnabled}
        />
      </Card>

      {/* Currency */}
      <SectionLabel icon={<Coins size={18} color={colors.muted} />}>
        Currency
      </SectionLabel>
      <Card className="py-2">
        {CURRENCIES.map((code, i) => {
          const active = code === currency;
          return (
            <View key={code}>
              {i > 0 && <View className="h-px bg-border/60" />}
              <Pressable
                onPress={() => setCurrency(code)}
                className="flex-row items-center py-3.5 active:opacity-60"
              >
                <View className="w-9 h-9 rounded-full bg-surface2 items-center justify-center">
                  <Text className="font-display text-text">
                    {currencySymbol(code).trim()}
                  </Text>
                </View>
                <Text className="flex-1 ml-3 font-semibold text-text text-[15px]">
                  {code}
                </Text>
                {active && <Check size={20} color={colors.accent} />}
              </Pressable>
            </View>
          );
        })}
      </Card>

      <Text className="font-sans text-muted text-[12px] text-center mt-8">
        Expense Tracker · v1.0.0{"\n"}All data stored locally on this device.
      </Text>

      {/* Data Management Section */}
      <SectionLabel icon={<Trash2 size={18} color={colors.muted} />}>
        Data Management
      </SectionLabel>
      <Card className="p-0 overflow-hidden">
        <Pressable
          onPress={() => setShowClearModal(true)}
          className="flex-row items-center py-4 px-4 active:opacity-60"
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.expense + "20" }}
          >
            <Trash2 size={20} color={colors.expense} />
          </View>
          <View className="flex-1 ml-3">
            <Text className="font-semibold text-[15px]" style={{ color: colors.expense }}>
              Clear All Data
            </Text>
            <Text className="font-sans text-muted text-[12px] mt-0.5">
              Delete all transactions and budgets
            </Text>
          </View>
        </Pressable>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={showClearModal}
        title="Clear All Data?"
        message="This will permanently delete all your transactions and budgets. This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
        destructive
        onConfirm={handleClearAllData}
        onCancel={() => setShowClearModal(false)}
      />
    </ScrollView>
  );
}

function SectionLabel({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <View className="flex-row items-center mb-3 mt-7">
      {icon}
      <Text className="font-medium text-muted text-[13px] uppercase tracking-wider ml-2">
        {children}
      </Text>
    </View>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const { colors, gradient } = useTheme();
  return (
    <View
      className="flex-row rounded-pill p-1"
      style={{ backgroundColor: colors.surface }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className="flex-1 items-center justify-center rounded-pill overflow-hidden"
            style={{ height: 40 }}
          >
            {active && (
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
              />
            )}
            <Text
              className="font-medium text-[13px]"
              style={{ color: active ? colors.accentText : colors.muted }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onValueChange,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center py-3">
      <View
        className="w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.accentSoft + "22" }}
      >
        {icon}
      </View>
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-text text-[15px]">{label}</Text>
        <Text className="font-sans text-muted text-[12px]">{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surface2, true: colors.accent }}
        thumbColor={colors.text}
      />
    </View>
  );
}
