import { ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { config } from '@/giggybank.config'
import type { TreasurySnapshot } from '@/types'

interface TreasuryCardProps {
  snapshot: TreasurySnapshot | null
}

export default function TreasuryCard({ snapshot }: TreasuryCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Treasury Balance
        </span>
        <a
          href={config.treasury.solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-green-400"
        >
          View on Solscan
          <ExternalLink size={12} />
        </a>
      </div>

      {snapshot ? (
        <>
          <p className="text-4xl font-bold tabular-nums text-white">
            {formatCurrency(snapshot.balance_usd)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {snapshot.balance_sol.toLocaleString()} SOL
            {snapshot.sol_price && (
              <span className="ml-2 text-zinc-600">
                @ {formatCurrency(snapshot.sol_price)}/SOL
              </span>
            )}
          </p>
          <p className="mt-3 text-xs text-zinc-600">
            Last updated{' '}
            {new Date(snapshot.snapshot_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </>
      ) : (
        <p className="text-2xl font-bold text-zinc-600">No snapshot yet</p>
      )}
    </div>
  )
}
