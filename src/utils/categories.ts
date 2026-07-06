/**
 * Default categories. `icon` maps to a lucide-react-native icon name
 * (resolved in components/CategoryBadge.tsx). `color` drives the badge tint.
 */
export type CategoryDef = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const CATEGORIES: CategoryDef[] = [
  { id: "food", name: "Food & Drink", icon: "UtensilsCrossed", color: "#FF6B6B" },
  { id: "transport", name: "Transport", icon: "Car", color: "#4EA8DE" },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", color: "#7C5CFC" },
  { id: "bills", name: "Bills", icon: "ReceiptText", color: "#F4A261" },
  { id: "entertainment", name: "Fun", icon: "Gamepad2", color: "#E76F98" },
  { id: "health", name: "Health", icon: "HeartPulse", color: "#3DDC97" },
  { id: "groceries", name: "Groceries", icon: "ShoppingCart", color: "#95D5B2" },
  { id: "travel", name: "Travel", icon: "Plane", color: "#48CAE4" },
  { id: "income", name: "Income", icon: "Wallet", color: "#3DDC97" },
  { id: "other", name: "Other", icon: "MoreHorizontal", color: "#8A8A94" },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: string): CategoryDef {
  return CATEGORY_MAP.get(id) ?? CATEGORIES[CATEGORIES.length - 1];
}
