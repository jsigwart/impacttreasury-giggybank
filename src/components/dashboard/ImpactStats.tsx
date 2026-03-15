import { formatCurrency } from '@/lib/utils'
import type { Stats } from '@/types'

interface StatItemProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

function StatItem({ label, value, sub, accent }: StatItemProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`text-3xl font-bold tabular-nums ${accent ? 'text-green-400' : 'text-white'}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-sm text-zinc-500">{sub}</p>}
    </div>
  )
}

interface ImpactStatsProps {
  stats: Stats
}

export default function ImpactStats({ stats }: ImpactStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatItem
        label="Total Drops"
        value={stats.campaignCount.toString()}
        sub="completed"
      />
      <StatItem
        label="Total Tipped"
        value={formatCurrency(stats.totalTipped)}
        sub="to workers &amp; causes"
        accent
      />
      <StatItem
        label="Biggest Single Drop"
        value={stats.biggestSingleTip > 0 ? formatCurrency(stats.biggestSingleTip) : '—'}
        sub="highest single tip"
      />
      <StatItem
        label="Treasury Balance"
        value={
          stats.latestTreasuryBalance != null
            ? formatCurrency(stats.latestTreasuryBalance)
            : '—'
        }
        sub="available"
      />
    </div>
  )
}
