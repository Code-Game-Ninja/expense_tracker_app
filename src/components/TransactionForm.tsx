import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import type { NewTransaction, TxType } from "@/db/types";
import { useSettings } from "@/store/settings";
import { useTheme } from "@/theme/ThemeProvider";
import { useMotion } from "@/theme/useMotion";
import { CATEGORIES } from "@/utils/categories";
import { currencySymbol } from "@/utils/currency";
import { GradientButton } from "./GradientButton";
import { CategoryBadge } from "./CategoryBadge";
import { ScreenHeader } from "./ScreenHeader";
import { applyKey, NumberPad } from "./NumberPad";
import { useToast } from "./Toast";

const TYPES: { key: TxType; label: string }[] = [
  { key: "expense", label: "Expense" },
  { key: "income", label: "Income" },
];

/**
 * Shared add/edit form. The amount is driven by the custom NumberPad;
 * category is a horizontal pill picker; note is optional. `onSubmit`
 * receives a clean NewTransaction and the parent handles DB writes.
 */
export function TransactionForm({
  title,
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  title: string;
  initial?: Partial<NewTransaction>;
  submitLabel: string;
  onSubmit: (tx: NewTransaction) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const motion = useMotion();
  const toast = useToast();
  const currency = useSettings((s) => s.currency);

  const [amount, setAmount] = useState(
    initial?.amount ? String(initial.amount) : "0"
  );
  const [type, setType] = useState<TxType>(initial?.type ?? "expense");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? CATEGORIES[0].id
  );
  const [note, setNote] = useState(initial?.note ?? "");
  const [saving, setSaving] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const canSave = numericAmount > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await onSubmit({
      amount: numericAmount,
      type,
      categoryId,
      note: note.trim() || null,
      date: initial?.date ?? new Date().toISOString(),
    });
    toast.show("Transaction saved");
    router.back();
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-5">
        <ScreenHeader
          title={title}
          leading="close"
          onLeadingPress={() => router.back()}
        />
      </View>

      <Animated.View entering={motion.entering(FadeInUp.duration(350))}>
        {/* Amount display */}
        <View className="items-center py-5">
          <View className="flex-row items-start">
            <Text className="font-display text-muted text-2xl mt-2 mr-1">
              {currencySymbol(currency).trim()}
            </Text>
            <Text
              className="font-display-bold"
              style={{
                fontSize: 56,
                color: numericAmount > 0 ? colors.text : colors.muted,
              }}
            >
              {amount}
            </Text>
          </View>

          {/* Type toggle */}
          <View className="flex-row bg-surface rounded-pill p-1 mt-4">
            {TYPES.map((t) => (
              <Pressable
                key={t.key}
                onPress={() => setType(t.key)}
                className={`px-6 py-2 rounded-pill ${type === t.key ? "bg-accent" : ""}`}
              >
                <Text
                  className="font-semibold text-[14px]"
                  style={{
                    color: type === t.key ? colors.accentText : colors.muted,
                  }}
                >
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Category picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
        className="max-h-24 flex-grow-0"
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setCategoryId(cat.id)}
            className="items-center"
            style={{ opacity: categoryId === cat.id ? 1 : 0.5 }}
          >
            <View
              style={{
                borderWidth: 2,
                borderColor: categoryId === cat.id ? cat.color : "transparent",
                borderRadius: 999,
                padding: 2,
              }}
            >
              <CategoryBadge categoryId={cat.id} size={46} />
            </View>
            <Text className="font-sans text-muted text-[11px] mt-1.5">
              {cat.name.split(" ")[0]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Note */}
      <View className="px-5 mt-3">
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Add a note (optional)"
          placeholderTextColor={colors.muted}
          className="bg-surface rounded-2xl px-4 py-3.5 font-sans text-text"
        />
      </View>

      {/* Number pad + actions pinned to bottom */}
      <View className="mt-auto px-3" style={{ paddingBottom: insets.bottom + 8 }}>
        <NumberPad onKey={(k) => setAmount((a) => applyKey(a, k))} />

        <View className="flex-row items-center gap-3 px-2 mt-1">
          {onDelete && (
            <Pressable
              onPress={async () => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Warning
                );
                await onDelete();
                toast.show("Transaction deleted", "error");
                router.back();
              }}
              className="px-5 h-14 rounded-pill bg-surface items-center justify-center active:opacity-70"
            >
              <Text className="font-semibold text-expense text-[15px]">
                Delete
              </Text>
            </Pressable>
          )}
          <GradientButton
            label={submitLabel}
            onPress={handleSave}
            disabled={!canSave}
            className="flex-1"
          />
        </View>
      </View>
    </View>
  );
}
