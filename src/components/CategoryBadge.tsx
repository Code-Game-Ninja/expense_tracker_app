import { icons } from "lucide-react-native";
import { View } from "react-native";
import { getCategory } from "@/utils/categories";

/**
 * Round tinted badge showing a category's lucide icon. The tint is a
 * low-opacity wash of the category color with a full-color glyph.
 */
export function CategoryBadge({
  categoryId,
  size = 44,
}: {
  categoryId: string;
  size?: number;
}) {
  const cat = getCategory(categoryId);
  const LucideIcon = icons[cat.icon as keyof typeof icons] ?? icons.Circle;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: cat.color + "22", // ~13% opacity wash
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LucideIcon size={size * 0.45} color={cat.color} strokeWidth={2} />
    </View>
  );
}
