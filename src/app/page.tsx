import Link from 'next/link'
import { ArrowRight, Coins, Gift, Eye } from 'lucide-react'
import { Tweet } from 'react-tweet'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import CampaignGrid from '@/components/campaigns/CampaignGrid'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { config } from '@/giggybank.config'
import type { Campaign, TreasurySnapshot } from '@/types'

async function getHomeData() {
  const supabase = await createClient()
  const [{ data: campaigns }, { data: snapshot }, { data: stats }] =
    await Promise.all([
      supabase
        .from('campaigns')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(3),
      supabase
        .from('treasury_snapshots')
        .select('balance_usd')
        .order('snapshot_at', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('campaigns')
        .select('total, tip')
        .eq('published', true),
    ])

  const rows = stats ?? []
  const totalTipped = rows.reduce((sum: number, c: { tip: number }) => sum + (c.tip ?? 0), 0)
  const biggestTip = rows.length > 0 ? Math.max(...rows.map((c: { tip: number }) => c.tip ?? 0)) : 0
  const dropCount = rows.length

  return {
    campaigns: (campaigns ?? []) as Campaign[],
    treasuryBalance: (snapshot as TreasurySnapshot | null)?.balance_usd ?? null,
    totalTipped,
    biggestTip,
    dropCount,
  }
}

export default async function LandingPage() {
  const { campaigns, treasuryBalance, totalTipped, biggestTip, dropCount } =
    await getHomeData()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-zinc-800 px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Powered by Bags.fm fee-sharing
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            High-Tip Drops
            <br />
            <span className="text-green-400">for gig workers.</span>
          </h1>
          <p className="mx-auto mb-4 max-w-xl text-lg text-zinc-400">
            GiggyBank turns{' '}
            <span className="font-semibold text-white">{config.token.symbol}</span>{' '}
            fee-sharing revenue into transparent, real-world tips — public proof for every drop.
          </p>
          <p className="mx-auto mb-6 max-w-lg text-sm text-zinc-600">
            Every trade funds the treasury. Every treasury disbursement goes to a verified gig worker. Every drop is permanently on-chain.
          </p>
          <p className="mx-auto mb-10 max-w-lg text-xs text-zinc-700">
            The first live deployment of{' '}
            <Link href="/framework" className="text-zinc-500 underline-offset-2 hover:text-zinc-400 underline">
              ImpactTreasury
            </Link>
            {' '}— a reusable framework for turning token fees into transparent real-world impact campaigns.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-green-400 px-6 py-3 font-semibold text-black transition-colors hover:bg-green-300"
            >
              View Drops
              <ArrowRight size={16} />
            </Link>
            {config.appStoreUrl && (
              <a
                href={config.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-white transition-colors hover:border-zinc-500"
              >
                Get the App
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-zinc-800 bg-zinc-950 px-4 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold tabular-nums text-white">{dropCount}</p>
            <p className="mt-1 text-sm text-zinc-500">High-Tip Drops</p>
          </div>
          <div>
            <p className="text-3xl font-bold tabular-nums text-green-400">
              {formatCurrency(totalTipped)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Total tipped</p>
          </div>
          <div>
            <p className="text-3xl font-bold tabular-nums text-white">
              {biggestTip > 0 ? formatCurrency(biggestTip) : '—'}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Biggest single drop</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-zinc-800 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-white">
            How High-Tip Drops work
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            A transparent pipeline from token trade to worker tip.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Coins,
                step: '01',
                title: 'Token fees power the treasury',
                body: `Every ${config.token.symbol} trade on Bags.fm generates fee-sharing revenue. It flows directly into a public, on-chain treasury wallet — visible to anyone.`,
              },
              {
                icon: Gift,
                step: '02',
                title: 'A gig worker receives the surprise tip',
                body: `GiggyBank places a real order on a gig platform with an outsized tip funded by the treasury. The platform determines which worker receives the job, and that worker receives the full tip on completion.`,
              },
              {
                icon: Eye,
                step: '03',
                title: 'Every drop is public proof',
                body: `Receipts, social posts, and treasury transaction hashes are published for every drop. Verifiable by anyone, on-chain, forever.`,
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <div
                key={step}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-green-400/10 p-2.5">
                    <Icon size={20} className="text-green-400" />
                  </div>
                  <span className="text-4xl font-bold tabular-nums text-zinc-800">
                    {step}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest drops */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Latest drops</h2>
              <p className="mt-0.5 text-sm text-zinc-500">Recent worker wins, fully verified.</p>
            </div>
            <Link
              href="/campaigns"
              className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              All drops
              <ArrowRight size={14} />
            </Link>
          </div>
          <CampaignGrid
            campaigns={campaigns}
            emptyMessage="No drops yet. Check back soon."
          />
        </div>
      </section>

      {/* Treasury CTA */}
      {treasuryBalance != null && (
        <section className="border-t border-zinc-800 bg-zinc-950 px-4 py-16 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Treasury Available for Drops
          </p>
          <p className="mb-4 text-4xl font-bold text-green-400">
            {formatCurrency(treasuryBalance)}
          </p>
          <p className="mb-6 text-sm text-zinc-600">
            Every dollar in this wallet will become a verified tip for a gig worker.
          </p>
          <a
            href={config.treasury.solscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Verify treasury on Solscan ↗
          </a>
        </section>
      )}

      {/* Hackathon Tweet */}
      <section className="border-t border-zinc-800 px-4 py-16">
        <div className="mx-auto max-w-xl">
          <div className="flex justify-center rounded-xl bg-white p-4" data-theme="light">
            <Tweet id="2033733353019765129" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
