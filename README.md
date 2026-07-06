# 💸 Expense Tracker

A sleek, premium expense tracker built with **Expo (React Native)**, TypeScript,
Expo Router, SQLite (local-only), Zustand, and NativeWind.

Dark-first design system, custom number-pad entry, animated balance,
haptics, and a category breakdown chart.

---

## ✨ Features

- **Onboarding** — animated first-launch intro; shown once, then gated away
- **Dashboard** — animated monthly balance, income/expense split, quick actions, recent activity
- **Add / edit transactions** — custom number pad, category picker, notes, haptics
- **Transactions** — month switcher, day-grouped list, **swipe-to-delete**
- **Budgets** — per-category monthly limits with animated progress bars + over-budget states
- **Insights** — donut chart + per-category breakdown with percentages
- **Settings** — currency picker, persisted across restarts
- **Demo data** — realistic sample transactions + budgets seeded on first launch
- **100% local** — all data lives in on-device SQLite; no account, works offline

---

## 🚀 Getting started

### 1. Install dependencies

```bash
cd expense-tracker
npm install
```

> The versions in `package.json` target **Expo SDK 52**. If you see version
> warnings, align the native packages automatically:
>
> ```bash
> npx expo install --fix
> ```

### 2. Run it

**Option A — Expo Go (fastest to preview)**

```bash
npx expo start
```

Scan the QR code with the Expo Go app. Everything here works in Expo Go
*except* effects that need native modules later (biometrics, notifications).

**Option B — Development build (recommended, what you chose)**

A dev build removes all native limits and is the right target for a premium app.

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android   # or ios
```

Install the resulting build on your device once, then:

```bash
npx expo start --dev-client
```

You get the same fast reload as Expo Go, with no feature ceiling.

---

## 🗂 Project structure

```
app/                      # Expo Router (file-based routes)
  _layout.tsx             # root: fonts, SQLite provider, migrate+seed, onboarding gate
  onboarding.tsx          # First-launch intro
  budgets.tsx             # Budgets overview + progress bars
  (tabs)/
    _layout.tsx           # frosted tab bar + raised center "+" FAB
    index.tsx             # Dashboard + quick actions
    transactions.tsx      # Month list, day-grouped, swipe-to-delete
    insights.tsx          # Donut chart + breakdown
    settings.tsx          # Currency picker
    add.tsx               # Placeholder slot (opens the add modal)
  transaction/
    new.tsx               # Add modal
    [id].tsx              # Edit modal
  budget/
    [categoryId].tsx      # Set-budget modal (reuses the number pad)

src/
  db/        schema.ts (migrations) · queries.ts (typed CRUD) · seed.ts · types.ts
  store/     settings.ts (Zustand + AsyncStorage: currency + onboarded)
  hooks/     useMonthData.ts (loads + auto-refreshes on focus)
  components/ Card, AmountText, CategoryBadge, TransactionRow, NumberPad,
              BalanceHeader, TransactionForm, ProgressBar, Skeleton, EmptyState
  theme/     tokens.ts (JS mirror of the Tailwind design tokens)
  utils/     currency.ts · date.ts · categories.ts

tailwind.config.js        # design tokens (colors, radius, fonts)
```

## 🎨 Design system

All design decisions live as tokens in `tailwind.config.js` (and mirrored in
`src/theme/tokens.ts` for JS-only spots like charts):

- **Palette** — near-black base (`#0B0B0F`), layered surfaces, one violet accent
- **Type** — Space Grotesk (display / money) + Inter (body), via Google Fonts
- **Feel** — animated count-up amounts, haptics on every action, soft shadows,
  frosted tab bar, skeleton loaders, spring modal transitions

## 🗄 Data model

```
transactions ( id, amount, type['expense'|'income'],
               categoryId, note, date, createdAt )
```

Amounts are stored **positive**; `type` gives the sign. Monthly queries filter
on `substr(date,1,7) = 'YYYY-MM'` and aggregate with `SUM` / `GROUP BY`.

To reset the DB during development, just delete/reinstall the app on the device.

---

## 🧭 Suggested next steps (Phase 2+)

- Budgets per category with progress bars
- Recurring transactions + reminders (`expo-notifications` — needs dev build)
- Biometric app lock (`expo-local-authentication` — needs dev build)
- CSV export / cloud backup (Supabase)
- Onboarding screen on first launch

---

Built with ❤️ using Expo + NativeWind.
