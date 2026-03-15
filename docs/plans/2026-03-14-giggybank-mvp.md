# GiggyBank MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished Bags-powered transparency and proof-of-impact system for gig-worker support campaigns.

**Architecture:** Next.js 14 App Router with Supabase (Postgres + Auth). Public pages are server components that query Supabase directly. Admin forms are client components calling protected API routes. Middleware guards all `/admin/*` and `/api/admin/*` routes via Supabase session cookie.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase (@supabase/ssr), Vercel, lucide-react, date-fns, clsx + tailwind-merge

---

## Design

### Data Model
- `campaigns` — each row is one receipt/proof event (slug, title, description, date, category, platform, subtotal, tip, total, treasury_tx, receipt_image_url, social_post_url, notes, published)
- `treasury_snapshots` — manual point-in-time treasury balance records

### Stats
- `campaignCount` = count of published campaigns
- `totalSpent` = sum(total)
- `totalTipped` = sum(tip)
- `totalSubtotal` = sum(subtotal)
- `latestTreasuryBalance` = latest treasury snapshot balance_usd
- `treasuryDisbursed` = sum(total)

### Proof Expandability
`CampaignProofs` component accepts `ProofItem[]`. Parent derives items from `receipt_image_url` and `social_post_url`. Adding multi-image support = adding more `ProofItem` objects to the array. No component refactor needed.

### Auth
Single admin user via Supabase email/password. Middleware reads session cookie and protects admin routes/APIs.

### Config
`src/giggybank.config.ts` exports typed `ProjectConfig`. All branding, token, treasury, social links read from config. Fork + edit config = new impact project.

---

## File Map

```
giggybank/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── middleware.ts
├── .env.local.example
├── src/
│   ├── giggybank.config.ts
│   ├── types/index.ts
│   ├── lib/supabase/{client,server}.ts
│   ├── lib/utils.ts
│   ├── app/
│   │   ├── globals.css + layout.tsx
│   │   ├── page.tsx                      # Landing
│   │   ├── dashboard/page.tsx            # Public dashboard
│   │   ├── campaigns/page.tsx            # Campaign index
│   │   ├── campaigns/[slug]/page.tsx     # Proof page
│   │   ├── admin/{login,dashboard,campaigns,treasury}
│   │   └── api/{campaigns,stats,treasury,admin/*}
│   └── components/{layout,dashboard,campaigns,admin}/
├── supabase/migrations/001_initial.sql
├── supabase/seed.sql
└── docs/setup.md
```

---

## Tasks

### Task 1: Root Config Files
**Files:** `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.env.local.example`, `middleware.ts`

**Step 1:** Write all root config files (see implementation below)
**Step 2:** `npm install`
**Step 3:** Commit — `feat: scaffold Next.js project with Tailwind + Supabase`

### Task 2: Types + App Config
**Files:** `src/types/index.ts`, `src/giggybank.config.ts`

**Step 1:** Write shared TypeScript interfaces (Campaign, TreasurySnapshot, Stats, ProofItem, ProjectConfig)
**Step 2:** Write giggybank.config.ts with placeholder token/treasury addresses
**Step 3:** Commit — `feat: add types and project config`

### Task 3: Database
**Files:** `supabase/migrations/001_initial.sql`, `supabase/seed.sql`

**Step 1:** Write migration (campaigns + treasury_snapshots + RLS)
**Step 2:** Write seed (3 sample campaigns + 1 treasury snapshot)
**Step 3:** Run migration in Supabase dashboard SQL editor
**Step 4:** Run seed in Supabase dashboard SQL editor
**Step 5:** Commit — `feat: add database schema and seed data`

### Task 4: Core Utilities
**Files:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/utils.ts`

**Step 1:** Write Supabase browser client (createBrowserClient)
**Step 2:** Write Supabase server client (createServerClient + cookies)
**Step 3:** Write utils (cn, formatCurrency, formatDate, generateSlug)
**Step 4:** Commit — `feat: add supabase clients and utilities`

### Task 5: App Shell
**Files:** `src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`

**Step 1:** Write globals.css (dark theme base)
**Step 2:** Write root layout with Inter font
**Step 3:** Write SiteHeader (config-driven nav)
**Step 4:** Write SiteFooter (config-driven links)
**Step 5:** Commit — `feat: add app shell and layout components`

### Task 6: Dashboard Components
**Files:** `src/components/dashboard/TreasuryCard.tsx`, `src/components/dashboard/ImpactStats.tsx`

### Task 7: Campaign Components
**Files:** `src/components/campaigns/CampaignCard.tsx`, `src/components/campaigns/CampaignGrid.tsx`, `src/components/campaigns/CampaignProofs.tsx`

### Task 8: Public API Routes
**Files:** `/api/campaigns/route.ts`, `/api/campaigns/[slug]/route.ts`, `/api/stats/route.ts`, `/api/treasury/route.ts`

### Task 9: Public Pages
**Files:** `app/page.tsx`, `app/dashboard/page.tsx`, `app/campaigns/page.tsx`, `app/campaigns/[slug]/page.tsx`

### Task 10: Admin Components
**Files:** `src/components/layout/AdminShell.tsx`, `src/components/admin/CampaignForm.tsx`, `src/components/admin/TreasurySnapshotForm.tsx`

### Task 11: Admin API Routes
**Files:** `/api/admin/campaigns/route.ts`, `/api/admin/campaigns/[id]/route.ts`, `/api/admin/treasury/snapshot/route.ts`

### Task 12: Admin Pages
**Files:** `admin/login/page.tsx`, `admin/dashboard/page.tsx`, `admin/campaigns/page.tsx`, `admin/campaigns/new/page.tsx`, `admin/campaigns/[id]/page.tsx`, `admin/treasury/page.tsx`, `admin/layout.tsx`

### Task 13: Setup Docs + Seed + Deploy
**Files:** `docs/setup.md`
**Steps:** Verify local dev works, deploy to Vercel, confirm env vars, smoke test

---

## Setup Commands (Quick Reference)
```bash
npm install
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```
