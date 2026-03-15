# ImpactTreasury – GiggyBank

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![Bags](https://img.shields.io/badge/Bags-FeeSharing-blue)

**GiggyBank is the first live deployment of ImpactTreasury**, a reusable framework for turning token trading fees into transparent real-world impact campaigns.

Built on **Bags fee-sharing**, GiggyBank routes token trading activity into a community treasury that funds publicly verifiable impact drops.

These drops take two forms:

- **High-Tip Drops** — large surprise tips for gig workers  
- **Cause Drops** — deliveries supporting real organizations such as shelters, rescues, and food banks  

Every campaign includes:

- financial breakdowns  
- delivery receipts  
- treasury transactions  

This ensures that every action funded by the community is **visible, documented, and verifiable**.

---

# What is ImpactTreasury?

ImpactTreasury is the underlying framework powering GiggyBank.

It provides a reusable architecture that allows any token community to fund and document real-world impact campaigns with full transparency.

Projects can fork this repository, configure their treasury and branding, and launch their own impact system.

---

# Demo

Live site:  
https://giggybank.app/impacttreasury

Token:  
**GIGGYBANK**

Contract Address:

GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS

---

# Built With

- **Bags** — token launch and fee-sharing infrastructure  
- **Solana** — treasury transactions  
- **Next.js** — application framework  
- **Supabase** — database and authentication  
- **Vercel** — deployment platform  

---

# Quick Start

Clone the repository:

git clone https://github.com/jsigwart/impacttreasury-giggybank.git
cd impacttreasury-giggybank

Install dependencies:

npm install

Create your environment file:

cp .env.example .env.local

Fill in the required environment variables in `.env.local`:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

Run the development server:

npm run dev

The app will be available at:

http://localhost:3000

---

# Database Setup

Create a Supabase project and run the migrations located in:

supabase/migrations/

Run:

001_initial.sql  
002_campaign_type_beneficiary.sql  

Optionally load example data:

supabase/seed.sql

This will populate the dashboard with example High-Tip Drops and Cause Drops.

---

# Architecture Overview

ImpactTreasury separates three responsibilities.

## Treasury Layer

Token fee-sharing accumulates funds in a treasury wallet.

Bags token trading
        ↓
     fee sharing
        ↓
    treasury wallet

## Campaign Layer

Treasury funds are used to create **impact campaigns**.

Two campaign types are supported.

### High-Tip Drops

Large surprise tips for gig workers.

Example:

Subtotal: $18.75  
Tip: $200.00  
Total: $218.75  

These create meaningful moments for gig workers and highly shareable content.

### Cause Drops

Deliveries supporting real-world organizations.

Example:

Petco Cause Drop — Dog Rescue

Treasury funds are used to deliver supplies to organizations such as:

- animal rescues  
- shelters  
- food banks  
- disaster relief  

Each campaign records:

- platform used  
- subtotal  
- tip  
- total amount  
- beneficiary (optional)  
- receipt image  
- treasury transaction  

---

# Transparency Layer

The public website provides:

- campaign history  
- treasury balance snapshots  
- receipts and proof links  

This creates a **verifiable public record of impact**.

---

# Customizing the Framework

To launch your own ImpactTreasury deployment:

1. Fork this repository  
2. Update the configuration file:

src/giggybank.config.ts

Replace:

- project name  
- token symbol  
- treasury wallet  
- branding  
- links  

3. Configure your Supabase instance  
4. Deploy to Vercel  

You now have your own transparent impact campaign system.

---

# Deployment

The easiest way to deploy is with **Vercel**.

Steps:

1. Fork the repository  
2. Import the project into Vercel  
3. Add the required environment variables  
4. Connect to your Supabase instance  

Deployment typically takes less than a minute.

---

# License

MIT License

This project is open source and can be used to build new impact campaigns and community funding systems.
