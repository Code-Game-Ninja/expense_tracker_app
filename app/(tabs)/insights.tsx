import { useState } from "react";
import { Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AmountText } from "@/components/AmountText";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { useMonthData } from "@/hooks/useMonthData";
import { useTheme } from "@/theme/ThemeProvider";
import { useMotion } from "@/theme/useMotion";
import { getCategory } from "@/utils/categories";
import { currentMonthKey, monthLabel } from "@/utils/date";

export default function Insights() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const motion = useMotion();
  const [month] = useState(currentMonthKey());
  const { breakdown, summary } = useMonthData(month);

  const pieData = breakdown.map((b) => ({
    value: b.total,
    color: getCategory(b.categoryId).color,
    focused: false,
  }));

  // Top categories as bars for the "Financial report" chart.
  const barData = breakdown.slice(0, 6).map((b) => {
    const cat = getCategory(b.categoryId);
    return {
      value: b.total,
      frontColor: cat.color,
      label: cat.name.split(" ")[0],
      labelTextStyle: { color: colors.muted, fontSize: 10 },
    };
  });

  const hasData = breakdown.length > 0;
  const enter = (i: number) =>
    motion.entering(FadeInDown.delay(60 * i).springify().damping(18));

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
      <Text className="font-display-bold text-text text-2xl">Insights</Text>
      <Text className="font-sans text-muted text-[14px] mb-5">
        {monthLabel(month)}
      </Text>

      {!hasData ? (
        <Card>
          <EmptyState
            title="No spending yet"
            subtitle="Your category breakdown will appear here once you log expenses."
          />
        </Card>
      ) : (
        <>
          {/* Financial report — bar chart */}
          <Animated.View entering={enter(0)}>
            <Card elevated>
              <Text className="font-display text-text text-base mb-1">
                Financial report
              </Text>
              <Text className="font-sans text-muted text-[12px] mb-4">
                Top spending categories
              </Text>
              <BarChart
                data={barData}
                barWidth={22}
                spacing={20}
                barBorderRadius={7}
                frontColor={colors.accent}
                yAxisThickness={0}
                xAxisThickness={0}
                hideYAxisText
                hideRules
                isAnimated={motion.enabled}
                animationDuration={800}
                initialSpacing={12}
                height={150}
              />
            </Card>
          </Animated.View>

          {/* Donut */}
          <Animated.View entering={enter(1)}>
            <Card elevated className="items-center mt-5">
              <PieChart
                data={pieData}
                donut
                radius={110}
                innerRadius={72}
                innerCircleColor={colors.surface2}
                isAnimated={motion.enabled}
                centerLabelComponent={() => (
                  <View className="items-center">
                    <Text className="font-sans text-muted text-[12px]">
                      Spent
                    </Text>
                    <AmountText
                      value={summary.expense}
                      className="text-xl text-text"
                    />
                  </View>
                )}
              />
            </Card>
          </Animated.View>

          {/* Legend / per-category list */}
          <Animated.View entering={enter(2)}>
            <Card className="mt-5 py-2">
              {breakdown.map((b, i) => {
                const cat = getCategory(b.categoryId);
                const pct =
                  summary.expense > 0
                    ? Math.round((b.total / summary.expense) * 100)
                    : 0;
                return (
                  <View key={b.categoryId}>
                    {i > 0 && <View className="h-px bg-border/60" />}
                    <View className="flex-row items-center py-3">
                      <View
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <Text className="flex-1 ml-3 font-semibold text-text text-[15px]">
                        {cat.name}
                      </Text>
                      <Text className="font-sans text-muted text-[13px] mr-3">
                        {pct}%
                      </Text>
                      <AmountText
                        value={b.total}
                        className="text-[15px] text-text"
                      />
                    </View>
                  </View>
                );
              })}
            </Card>
          </Animated.View>
        </>
      )}
    </ScrollView>
  );
}
