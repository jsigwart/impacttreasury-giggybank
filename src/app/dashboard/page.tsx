import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import TreasuryCard from '@/components/dashboard/TreasuryCard'
import ImpactStats from '@/components/dashboard/ImpactStats'
import CampaignGrid from '@/components/campaigns/CampaignGrid'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { config } from '@/giggybank.config'
import type { Campaign, TreasurySnapshot, Stats } from '@/types'

export const metadata: Metadata = {
  title: 'High-Tip Drop Dashboard',
}

async function getDashboardData() {
  const supabase = await createClient()

  const [{ data: campaigns }, { data: snapshot }, { data: rows }] =
    await Promise.all([
      supabase
        .from('campaigns')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false }),
      supabase
        .from('treasury_snapshots')
        .select('*')
        .order('snapshot_at', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('campaigns')
        .select('total, tip, subtotal')
        .eq('published', true),
    ])

  const data = rows ?? []

  const stats: Stats = {
    campaignCount: data.length,
    totalSpent: data.reduce((s: number, c: { total: number }) => s + (c.total ?? 0), 0),
    totalTipped: data.reduce((s: number, c: { tip: number }) => s + (c.tip ?? 0), 0),
    totalSubtotal: data.reduce((s: number, c: { subtotal: number }) => s + (c.subtotal ?? 0), 0),
    biggestSingleTip: data.length > 0 ? Math.max(...data.map((c: { tip: number }) => c.tip ?? 0)) : 0,
    latestTreasuryBalance: (snapshot as TreasurySnapshot | null)?.balance_usd ?? null,
    treasuryDisbursed: data.reduce((s: number, c: { total: number }) => s + (c.total ?? 0), 0),
  }

  const allCampaigns = (campaigns ?? []) as Campaign[]
  const latestDrop = allCampaigns[0] ?? null

  return { campaigns: allCampaigns, latestDrop, snapshot: snapshot as TreasurySnapshot | null, stats }
}

export default async function DashboardPage() {
  const { campaigns, latestDrop, snapshot, stats } = await getDashboardData()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-10">

          {/* Header */}
          <div>
            <h1 className="mb-1 text-3xl font-bold text-white">High-Tip Drop Dashboard</h1>
            <p className="text-zinc-500">
              Live view of {config.name} treasury activity and worker wins.
            </p>
          </div>

          {/* Treasury */}
          <TreasuryCard snapshot={snapshot} />

          {/* Stats */}
          <ImpactStats stats={stats} />

          {/* Latest drop */}
          {latestDrop && (
            <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-green-400">
                  {latestDrop.campaign_type === 'cause_drop' ? 'Latest Cause Drop' : 'Latest Worker Win'}
                </p>
                <span className="text-xs text-zinc-600">{formatDateShort(latestDrop.date)}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-white">{latestDrop.title}</h3>
                  {latestDrop.beneficiary && (
                    <p className="mb-1 text-xs font-medium text-zinc-400">{latestDrop.beneficiary}</p>
                  )}
                  {latestDrop.description && (
                    <p className="line-clamp-2 text-sm text-zinc-400">{latestDrop.description}</p>
                  )}
                  {latestDrop.platform && (
                    <p className="mt-2 text-xs text-zinc-600">{latestDrop.platform}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {latestDrop.tip != null && latestDrop.tip > 0 ? (
                    <>
                      <p className="text-2xl font-bold tabular-nums text-green-400">
                        {formatCurrency(latestDrop.tip)}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {latestDrop.campaign_type === 'high_tip_drop' ? 'surprise tip' : 'tip'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold tabular-nums text-green-400">
                        {formatCurrency(latestDrop.total)}
                      </p>
                      <p className="text-xs text-zinc-600">donated</p>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={`/campaigns/${latestDrop.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-green-400 transition-colors hover:text-green-300"
                >
                  View full proof <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* All drops */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-white">All Drops</h2>
            <CampaignGrid campaigns={campaigns} emptyMessage="No drops yet. Add your first campaign in the admin panel." />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
