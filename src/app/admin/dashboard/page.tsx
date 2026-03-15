import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'
import AdminShell from '@/components/layout/AdminShell'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import type { Campaign, Stats, TreasurySnapshot } from '@/types'

async function getAdminData() {
  const supabase = await createClient()

  const [{ data: allCampaigns }, { data: snapshot }, { data: rows }] =
    await Promise.all([
      supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('treasury_snapshots')
        .select('*')
        .order('snapshot_at', { ascending: false })
        .limit(1)
        .single(),
      supabase.from('campaigns').select('total, tip, subtotal, published'),
    ])

  const pub = (rows ?? []).filter((c: { published: boolean }) => c.published)
  const stats: Stats = {
    campaignCount: pub.length,
    totalSpent: pub.reduce((s: number, c: { total: number }) => s + (c.total ?? 0), 0),
    totalTipped: pub.reduce((s: number, c: { tip: number }) => s + (c.tip ?? 0), 0),
    totalSubtotal: pub.reduce((s: number, c: { subtotal: number }) => s + (c.subtotal ?? 0), 0),
    latestTreasuryBalance: (snapshot as TreasurySnapshot | null)?.balance_usd ?? null,
    treasuryDisbursed: pub.reduce((s: number, c: { total: number }) => s + (c.total ?? 0), 0),
  }

  return {
    campaigns: (allCampaigns ?? []) as Campaign[],
    totalCampaigns: (rows ?? []).length,
    stats,
  }
}

export default async function AdminDashboardPage() {
  const { campaigns, totalCampaigns, stats } = await getAdminData()

  const statCards = [
    { label: 'Published', value: stats.campaignCount.toString() },
    { label: 'Total', value: totalCampaigns.toString() },
    { label: 'Disbursed', value: formatCurrency(stats.totalSpent) },
    {
      label: 'Treasury',
      value:
        stats.latestTreasuryBalance != null
          ? formatCurrency(stats.latestTreasuryBalance)
          : '—',
    },
  ]

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-zinc-500">Overview of all campaigns and treasury.</p>
          </div>
          <Link
            href="/admin/campaigns/new"
            className="flex items-center gap-2 rounded-lg bg-green-400 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
          >
            <Plus size={16} />
            New Campaign
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                {label}
              </p>
              <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
            <Link
              href="/admin/campaigns"
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800">
            {campaigns.length === 0 ? (
              <div className="py-12 text-center text-zinc-600">No campaigns yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 text-white">{c.title}</td>
                      <td className="px-4 py-3 text-zinc-500">{formatDateShort(c.date)}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-green-400">
                        {formatCurrency(c.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            c.published
                              ? 'bg-green-400/10 text-green-400'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {c.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/campaigns/${c.id}`}
                          className="text-xs text-zinc-500 hover:text-white"
                        >
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
