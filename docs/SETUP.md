# GiggyBank Setup Guide

This guide walks you through deploying your own instance of GiggyBank (or any ImpactTreasury project) from scratch.

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
- **A Solana wallet** (e.g. [Phantom](https://phantom.app)) with your project's SPL token
- **A Supabase account** — [supabase.com](https://supabase.com) (free tier works)
- **A Google AI Studio account** — [aistudio.google.com](https://aistudio.google.com) (billing required for image generation)
- **Image hosting** — either AWS S3 or a self-hosted MinIO instance

---

## 1. Clone and Install

```bash
git clone https://github.com/jsigwart/impacttreasury-giggybank.git
cd impacttreasury-giggybank
npm install
```

Copy the environment template:

```bash
cp .env.example .env.local
```

---

## 2. Configure Your Project

Edit `src/giggybank.config.ts` with your project's details:

```typescript
export const config: ProjectConfig = {
  name: 'YourProject',
  tagline: 'Your tagline here.',
  cause: 'your cause description',
  description: 'A longer description of your project.',

  token: {
    symbol: 'YOURTOKEN',
    address: 'YourTokenMintAddress',               // Solana SPL token mint address
    bagsUrl: 'https://bags.fm/YourTokenMintAddress',
    dexScreenerUrl: 'https://dexscreener.com/solana/YourTokenMintAddress',
  },

  treasury: {
    wallet: 'YourTreasuryWalletAddress',            // Solana wallet that receives payments
    solscanUrl: 'https://solscan.io/account/YourTreasuryWalletAddress',
  },

  team: { lockupMonths: 12 },
  theme: { accentColor: '#4ade80' },

  social: {
    twitter: 'https://x.com/yourhandle',
    telegram: '',
    tiktok: '',
  },

  appStoreUrl: '',

  mint: {
    priceUsd: 10,                                   // Price in USD for honorary PFP mint
    collectionName: 'YourProject Honoraries',
    description: 'Description of what minting does.',
  },
}
```

Replace `public/logo.png` with your project's logo image.

---

## 3. Set Up Supabase

### Create a project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users

### Create the database tables

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Users (tracked by wallet address)
create table users (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  created_at timestamptz default now()
);

-- AI-generated images
create table generations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  prompt text,
  base_prompt text,
  source_url text,
  reference_images text[],
  result_url text,
  type text,
  created_at timestamptz default now()
);

-- Prevents the same Solana transaction from being used twice
create table redeemed_transactions (
  id uuid primary key default gen_random_uuid(),
  tx_signature text unique not null,
  wallet text,
  created_at timestamptz default now()
);

-- Default AI prompt (editable without redeploying)
create table default_prompts (
  id uuid primary key default gen_random_uuid(),
  image text not null
);

-- Seed a default prompt
insert into default_prompts (image) values (
  'Generate a high-quality stylized image based on the provided inputs.'
);
```

### Get your API keys

Go to **Settings → API** and copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon (public) key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role (secret) key** → `SUPABASE_SERVICE_ROLE_KEY`

Add them to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 4. Set Up Image Hosting

You have two options: AWS S3 or self-hosted MinIO. Both use the same S3-compatible API.

### Option A: AWS S3

See [docs/AWS_SETUP.md](AWS_SETUP.md) for full instructions.

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Option B: Self-hosted MinIO (free)

MinIO runs on any Linux VPS and provides S3-compatible storage.

**Install MinIO on your VPS:**

```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
sudo mkdir -p /data/minio
```

**Create a systemd service** (`/etc/systemd/system/minio.service`):

```ini
[Unit]
Description=MinIO
After=network.target

[Service]
User=root
Environment=MINIO_ROOT_USER=your-access-key
Environment=MINIO_ROOT_PASSWORD=your-secret-key
ExecStart=/usr/local/bin/minio server /data/minio --console-address :9001
Restart=always

[Install]
WantedBy=multi-user.target
```

**Start it:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio
```

**Open firewall ports:**

```bash
sudo ufw allow 9000   # S3 API
sudo ufw allow 9001   # Web console
```

**Create a public bucket using the MinIO client:**

```bash
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
mc alias set local http://localhost:9000 your-access-key 'your-secret-key'
mc mb local/your-bucket-name
mc anonymous set public local/your-bucket-name
```

**Add to `.env.local`:**

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
S3_ENDPOINT=http://your-vps-ip:9000
S3_PUBLIC_URL=http://your-vps-ip:9000
```

> **Note:** If `S3_ENDPOINT` and `S3_PUBLIC_URL` are not set, the app defaults to standard AWS S3.

---

## 5. Set Up Gemini (AI Image Generation)

See [docs/GEMINI_SETUP.md](GEMINI_SETUP.md) for full instructions.

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → **Create API key**
3. Enable billing at [aistudio.google.com/plan](https://aistudio.google.com/plan) (image generation requires a paid plan)

```env
GEMINI_API_KEY=your-gemini-api-key
```

---

## 6. Set Up Solana RPC

The default public Solana RPC is rate-limited. Get a free dedicated RPC from [Helius](https://helius.dev):

1. Sign up at [helius.dev](https://helius.dev)
2. Create an API key
3. Your RPC URL: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`

```env
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-key
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-key
```

Both variables are needed — `SOLANA_RPC_URL` is used server-side for transaction verification, `NEXT_PUBLIC_SOLANA_RPC_URL` is used client-side for wallet interactions.

---

## 7. Treasury Wallet Setup

Your treasury wallet must have an **Associated Token Account (ATA)** for your SPL token before it can receive payments. If the treasury has never held your token before, send a small amount of your token to the treasury wallet address — this automatically creates the ATA.

You can verify the ATA exists on [solscan.io](https://solscan.io) by searching your treasury wallet address and checking that your token appears under "Token Accounts."

---

## 8. Run Locally

```bash
npm run dev
```

The app starts at `http://localhost:3000`.

**Testing from another device on your network:**

Use `https://your-local-ip:3000/mint` (HTTPS is required for Phantom wallet connections from non-localhost origins):

```bash
npx next dev --experimental-https
```

> **Important:** Don't test the mint flow using the treasury wallet — it sends tokens to itself and the verification will fail. Use a separate wallet.

---

## 9. Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the project
3. Add all environment variables from `.env.local` to **Settings → Environment Variables**
4. Deploy

The app auto-deploys on every push to `main`.

---

## Complete `.env.local` Reference

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI (image generation)
GEMINI_API_KEY=your-gemini-api-key

# S3-compatible image hosting
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Only for self-hosted MinIO (omit for AWS S3)
# S3_ENDPOINT=http://your-vps-ip:9000
# S3_PUBLIC_URL=http://your-vps-ip:9000

# Solana RPC (get from helius.dev)
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-key
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-key
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Module not found: @solana/wallet-adapter-react` | Run `npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets` |
| Phantom wallet stuck on "Connecting..." | Use `https://` (not `http://`) for non-localhost origins |
| "Unable to fetch token price" | Token not listed on Jupiter yet — a fallback price is used automatically |
| "failed to get info about account" / 403 | Set `NEXT_PUBLIC_SOLANA_RPC_URL` to a Helius RPC and restart the server |
| "Transaction does not contain a valid token payment" | Don't test with the treasury wallet; use a separate wallet |
| "No balance changes found" in Phantom | The treasury's token account doesn't exist yet — send tokens to the treasury first |
| Gemini "model not found" | Check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for current model names |
| Gemini "quota exceeded, limit: 0" | Image generation requires billing — enable it at [aistudio.google.com/plan](https://aistudio.google.com/plan) |
| MinIO "Access Denied" | Verify credentials match the `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD` in your service file |
| `bigint: Failed to load bindings` | Harmless warning — pure JS fallback is used, no action needed |
