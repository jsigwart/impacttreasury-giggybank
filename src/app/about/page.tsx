import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Smartphone, Shield, Repeat } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { config } from '@/giggybank.config'

export const metadata: Metadata = {
  title: 'About',
  description: config.description,
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-16">

          {/* Hero */}
          <div className="border-b border-zinc-800 pb-16 text-center">
            <span className="mb-4 inline-block rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-400">
              Built on ImpactTreasury
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white">
              Real drops. Real impact.
              <br />
              <span className="text-green-400">Real proof.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              {config.description}
            </p>
          </div>

          {/* What is GiggyBank */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">What is GiggyBank?</h2>
            <p className="leading-relaxed text-zinc-400">
              GiggyBank is a Bags-powered impact system that routes{' '}
              <span className="font-semibold text-white">{config.token.symbol}</span> token
              fee-sharing revenue into transparent, verifiable tips for gig workers. No middlemen.
              No discretionary spend. Every dollar from the treasury goes directly to a verified
              worker as a High-Tip Drop — documented with a receipt, a social post, and an
              on-chain transaction hash.
            </p>
            <p className="leading-relaxed text-zinc-400">
              Team allocation is locked for{' '}
              <span className="font-semibold text-white">
                {config.team.lockupMonths} months
              </span>
              . This isn&apos;t a project that cashes out. It&apos;s a system that pays it
              forward.
            </p>
          </section>

          {/* Drop types */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Two types of drops</h2>
            <p className="leading-relaxed text-zinc-400">
              <span className="font-semibold text-white">High-Tip Drops</span> are large, real tips
              delivered directly to verified gig workers — DoorDash drivers, Lyft drivers, Instacart
              shoppers. Not grants. Not loans. Tips, the kind these workers deserve but rarely receive.
            </p>
            <p className="leading-relaxed text-zinc-400">
              <span className="font-semibold text-white">Cause Drops</span> are donations to
              organizations, shelters, rescues, and community causes — funded by the same treasury,
              held to the same proof standard.
            </p>
            <p className="leading-relaxed text-zinc-400">
              Every drop includes:
            </p>
            <ul className="space-y-2 text-zinc-400">
              {[
                'A worker story — who received it and why',
                'A financial breakdown — subtotal, tip amount, and total',
                'A receipt image — proof of delivery',
                'A treasury transaction hash — on-chain proof of disbursement',
                'A social post — community-facing verification',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* iOS App */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-400/10 p-2.5">
                <Smartphone size={20} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">The GiggyBank iOS App</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-400">
              The GiggyBank iOS app is the worker-facing layer of this system. It connects verified
              gig workers directly with High-Tip Drop opportunities, lets the community follow
              along in real time, and surfaces public proof for every completed drop.
            </p>
            <p className="mb-6 leading-relaxed text-zinc-400">
              What you see on this dashboard is the public ledger of every drop the app has
              facilitated — a permanent record that can&apos;t be edited or hidden.
            </p>
            {config.appStoreUrl && (
              <a
                href={config.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
              >
                Download on the App Store
                <ArrowRight size={14} />
              </a>
            )}
          </section>

          {/* Transparency */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-400/10 p-2.5">
                <Shield size={20} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Transparency commitment</h2>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Every drop on this site is manually entered by the GiggyBank team and linked to
              verifiable on-chain evidence. The treasury wallet is public. The transaction hashes
              are public. The receipts are public. If something can&apos;t be proven, it
              doesn&apos;t get posted.
            </p>
            <p className="leading-relaxed text-zinc-400">
              We don&apos;t use the word &quot;lottery.&quot; We don&apos;t use vague
              &quot;community fund&quot; language. A High-Tip Drop is exactly what it says: a
              large, real tip, dropped on a real worker, with public proof.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={config.treasury.solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-400 transition-colors hover:text-green-300"
              >
                View treasury wallet ↗
              </a>
              <Link
                href="/campaigns"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                See all drops →
              </Link>
            </div>
          </section>

          {/* ImpactTreasury framework */}
          <section className="rounded-xl border border-dashed border-zinc-700 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-zinc-800 p-2.5">
                <Repeat size={20} className="text-zinc-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Built on ImpactTreasury</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-400">
              GiggyBank is the first live deployment of{' '}
              <Link href="/framework" className="font-medium text-white underline underline-offset-2 hover:text-green-400">
                ImpactTreasury
              </Link>
              {' '}— a reusable framework for turning token fees into transparent real-world impact
              campaigns. Any token project on Bags.fm can fork it and launch their own impact
              program with a single config file change.
            </p>
            <p className="text-sm text-zinc-600">
              Built on Next.js, Supabase, and Vercel. Powered by Bags.fm fee-sharing.
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
