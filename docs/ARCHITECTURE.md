# ImpactTreasury Architecture

ImpactTreasury is a framework that converts token trading activity into transparent, real-world impact campaigns.

The system connects on-chain treasury flows with off-chain real-world actions, and records proof of those actions in a public dashboard.

GiggyBank is the first live implementation.

---

# System Overview

The system has three primary layers:

1. Treasury Layer (on-chain)
2. Campaign Layer (application logic)
3. Transparency Layer (public proof)

Token Trading
     │
     ▼
Bags Fee Sharing
     │
     ▼
Treasury Wallet (Solana)
     │
     ▼
Impact Campaign
     │
     ▼
Delivery + Proof
     │
     ▼
Public Dashboard

---

# Treasury Layer

Trading activity generates fees through the Bags platform.

Those fees accumulate into a treasury wallet on Solana.

Bags token trading
        ↓
     fee sharing
        ↓
  treasury wallet

Treasury balances are periodically recorded as treasury snapshots.

Snapshots allow the system to display:

- treasury growth
- treasury spending
- campaign funding sources

---

# Campaign Layer

Treasury funds are used to create Impact Campaigns.

Each campaign represents a real-world action funded by the community.

Campaigns are stored in Supabase.

Two campaign types currently exist.

---

## High-Tip Drops

Large surprise tips for gig workers.

Example:

Subtotal: $18.75  
Tip: $200.00  
Total: $218.75  

These create meaningful moments for workers while generating highly shareable content.

Typical platforms include:

- DoorDash
- Uber Eats
- Instacart

---

## Cause Drops

Deliveries supporting real organizations.

Example:

Petco Cause Drop — Dog Rescue

Treasury funds are used to deliver supplies to organizations such as:

- animal rescues
- shelters
- food banks
- disaster relief groups

Each campaign can include a beneficiary field identifying the organization.

---

# Transparency Layer

ImpactTreasury emphasizes verifiable public proof.

Every campaign records:

- platform used
- subtotal
- tip
- total amount
- beneficiary (optional)
- receipt image
- treasury transaction reference

The public website exposes this data through:

- campaign pages
- treasury dashboards
- receipt proof images

This creates a permanent public record of how community funds are used.

---

# Application Stack

GiggyBank uses a simple but powerful architecture.

Frontend:

- Next.js (App Router)
- TailwindCSS

Backend:

- Supabase (database + authentication)

Blockchain:

- Solana treasury wallet

Deployment:

- Vercel

This architecture allows new communities to deploy ImpactTreasury quickly.

---

# Configuration System

Projects launching their own ImpactTreasury deployment only need to modify:

src/giggybank.config.ts

This file controls:

- token symbol
- treasury wallet
- project name
- branding
- links

Because the system is configuration-driven, it can support many different token communities.

---

# Example Campaign Flow

1. Token trading occurs
2. Bags fee-sharing funds treasury
3. Admin creates campaign
4. Delivery is performed
5. Receipt uploaded
6. Treasury transaction recorded
7. Campaign becomes publicly visible

---

# Why This Matters

Most token communities struggle to demonstrate real-world value.

ImpactTreasury provides a framework for:

- verifiable impact
- community transparency
- positive real-world outcomes

Instead of speculation alone, token activity can fund meaningful actions.

---

# GiggyBank

GiggyBank is the first live deployment of ImpactTreasury.

It focuses on:

- High-Tip Drops for gig workers
- Cause Drops supporting organizations such as animal rescues

GiggyBank demonstrates how token communities can convert trading activity into real-world impact.

---

# Future Extensions

Potential extensions include:

- automated treasury triggers
- DAO governance for campaign selection
- multi-chain treasury support
- campaign voting systems
- automated receipt verification

The architecture is intentionally flexible to support these future capabilities.
