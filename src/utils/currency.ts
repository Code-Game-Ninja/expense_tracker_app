import { useSettings } from "@/store/settings";

const SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  IDR: "Rp",
};

export function currencySymbol(code: string): string {
  "worklet";
  return SYMBOLS[code] ?? code + " ";
}

/**
 * Format a number as money. Keeps two decimals for most currencies,
 * zero for the ones that conventionally have none.
 *
 * Marked as a worklet so it can also run on the Reanimated UI thread
 * (e.g. inside AmountText's count-up animation). Because the worklet
 * runtime doesn't provide `toLocaleString` with locale options, the
 * thousands grouping is done manually below.
 *
 * INR uses the Indian numbering system (last 3 digits, then pairs):
 * 1234567 -> ₹12,34,567. Other currencies group in threes.
 */
export function formatMoney(amount: number, code = "USD"): string {
  "worklet";
  const noDecimals = code === "JPY" || code === "IDR";
  const abs = Math.abs(amount);

  // Round to the right number of decimals, then split int / fraction.
  const fixed = abs.toFixed(noDecimals ? 0 : 2);
  const dot = fixed.indexOf(".");
  const intPart = dot === -1 ? fixed : fixed.slice(0, dot);
  const fracPart = dot === -1 ? "" : fixed.slice(dot); // includes the "."

  let grouped = "";
  if (code === "INR" && intPart.length > 3) {
    // Indian grouping: keep the last three digits, pair up the rest.
    const last3 = intPart.slice(intPart.length - 3);
    const rest = intPart.slice(0, intPart.length - 3);
    for (let i = 0; i < rest.length; i++) {
      if (i > 0 && (rest.length - i) % 2 === 0) grouped += ",";
      grouped += rest[i];
    }
    grouped += "," + last3;
  } else {
    // Western grouping: a comma every three digits from the right.
    for (let i = 0; i < intPart.length; i++) {
      if (i > 0 && (intPart.length - i) % 3 === 0) grouped += ",";
      grouped += intPart[i];
    }
  }

  const sign = amount < 0 ? "-" : "";
  return `${sign}${currencySymbol(code)}${grouped}${fracPart}`;
}

/** Convenience hook that formats using the user's selected currency. */
export function useFormatMoney() {
  const currency = useSettings((s) => s.currency);
  return (amount: number) => formatMoney(amount, currency);
}
