# ImpactTreasury – GiggyBank

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![Bags](https://img.shields.io/badge/Bags-FeeSharing-blue)

**Launch a coin. Fund real-world impact. Grow your community.**

ImpactTreasury is an open-source framework for launching a token on [Bags](https://bags.fm) and routing its trading fees into a transparent community treasury. The treasury funds documented real-world impact campaigns — and gives holders a built-in way to mint **Honoraries**: on-chain NFTs that combine *their* image (their IP) with the project logo (the coin's IP), creating personalized collectibles that spread the brand and grow the community organically.

**GiggyBank** is the first live deployment — a coin that funds surprise high-tip drops for gig workers.

---

## The Framework Thesis

Most token communities generate trading fees that go nowhere visible. ImpactTreasury changes that:

1. **Launch a coin on Bags** — trading fees flow to your treasury automatically via Bags fee-sharing.
2. **Fund real-world campaigns** — use the treasury to run documented, verifiable impact drops (charity deliveries, surprise tips, community events — whatever fits your cause).
3. **Mint Honoraries** — let holders mint NFTs that merge their own image with your project logo. Holders pay in your token, funds go to the treasury, and every mint spreads your brand as a PFP across socials.
4. **Grow the community** — Honoraries turn holders into walking billboards. Every PFP is free marketing. Every impact campaign is shareable proof the community is doing something real.

The loop is simple: **trading fees fund impact, Honoraries spread the brand, brand growth drives more trading, more trading funds more impact.**

---

## GiggyBank (Live Example)

**Token:** `$GIGGYBANK`
**Contract:** `GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS`
**Site:** [demo.giggybank.app](https://demo.giggybank.app)

GiggyBank uses its treasury to fund two kinds of drops:

- **High-Tip Drops** — real orders placed on gig platforms (DoorDash, Instacart, Lyft, etc.) with outsized tips funded by the treasury. The platform assigns the worker — GiggyBank funds the tip, not the assignment.
- **Cause Drops** — deliveries supporting shelters, rescues, and food banks.

Every campaign includes receipts, financial breakdowns, and on-chain treasury transactions.

---

## Honoraries — Mint Your PFP

The `/mint` page lets any holder create a personalized Honorary:

1. **Connect wallet** — Phantom, Solflare, or any Solana wallet
2. **Upload your image** — PNG, JPG, or WebP (up to 10 MB)
3. **Preview** — see your image composited with the project logo
4. **Pay in $GIGGYBANK** — equivalent of $10 USD (price fetched live from Jupiter), sent to the treasury
5. **Receive your NFT** — minted directly to your wallet

Honoraries merge the holder's IP with the coin's IP. The result is a PFP that represents both the individual and the community — and every one shared on socials is organic brand growth.

---

## Fork It — Launch Your Own

ImpactTreasury is designed to be forked. Launch your own coin with built-in impact funding and Honorary minting:

1. **Fork** this repository
2. **Configure** `src/giggybank.config.ts` — project name, token, treasury wallet, branding, mint price
3. **Add your logo** at `public/logo.png` — this becomes the Honorary frame
4. **Set up credentials** — Gemini API key (image generation) and AWS S3 (image hosting) in `.env.local`
5. **Deploy** to Vercel

### Quick Start

```bash
git clone https://github.com/jsigwart/impacttreasury-giggybank.git
cd impacttreasury-giggybank
npm install
cp .env.example .env.local
# Fill in GEMINI_API_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Built With

- **[Bags](https://bags.fm)** — token launch and fee-sharing infrastructure
- **Solana** — treasury transactions and NFT minting
- **Next.js 16** — application framework
- **Gemini** — AI image generation for Honorary compositing
- **AWS S3** — image hosting
- **Vercel** — deployment

Setup guides: [`docs/GEMINI_SETUP.md`](docs/GEMINI_SETUP.md) | [`docs/AWS_SETUP.md`](docs/AWS_SETUP.md)

---

## License

MIT — fork it, launch your coin, fund your cause, grow your community.
