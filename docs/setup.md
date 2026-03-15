# GiggyBank Setup Guide

## Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Vercel](https://vercel.com) account for deployment

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project: **Settings → API**

### 3. Run the database migration

In your Supabase dashboard, open the **SQL Editor** and run the contents of:
```
supabase/migrations/001_initial.sql
```

### 4. Seed sample data (optional but recommended for demo)

In the same SQL Editor, run:
```
supabase/seed.sql
```

### 5. Create admin user

In your Supabase dashboard: **Authentication → Users → Invite User**

Enter your admin email and send the invite. Set a password on first login, or use **Authentication → Users → Edit** to set a password directly.

### 6. Start dev server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Project Config

Edit `src/giggybank.config.ts` to update:
- Project name, tagline, description
- Token symbol + address + Bags.fm URL
- Treasury wallet + Solscan URL
- Social links

All branding is driven from this file.

---

## Deploy to Vercel

### 1. Push to GitHub
```bash
git remote add origin https://github.com/yourusername/giggybank.git
git push -u origin main
```

### 2. Import to Vercel
- Go to [vercel.com](https://vercel.com) → New Project → Import Git Repository
- Select your repo

### 3. Set environment variables in Vercel
Under **Settings → Environment Variables**, add:
```
NEXT_PUBLIC_SUPABASE_URL      = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
```

### 4. Deploy
Click **Deploy**. Vercel will build and deploy automatically.

---

## Admin Panel

Visit `/admin/login` with your Supabase admin credentials.

**Admin workflow:**
1. `/admin/campaigns/new` — create a campaign receipt
2. Fill in title, description, date, category, platform, financials, proof URLs
3. Check **Published** to make it visible on the public site
4. `/admin/treasury` — record treasury balance snapshots

---

## Reusable Framework

To launch a new impact project using this codebase:
1. Fork/clone the repo
2. Edit `src/giggybank.config.ts` with new project details
3. Create a new Supabase project + run migration
4. Deploy to Vercel

No code changes required beyond the config file.
