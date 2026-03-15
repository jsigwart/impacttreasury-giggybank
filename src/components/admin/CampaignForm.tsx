'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateSlug, CATEGORIES, categoryLabel, CAMPAIGN_TYPES, campaignTypeLabel } from '@/lib/utils'
import type { Campaign } from '@/types'

type FormData = {
  campaign_type: string
  title: string
  description: string
  beneficiary: string
  date: string
  category: string
  platform: string
  subtotal: string
  tip: string
  total: string
  treasury_tx: string
  receipt_image_url: string
  social_post_url: string
  notes: string
  published: boolean
}

function emptyForm(): FormData {
  return {
    campaign_type: 'high_tip_drop',
    title: '',
    description: '',
    beneficiary: '',
    date: new Date().toISOString().slice(0, 10),
    category: 'food',
    platform: '',
    subtotal: '',
    tip: '',
    total: '',
    treasury_tx: '',
    receipt_image_url: '',
    social_post_url: '',
    notes: '',
    published: false,
  }
}

function campaignToForm(c: Campaign): FormData {
  return {
    campaign_type: c.campaign_type,
    title: c.title,
    description: c.description ?? '',
    beneficiary: c.beneficiary ?? '',
    date: c.date,
    category: c.category,
    platform: c.platform ?? '',
    subtotal: c.subtotal?.toString() ?? '',
    tip: c.tip?.toString() ?? '',
    total: c.total.toString(),
    treasury_tx: c.treasury_tx ?? '',
    receipt_image_url: c.receipt_image_url ?? '',
    social_post_url: c.social_post_url ?? '',
    notes: c.notes ?? '',
    published: c.published,
  }
}

interface CampaignFormProps {
  campaign?: Campaign
}

export default function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(
    campaign ? campaignToForm(campaign) : emptyForm()
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEdit = Boolean(campaign)

  function handleChange(field: keyof FormData, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'subtotal' || field === 'tip') {
        const sub = parseFloat((field === 'subtotal' ? value : prev.subtotal) as string) || 0
        const tip = parseFloat((field === 'tip' ? value : prev.tip) as string) || 0
        updated.total = (sub + tip).toFixed(2)
      }
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const slug = isEdit ? campaign!.slug : generateSlug(form.title, form.date)

    const payload = {
      slug,
      campaign_type: form.campaign_type,
      title: form.title,
      description: form.description || null,
      beneficiary: form.beneficiary || null,
      date: form.date,
      category: form.category,
      platform: form.platform || null,
      subtotal: form.subtotal ? parseFloat(form.subtotal) : null,
      tip: form.tip ? parseFloat(form.tip) : null,
      total: parseFloat(form.total),
      treasury_tx: form.treasury_tx || null,
      receipt_image_url: form.receipt_image_url || null,
      social_post_url: form.social_post_url || null,
      notes: form.notes || null,
      published: form.published,
    }

    const url = isEdit ? `/api/admin/campaigns/${campaign!.id}` : '/api/admin/campaigns'
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    router.push('/admin/campaigns')
    router.refresh()
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-green-400 focus:outline-none'
  const labelClass = 'mb-1 block text-xs font-medium text-zinc-400'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Campaign Type */}
      <div>
        <label className={labelClass}>Campaign Type *</label>
        <div className="flex gap-3">
          {CAMPAIGN_TYPES.map((t) => (
            <label
              key={t}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                form.campaign_type === t
                  ? t === 'high_tip_drop'
                    ? 'border-green-400 bg-green-400/10 text-green-400'
                    : 'border-purple-400 bg-purple-400/10 text-purple-400'
                  : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              <input
                type="radio"
                name="campaign_type"
                value={t}
                checked={form.campaign_type === t}
                onChange={() => handleChange('campaign_type', t)}
                className="sr-only"
              />
              {campaignTypeLabel(t)}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-zinc-600">
          {form.campaign_type === 'high_tip_drop'
            ? 'A large tip delivered directly to an individual gig worker.'
            : 'A donation to an organization, shelter, rescue, or community cause.'}
        </p>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          required
          className={inputClass}
          placeholder={
            form.campaign_type === 'cause_drop'
              ? 'Dog Food Drive — Santa Barbara Dog Rescue'
              : 'Hot Meal Delivery — Jane D.'
          }
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          className={inputClass}
          placeholder="Brief description of who received this and why."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      {/* Beneficiary */}
      <div>
        <label className={labelClass}>Beneficiary</label>
        <input
          className={inputClass}
          placeholder={
            form.campaign_type === 'cause_drop'
              ? 'Santa Barbara Dog Rescue'
              : 'Individual gig worker (optional)'
          }
          value={form.beneficiary}
          onChange={(e) => handleChange('beneficiary', e.target.value)}
        />
        <p className="mt-1 text-xs text-zinc-600">
          Organization, shelter, or recipient name shown on the public proof page.
        </p>
      </div>

      {/* Date + Category + Platform */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Date *</label>
          <input
            required
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select
            required
            className={inputClass}
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Platform</label>
          <input
            className={inputClass}
            placeholder="DoorDash, Instacart, Lyft…"
            value={form.platform}
            onChange={(e) => handleChange('platform', e.target.value)}
          />
        </div>
      </div>

      {/* Financials */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Financials
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Subtotal ($)</label>
            <input
              type="number" step="0.01" min="0"
              className={inputClass}
              placeholder="0.00"
              value={form.subtotal}
              onChange={(e) => handleChange('subtotal', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Tip ($)</label>
            <input
              type="number" step="0.01" min="0"
              className={inputClass}
              placeholder="0.00"
              value={form.tip}
              onChange={(e) => handleChange('tip', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Total ($) *</label>
            <input
              required type="number" step="0.01" min="0"
              className={inputClass}
              placeholder="0.00"
              value={form.total}
              onChange={(e) => handleChange('total', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Proof */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Proof
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Treasury TX Hash</label>
            <input
              className={inputClass}
              placeholder="Solana transaction hash"
              value={form.treasury_tx}
              onChange={(e) => handleChange('treasury_tx', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Receipt Image URL</label>
            <input
              className={inputClass}
              placeholder="https://..."
              value={form.receipt_image_url}
              onChange={(e) => handleChange('receipt_image_url', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Social Post URL</label>
            <input
              className={inputClass}
              placeholder="https://twitter.com/..."
              value={form.social_post_url}
              onChange={(e) => handleChange('social_post_url', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          rows={2}
          className={inputClass}
          placeholder="Internal notes (not shown publicly)."
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <input
          id="published"
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-green-400"
          checked={form.published}
          onChange={(e) => handleChange('published', e.target.checked)}
        />
        <label htmlFor="published" className="text-sm text-zinc-300">
          Published (visible on public site)
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-zinc-800 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-400 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300 disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Campaign'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/campaigns')}
          className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
