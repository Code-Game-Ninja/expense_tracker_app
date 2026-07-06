import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryBadge } from "@/components/CategoryBadge";
import { GradientButton } from "@/components/GradientButton";
import { applyKey, NumberPad } from "@/components/NumberPad";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useToast } from "@/components/Toast";
import { deleteBudget, getBudget, setBudget } from "@/db/queries";
import { useSettings } from "@/store/settings";
import { useTheme } from "@/theme/ThemeProvider";
import { CATEGORIES } from "@/utils/categories";
import { currencySymbol } from "@/utils/currency";

// Categories you can budget (income isn't a spending category).
const BUDGETABLE = CATEGORIES.filter((c) => c.id !== "income");

export default function SetBudget() {
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const toast = useToast();
  const currency = useSettings((s) => s.currency);
  const { categoryId: initialId } = useLocalSearchParams<{ categoryId: string }>();

  const [categoryId, setCategoryId] = useState(initialId ?? BUDGETABLE[0].id);
  const [amount, setAmount] = useState("0");
  const [existing, setExisting] = useState(false);

  // Load any existing budget for the chosen category.
  useEffect(() => {
    let active = true;
    getBudget(db, categoryId).then((b) => {
      if (!active) return;
      setAmount(b ? String(b.amount) : "0");
      setExisting(!!b);
    });
    return () => {
      active = false;
    };
  }, [db, categoryId]);

  const numericAmount = parseFloat(amount) || 0;
  const canSave = numericAmount > 0;

  const save = async () => {
    if (!canSave) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setBudget(db, categoryId, numericAmount);
    toast.show("Budget saved");
    router.back();
  };

  const remove = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await deleteBudget(db, categoryId);
    toast.show("Budget removed", "error");
    router.back();
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-5">
        <ScreenHeader
          title="Set Budget"
          leading="close"
          onLeadingPress={() => router.back()}
        />
      </View>

      {/* Amount */}
      <View className="items-center py-8">
        <Text className="font-sans text-muted text-[13px] mb-2">
          Monthly limit
        </Text>
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
      </View>

      {/* Category picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
        className="max-h-24 flex-grow-0"
      >
        {BUDGETABLE.map((cat) => (
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

      {/* Keypad + actions */}
      <View className="mt-auto px-3" style={{ paddingBottom: insets.bottom + 8 }}>
        <NumberPad onKey={(k) => setAmount((a) => applyKey(a, k))} />
        <View className="flex-row items-center gap-3 px-2 mt-1">
          {existing && (
            <Pressable
              onPress={remove}
              className="px-5 h-14 rounded-pill bg-surface items-center justify-center active:opacity-70"
            >
              <Text className="font-semibold text-expense text-[15px]">
                Remove
              </Text>
            </Pressable>
          )}
          <GradientButton
            label="Save Budget"
            onPress={save}
            disabled={!canSave}
            className="flex-1"
          />
        </View>
      </View>
    </View>
  );
}
