<!-- BEGIN:nextjs-agent-rules -->
# Next.js App Router — apps/web

This is the web app inside a Turborepo monorepo. The root is `earnhq/apps/web/`.

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

- Import shared types from `@earnhq/types`
- Import shared utils (formatCurrency, formatDate, getDaysUntil, generateInvoiceNumber) from `@earnhq/utils`
- Import Supabase server client from `@/lib/supabase/server` (uses @supabase/ssr)
- Import Supabase browser client from `@/lib/supabase/client`
- Do NOT use `@supabase/ssr` patterns in the mobile app — that package is Next.js only
<!-- END:nextjs-agent-rules -->
