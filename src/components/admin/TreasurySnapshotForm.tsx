'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TreasurySnapshotForm() {
  const router = useRouter()
  const [form, setForm] = useState({ balance_sol: '', balance_usd: '', sol_price: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const inputClass =
    'w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-green-400 focus:outline-none'
  const labelClass = 'mb-1 block text-xs font-medium text-zinc-400'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/admin/treasury/snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        balance_sol: parseFloat(form.balance_sol),
        balance_usd: parseFloat(form.balance_usd),
        sol_price: form.sol_price ? parseFloat(form.sol_price) : null,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setForm({ balance_sol: '', balance_usd: '', sol_price: '' })
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-800 bg-green-900/20 px-4 py-3 text-sm text-green-400">
          Snapshot recorded successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Balance (SOL) *</label>
          <input
            required
            type="number"
            step="0.000000001"
            min="0"
            className={inputClass}
            placeholder="12.5"
            value={form.balance_sol}
            onChange={(e) => setForm((f) => ({ ...f, balance_sol: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass}>Balance (USD) *</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            placeholder="2187.50"
            value={form.balance_usd}
            onChange={(e) => setForm((f) => ({ ...f, balance_usd: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass}>SOL Price (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            placeholder="175.00"
            value={form.sol_price}
            onChange={(e) => setForm((f) => ({ ...f, sol_price: e.target.value }))}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300 disabled:opacity-50"
      >
        {loading ? 'Recording…' : 'Record Snapshot'}
      </button>
    </form>
  )
}
