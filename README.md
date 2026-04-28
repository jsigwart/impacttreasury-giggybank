# ImpactTreasury

![Bags Hackathon](https://img.shields.io/badge/Bags-%244M%20Hackathon-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![Bags](https://img.shields.io/badge/Bags-FeeSharing-blue)

**Launch a token on Bags. Earn fees from every trade. Clone this repo. Instantly have a branded community platform with built-in NFT minting.**

ImpactTreasury is a ready-to-deploy framework that gives any token community a full-featured web app — complete with treasury tracking, community culture tools, and an on-chain honorary PFP minting system — powered by Bags fee-sharing on Solana.

---

## What You Get

- **Fee-Funded Treasury** — Every trade of your token on Bags generates fees that flow into your treasury wallet automatically via Bags fee-sharing
- **Honorary PFP Minting** — Community members pay in your token to mint personalized NFTs that combine their image with your brand, sending tokens directly to your treasury
- **Campaign System** — Document and showcase how your community's treasury funds are used in the real world

---

## How It Works

```
Launch Token on Bags
        │
   Every Trade → Fees → Your Treasury Wallet (Solana)
        │
   Clone This Repo → Update Config → Deploy
        │
   Your Community Gets:
   ├── Honorary PFP minting (pay in your token)
   └── Campaign showcase
```

1. **Launch your token** on [Bags](https://bags.fm) with fee-sharing enabled
2. **Clone this repo** and update the config with your token, wallet, and branding
3. **Deploy to Vercel** — your community platform is live
4. **Fees accumulate** in your treasury from every trade
5. **Community members mint** honorary PFPs by paying in your token — those tokens go to your treasury too

---

## One Config File

Everything is driven by a single config file — **`src/giggybank.config.ts`**:

- Project name, tagline, and description
- Token symbol and contract address
- Treasury wallet address
- Social links (Twitter, Telegram, TikTok)
- Mint pricing (USD equivalent) and NFT collection metadata
- Theme accent color

No code changes required. Update the config, add your logo at `public/logo.png`, and deploy.

---

## Honorary PFP Minting

The built-in minting system at `/mint` lets community members create personalized on-chain NFTs:

1. **Connect Wallet** — Solana wallet (Phantom, Solflare, etc.)
2. **Upload Image** — PNG, JPG, or WebP up to 10 MB
3. **Preview** — See the composited image with your project's branded frame
4. **Pay in Your Token** — Price is set in USD, converted to your token amount in real-time via Jupiter
5. **AI Generation** — After payment is confirmed on-chain, the backend generates your honorary PFP
6. **Receive NFT** — Minted directly to the wallet

Tokens paid for mints go straight to your treasury wallet — creating another revenue stream on top of trading fees.

### Payment-Gated API

The `/api/generate` endpoint is gated behind on-chain payment verification. Users must pay with the project token on the mint page before the AI image generation runs. The flow:

1. User pays tokens → receives a Solana transaction signature
2. Frontend sends the signature to `/api/generate`
3. Backend verifies the transaction on-chain:
   - Confirms the transaction exists and succeeded
   - Checks it contains a token transfer to the treasury wallet
   - Ensures the correct token mint was used
   - Prevents replay by tracking redeemed signatures in Postgres (`redeemed_transactions` table)
4. Only after verification does AI generation proceed

This means the generate endpoint cannot be called without a valid, unredeemed payment transaction.

---

## Quick Start

```bash
git clone https://github.com/jsigwart/impacttreasury-giggybank.git
cd impacttreasury-giggybank
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Gemini / Nano Banana (AI Image Generation for PFP compositing)
GEMINI_API_KEY=

# AWS S3 (Image Hosting for generated PFPs)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# Database (any Postgres: Supabase, Neon, self-hosted, etc.)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Solana RPC (optional — defaults to public mainnet-beta)
SOLANA_RPC_URL=
```

```bash
npm run dev
```

Setup guides:

- [`docs/GEMINI_SETUP.md`](docs/GEMINI_SETUP.md) — Gemini API key setup
- [`docs/AWS_SETUP.md`](docs/AWS_SETUP.md) — S3 bucket and IAM setup
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Full system architecture

---

## Reference Deployment: GiggyBank

GiggyBank is the first live deployment of ImpactTreasury, focused on funding high-tip drops for gig workers.

Live site: https://community.giggybank.app

Token: **$GIGGYBANK** — `GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS`

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

---

## License

MIT License

This project is open source and can be used to launch branded community platforms with built-in minting and treasury systems.
