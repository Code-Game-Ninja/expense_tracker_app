import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, Tabs } from "expo-router";
import {
  BarChart3,
  LayoutGrid,
  Plus,
  Receipt,
  Settings,
} from "lucide-react-native";
import { Platform, View } from "react-native";
import { PressableScale } from "@/components/PressableScale";
import { useTheme } from "@/theme/ThemeProvider";

/**
 * Custom tab bar: frosted blur background + a raised center "+" button
 * (gradient FAB) that opens the add-expense modal. This central FAB is
 * the signature interaction of the app.
 */
export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accentSoft,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          backgroundColor:
            Platform.OS === "android" ? colors.surface : "transparent",
          height: 84,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              tint={isDark ? "dark" : "light"}
              intensity={40}
              style={{ flex: 1, backgroundColor: colors.bg + "99" }}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color }) => <Receipt size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: () => <AddButton />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/transaction/new");
          },
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

function AddButton() {
  const { colors, gradient } = useTheme();
  return (
    <View className="flex-1 items-center justify-center">
      <PressableScale
        onPress={() => router.push("/transaction/new")}
        scaleTo={0.9}
        className="rounded-full items-center justify-center -mt-2"
        style={{
          width: 56,
          height: 56,
          shadowColor: gradient[1],
          shadowOpacity: 0.5,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={28} color={colors.accentText} strokeWidth={2.5} />
        </LinearGradient>
      </PressableScale>
    </View>
  );
}
