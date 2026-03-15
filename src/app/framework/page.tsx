import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Coins, Globe, Code2, Repeat } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { config } from '@/giggybank.config'

export const metadata: Metadata = {
  title: 'ImpactTreasury Framework',
  description:
    'ImpactTreasury is a reusable framework for turning token fees into transparent real-world impact campaigns. GiggyBank is its first live deployment.',
}

export default function FrameworkPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-16">

          {/* Hero */}
          <div className="border-b border-zinc-800 pb-16 text-center">
            <span className="mb-4 inline-block rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-400">
              Open Framework
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white">
              ImpactTreasury
            </h1>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              A reusable framework for turning token fees into transparent,
              verifiable real-world impact campaigns.
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-zinc-600">
              <span className="font-medium text-white">{config.name}</span> is the first
              live deployment — built on Bags.fm, shipped at a hackathon, publicly verifiable
              on Solana.
            </p>
          </div>

          {/* What is ImpactTreasury */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">What is ImpactTreasury?</h2>
            <p className="leading-relaxed text-zinc-400">
              ImpactTreasury is a Next.js + Supabase application template designed for one
              specific purpose: making token-funded impact campaigns fully transparent and
              publicly verifiable. Every disbursement has a proof layer — receipts, social
              posts, and on-chain transaction hashes — published as a permanent public record.
            </p>
            <p className="leading-relaxed text-zinc-400">
              The entire project is driven by a single config file. Fork it, update the config,
              run one database migration, and you have your own transparent impact program
              running in minutes.
            </p>
          </section>

          {/* Campaign types */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white">Campaign types</h2>
            <p className="leading-relaxed text-zinc-400">
              ImpactTreasury ships with two campaign types out of the box:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-5">
                <span className="mb-3 inline-block rounded bg-green-400/10 px-2 py-0.5 text-xs font-semibold text-green-400">
                  High-Tip Drop
                </span>
                <p className="text-sm leading-relaxed text-zinc-400">
                  A large, real tip delivered directly to an individual gig worker.
                  Documented with a receipt and on-chain treasury transaction.
                </p>
              </div>
              <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-5">
                <span className="mb-3 inline-block rounded bg-purple-400/10 px-2 py-0.5 text-xs font-semibold text-purple-400">
                  Cause Drop
                </span>
                <p className="text-sm leading-relaxed text-zinc-400">
                  A donation to an organization, shelter, rescue, or community cause.
                  Same proof standard — receipt, beneficiary, treasury tx.
                </p>
              </div>
            </div>
            <p className="text-sm text-zinc-600">
              Both types use the same proof model. Extending with new types requires adding one
              value to a constants array.
            </p>
          </section>

          {/* How it works */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white">How it works</h2>
            <div className="space-y-4">
              {[
                {
                  icon: Coins,
                  title: 'Token fees power the treasury',
                  body: 'Bags.fm fee-sharing routes a percentage of every token trade into a public, on-chain treasury wallet. ImpactTreasury connects that wallet to a public proof system.',
                },
                {
                  icon: Globe,
                  title: 'Admin creates campaigns manually',
                  body: 'A password-protected admin panel lets project operators create and publish campaigns. For High-Tip Drops, the treasury funds a real order placed on a gig platform — the platform determines which worker receives the job. GiggyBank funds the tip, not the assignment.',
                },
                {
                  icon: Repeat,
                  title: 'Public proof layer',
                  body: 'Every published campaign is fully public — with a receipt, an on-chain tx you can verify on Solscan, and an optional social post. Nothing gets posted until it can be proven.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-zinc-800 p-2">
                    <Icon size={16} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-white">{title}</p>
                    <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Deploy your own */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-400/10 p-2.5">
                <Code2 size={20} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Deploy your own</h2>
            </div>
            <p className="leading-relaxed text-zinc-400">
              To launch your own ImpactTreasury deployment, fork the GiggyBank repo and edit
              a single config file:
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <pre className="text-xs leading-relaxed text-zinc-400">
{`// src/giggybank.config.ts
export const config = {
  name: 'YourProject',
  tagline: 'Your tagline here.',
  token: {
    symbol: 'YOURTOKEN',
    address: '<solana-mint-address>',
    bagsUrl: 'https://bags.fm/coin/<address>',
  },
  treasury: {
    wallet: '<treasury-wallet-address>',
    solscanUrl: 'https://solscan.io/account/<address>',
  },
  social: {
    twitter: 'https://twitter.com/yourproject',
    telegram: '',
  },
  // ...
}`}
              </pre>
            </div>
            <p className="text-sm text-zinc-600">
              Run the Supabase migration, deploy to Vercel, and your project has a fully
              public proof layer from day one.
            </p>
          </section>

          {/* GiggyBank as live proof */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Live deployment
            </p>
            <p className="mb-4 text-lg font-bold text-white">
              {config.name} is ImpactTreasury in production.
            </p>
            <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-zinc-400">
              Every campaign on this site is proof that the framework works —
              real workers, real receipts, real treasury transactions.
            </p>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
            >
              See the drops
              <ArrowRight size={14} />
            </Link>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
