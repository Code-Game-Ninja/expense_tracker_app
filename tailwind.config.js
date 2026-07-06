/** @type {import('tailwindcss').Config} */
// Colors are driven by CSS variables set at runtime by ThemeProvider
// (`vars()`), so every `bg-*` / `text-*` className re-themes instantly.
// Using `rgb(var(--color-x) / <alpha-value>)` keeps alpha modifiers
// working (e.g. `bg-border/60`).
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: withVar("--color-bg"),
        surface: withVar("--color-surface"),
        surface2: withVar("--color-surface2"),
        border: withVar("--color-border"),
        accent: withVar("--color-accent"),
        "accent-soft": withVar("--color-accent-soft"),
        "accent-text": withVar("--color-accent-text"),
        income: withVar("--color-income"),
        expense: withVar("--color-expense"),
        text: withVar("--color-text"),
        muted: withVar("--color-muted"),
      },
      borderRadius: {
        card: "24px",
        pill: "999px",
      },
      fontFamily: {
        // Display font for money/heroes; Inter for everything else.
        display: ["SpaceGrotesk_600SemiBold"],
        "display-bold": ["SpaceGrotesk_700Bold"],
        sans: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
      },
    },
  },
  plugins: [],
};
