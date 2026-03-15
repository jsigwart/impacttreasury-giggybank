'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import AdminShell from '@/components/layout/AdminShell'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import type { Campaign } from '@/types'

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchCampaigns = useCallback(async () => {
    // Admin can see all campaigns including unpublished — use server-side filtering
    const res = await fetch('/api/admin/campaigns/list')
    if (res.ok) {
      setCampaigns(await res.json())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' })
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
    setDeleting(null)
  }

  async function togglePublished(campaign: Campaign) {
    const res = await fetch(`/api/admin/campaigns/${campaign.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !campaign.published }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    }
  }

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Campaigns</h1>
            <p className="text-sm text-zinc-500">Manage all impact campaigns.</p>
          </div>
          <Link
            href="/admin/campaigns/new"
            className="flex items-center gap-2 rounded-lg bg-green-400 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
          >
            <Plus size={16} />
            New Campaign
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800">
          {loading ? (
            <div className="py-12 text-center text-zinc-600">Loading…</div>
          ) : campaigns.length === 0 ? (
            <div className="py-12 text-center text-zinc-600">
              No campaigns yet.{' '}
              <Link href="/admin/campaigns/new" className="text-green-400 hover:underline">
                Create one →
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Platform
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Published
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900/50">
                    <td className="max-w-xs px-4 py-3">
                      <span className="line-clamp-1 text-white">{c.title}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                      {formatDateShort(c.date)}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{c.platform ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-green-400">
                      {formatCurrency(c.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePublished(c)}
                        className={`rounded-full px-3 py-0.5 text-xs font-medium transition-colors ${
                          c.published
                            ? 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                            : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                        }`}
                      >
                        {c.published ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/campaigns/${c.id}`}
                          className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.title)}
                          disabled={deleting === c.id}
                          className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-red-900/30 hover:text-red-400 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
