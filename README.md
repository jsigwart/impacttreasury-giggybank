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
- **Branded Community Platform** — A polished Next.js app with your project name, colors, logo, and links — ready to deploy
- **Honorary PFP Minting** — Community members pay in your token to mint personalized NFTs that combine their image with your brand, sending tokens directly to your treasury
- **Treasury Transparency Dashboard** — Public visibility into treasury balances, spending, and campaign activity
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
   ├── Branded website
   ├── Honorary PFP minting (pay in your token)
   ├── Treasury dashboard
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
5. **Receive NFT** — Minted directly to the wallet

Tokens paid for mints go straight to your treasury wallet — creating another revenue stream on top of trading fees.

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
```

```bash
npm run dev
```

Setup guides:

- [`docs/GEMINI_SETUP.md`](docs/GEMINI_SETUP.md) — Gemini API key setup
- [`docs/AWS_SETUP.md`](docs/AWS_SETUP.md) — S3 bucket and IAM setup
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Full system architecture

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | TailwindCSS |
| Blockchain | Solana (treasury + NFT minting) |
| Fee Infrastructure | Bags fee-sharing |
| Database | Supabase |
| AI Image Generation | Gemini (`gemini-2.0-flash-exp`) via Nano Banana |
| Image Hosting | AWS S3 |
| Deployment | Vercel |

---

## Reference Deployment: GiggyBank

GiggyBank is the first live deployment of ImpactTreasury, focused on funding high-tip drops for gig workers.

Live site: https://demo.giggybank.app

Token: **$GIGGYBANK** — `GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS`

---

## License

MIT License

This project is open source and can be used to launch branded community platforms with built-in minting and treasury systems.
