# Expo React Native App — apps/mobile

This is the native iOS (and Android) app inside the EarnHQ Turborepo monorepo.

## Stack
- Expo SDK 56 — read https://docs.expo.dev/versions/v56.0.0/ before writing any code
- Expo Router v4 — file-based navigation (mirrors Next.js App Router conventions)
- NativeWind v4 — Tailwind CSS syntax for React Native
- @supabase/supabase-js — direct client (NOT @supabase/ssr)
- expo-secure-store — session storage (NOT cookies)

## Shared packages available
- `@earnhq/types` — all TypeScript interfaces (Deal, Invoice, Profile, etc.)
- `@earnhq/utils` — formatCurrency, formatDate, getDaysUntil, generateInvoiceNumber
- `@earnhq/db` — Supabase client config (use packages/db/supabase/ for migrations)

## Do NOT
- Use `@supabase/ssr` — it's Node.js/Next.js only
- Use `next/navigation` — use `expo-router` instead
- Use shadcn/ui components — use NativeWind + custom components
- Import from `apps/web/` — only import from `packages/`
