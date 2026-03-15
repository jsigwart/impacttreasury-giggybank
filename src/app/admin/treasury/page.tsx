import type { Metadata } from 'next'
import AdminShell from '@/components/layout/AdminShell'
import TreasurySnapshotForm from '@/components/admin/TreasurySnapshotForm'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import type { TreasurySnapshot } from '@/types'

export const metadata: Metadata = { title: 'Treasury — Admin' }

async function getSnapshots(): Promise<TreasurySnapshot[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('treasury_snapshots')
    .select('*')
    .order('snapshot_at', { ascending: false })
    .limit(20)
  return (data ?? []) as TreasurySnapshot[]
}

export default async function AdminTreasuryPage() {
  const snapshots = await getSnapshots()

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Treasury</h1>
          <p className="text-sm text-zinc-500">
            Record manual treasury balance snapshots.
          </p>
        </div>

        <div className="mb-10 max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-base font-semibold text-white">Record Snapshot</h2>
          <TreasurySnapshotForm />
        </div>

        <div>
          <h2 className="mb-4 text-base font-semibold text-white">Snapshot History</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            {snapshots.length === 0 ? (
              <div className="py-10 text-center text-zinc-600">
                No snapshots recorded yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Timestamp</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">SOL</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">USD</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">SOL Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {snapshots.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 text-zinc-400">
                        {new Date(s.snapshot_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-white">
                        {Number(s.balance_sol).toLocaleString()} SOL
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-green-400">
                        {formatCurrency(s.balance_usd)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-500">
                        {s.sol_price ? formatCurrency(s.sol_price) : '—'}
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
