# GiggyBank Setup Guide

This guide walks you through deploying your own instance of GiggyBank (or any ImpactTreasury project) from scratch.

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
- **A Solana wallet** (e.g. [Phantom](https://phantom.app)) with your project's SPL token
- **A Postgres database** — [Supabase](https://supabase.com), [Neon](https://neon.tech), or self-hosted via Docker
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

## 3. Set Up Database

The app works with any Postgres database. Pick whichever option suits you:

### Option A: Supabase (hosted, free tier)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Settings → Database** and copy the **Connection string (URI)**
3. Add to `.env.local`:

```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

4. Run the schema SQL below in **SQL Editor**

### Option B: Neon (hosted, free tier)

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string from the dashboard
3. Add to `.env.local`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

4. Run the schema SQL below in the **SQL Editor**

### Option C: Self-hosted via Docker

Run on any Linux VPS:

```bash
docker run -d \
  --name yourproject-postgres \
  --restart always \
  -e POSTGRES_DB=yourproject \
  -e POSTGRES_USER=yourproject \
  -e POSTGRES_PASSWORD=your-strong-password \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

Open firewall if needed: `sudo ufw allow 5432`

Add to `.env.local`:

```env
DATABASE_URL=postgresql://yourproject:your-strong-password@your-vps-ip:5432/yourproject
```

### Create the database tables

Run this SQL in your database (via SQL editor, `psql`, or `docker exec`):

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users (tracked by wallet address)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI-generated images
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  prompt TEXT,
  base_prompt TEXT,
  source_url TEXT,
  reference_images TEXT[],
  result_url TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prevents the same Solana transaction from being used twice
CREATE TABLE redeemed_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_signature TEXT UNIQUE NOT NULL,
  wallet TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Default AI prompt (editable without redeploying)
CREATE TABLE default_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL
);

-- Seed a default prompt
INSERT INTO default_prompts (image) VALUES (
  'Generate a high-quality stylized image based on the provided inputs.'
);

-- NFT mint records
CREATE TABLE nft_mints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  generation_id UUID REFERENCES generations(id),
  mint_address TEXT NOT NULL UNIQUE,
  owner_wallet TEXT NOT NULL,
  metadata_uri TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tx_signature TEXT NOT NULL,
  mint_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_nft_mints_owner ON nft_mints(owner_wallet);
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

## 8. NFT Minting Setup (Metaplex)

Each honorary PFP is minted as a real Solana NFT in the **GiggyBank Honoraries** collection using the Metaplex Token Metadata Program.

### Create a creator wallet

Generate a new Solana keypair to use as the NFT creator and collection authority:

```bash
solana-keygen new --outfile creator-keypair.json
solana address -k creator-keypair.json
```

Fund it with ~0.05 SOL for minting transactions. Each NFT mint costs ~0.01 SOL.

Export the private key as Base58 and add it to `.env.local`:

```env
CREATOR_PRIVATE_KEY=your-base58-encoded-private-key
```

### Create the collection NFT

Run the one-time setup script to create the collection NFT on-chain:

```bash
npx ts-node scripts/create-collection.ts
```

> **Tip:** Test on devnet first by setting `SOLANA_RPC_URL=https://api.devnet.solana.com` and funding the creator wallet via `solana airdrop 1 <address> --url devnet`.

Copy the output and add to `.env.local`:

```env
COLLECTION_MINT_ADDRESS=<output-from-script>
```

Once configured, every honorary PFP generation will automatically mint an NFT to the user's wallet.

> **Note:** The `nft_mints` table is already included in the schema SQL from section 3.

---

## 9. Run Locally

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

## 10. Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the project
3. Add all environment variables from `.env.local` to **Settings → Environment Variables**
4. Deploy

The app auto-deploys on every push to `main`.

---

## Complete `.env.local` Reference

```env
# Database (any Postgres)
DATABASE_URL=postgresql://user:password@host:5432/dbname

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

# NFT Minting (Metaplex) — see section 8
CREATOR_PRIVATE_KEY=your-base58-private-key
COLLECTION_MINT_ADDRESS=your-collection-mint-address
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
