# ImpactTreasury – GiggyBank

![GiggyBank Demo](docs/demo.png)

![Bags Hackathon](https://img.shields.io/badge/Bags-%244M%20Hackathon-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![Bags](https://img.shields.io/badge/Bags-FeeSharing-blue)

**GiggyBank is the first live deployment of ImpactTreasury**, a reusable framework for turning token trading fees into transparent real-world impact campaigns.

Built on **Bags fee-sharing**, GiggyBank routes token trading activity into a community treasury that funds publicly verifiable impact drops.

These drops take two forms:

- **High-Tip Drops** — large surprise tips for gig workers
- **Cause Drops** — deliveries supporting real organizations such as shelters, rescues, and food banks

Every campaign includes financial breakdowns, delivery receipts, and treasury transactions — ensuring every action funded by the community is **visible, documented, and verifiable**.

---

## Why this matters

Token communities generate millions in trading fees but rarely translate that value into visible real-world impact.

ImpactTreasury turns token activity into **documented public-good campaigns** with full transparency:

- the treasury funds used
- the real-world action taken
- receipts and proof
- the on-chain transaction

---

## What is ImpactTreasury?

ImpactTreasury is the underlying framework powering GiggyBank.

It provides a reusable architecture that allows any token community to fund and document real-world impact campaigns with full transparency. The framework also lets users **mint Honoraries** — on-chain NFTs that combine the user's own image (their IP) with the project's branded token imagery (the token's IP), creating personalized collectibles that represent both individual identity and community membership. Projects can fork this repository, configure their treasury and branding, and launch their own impact system with built-in honorary minting.

---

## Demo

Live site: https://demo.giggybank.app

Token: **GIGGYBANK**

Contract Address: `GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS`

---

## Built With

- **Bags** — token launch and fee-sharing infrastructure
- **Solana** — treasury transactions and NFT minting
- **Next.js 16** — application framework
- **Gemini (Nano Banana)** — AI image generation for PFP compositing
- **AWS S3** — image hosting for generated PFPs
- **Vercel** — deployment platform

---

## How High-Tip Drops Work

GiggyBank places a **real order on an existing gig platform** (DoorDash, Instacart, Lyft, etc.) with an outsized tip funded by the treasury.

The **platform determines which worker receives the job** — GiggyBank does not choose the worker.

Whoever accepts and completes the order receives the full surprise tip. GiggyBank funds the tip — **not the assignment**.

This ensures High-Tip Drops function as genuine surprise bonuses for workers inside existing gig marketplaces. Because worker assignment is handled by the platform, High-Tip Drops function as genuine surprise bonuses for the workers who receive them.

---

## Honorary PFP Minting

GiggyBank features an on-chain **Honorary PFP Mint** page at `/mint`, allowing community members to create personalized profile pictures that combine their uploaded image with the GiggyBank brand.

### How it works

1. **Connect Wallet** — Connect a Solana wallet (Phantom, Solflare, etc.)
2. **Upload Image** — Upload any image (PNG, JPG, WebP up to 10 MB)
3. **Preview** — See your image composited with the GiggyBank branded frame
4. **Pay with $GIGGYBANK** — Pay the equivalent of $10 USD in `$GIGGYBANK` tokens (price fetched live from Jupiter) — tokens are sent to the GiggyBank treasury wallet
5. **Receive NFT** — Your unique honorary PFP is minted as an NFT directly to your Solana wallet

### Mint Configuration

Mint settings are controlled in `src/giggybank.config.ts`:

- `mint.priceUsd` — cost in USD equivalent (default: `10`)
- `mint.collectionName` — NFT collection name (default: `GiggyBank Honoraries`)
- `mint.description` — metadata description for the minted NFT

The token price is fetched in real-time from the Jupiter Price API to calculate the required `$GIGGYBANK` amount.

---

## Nano Banana (AI Image Generation)

GiggyBank integrates **Nano Banana**, a Gemini-powered image generation layer used for PFP compositing and campaign visuals.

Powered by `gemini-2.0-flash-exp`, it accepts a text prompt and optional reference image, and returns a generated image as a base64 data URI.

Generated images are uploaded to **AWS S3** for permanent hosting.

Setup guides:

- [`docs/GEMINI_SETUP.md`](docs/GEMINI_SETUP.md) — Gemini API key and configuration
- [`docs/AWS_SETUP.md`](docs/AWS_SETUP.md) — S3 bucket setup and IAM permissions

---

## Quick Start

Clone the repository:

```bash
git clone https://github.com/jsigwart/impacttreasury-giggybank.git
cd impacttreasury-giggybank
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Fill in the required environment variables in `.env.local`:

```env
# Gemini / Nano Banana (Image Generation)
GEMINI_API_KEY=

# AWS S3 (Image Hosting)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

Run the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

---

## Customizing the Framework

To launch your own ImpactTreasury deployment:

1. Fork this repository
2. Update `src/giggybank.config.ts` with your project name, token symbol, treasury wallet, and branding
3. Add your logo at `public/logo.png` (used as the PFP mint frame)
4. Configure Gemini and AWS credentials in `.env.local`
5. Deploy to Vercel

---

## Deployment

The easiest way to deploy is with **Vercel**:

1. Fork the repository
2. Import the project into Vercel
3. Add the required environment variables
4. Deploy

---

## License

MIT License

This project is open source and can be used to build new impact campaigns and community funding systems.
