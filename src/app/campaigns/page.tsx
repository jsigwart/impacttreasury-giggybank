import type { Metadata } from 'next'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import CampaignGrid from '@/components/campaigns/CampaignGrid'
import { createClient } from '@/lib/supabase/server'
import { categoryLabel, CATEGORIES, campaignTypeLabel, CAMPAIGN_TYPES } from '@/lib/utils'
import Link from 'next/link'
import type { Campaign } from '@/types'

export const metadata: Metadata = {
  title: 'Drops',
}

async function getCampaigns(category?: string, type?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('campaigns')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })

  if (category && category !== 'all') query = query.eq('category', category)
  if (type && type !== 'all') query = query.eq('campaign_type', type)

  const { data } = await query
  return (data ?? []) as Campaign[]
}

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string }>
}) {
  const { category, type } = await searchParams
  const activeCategory = category ?? 'all'
  const activeType = type ?? 'all'
  const campaigns = await getCampaigns(activeCategory, activeType)

  function filterHref(updates: { category?: string; type?: string }) {
    const params = new URLSearchParams()
    const c = updates.category ?? activeCategory
    const t = updates.type ?? activeType
    if (c !== 'all') params.set('category', c)
    if (t !== 'all') params.set('type', t)
    const qs = params.toString()
    return `/campaigns${qs ? `?${qs}` : ''}`
  }

  const typeFilters = [
    { value: 'all', label: 'All Drops' },
    ...CAMPAIGN_TYPES.map((t) => ({ value: t, label: campaignTypeLabel(t) })),
  ]

  const categoryFilters = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map((c) => ({ value: c, label: categoryLabel(c) })),
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-white">Drops</h1>
            <p className="text-zinc-500">
              High-Tip Drops for gig workers and Cause Drops for community support —
              every one verified with a real receipt and an on-chain transaction.
            </p>
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2">
            {typeFilters.map(({ value, label }) => (
              <Link
                key={value}
                href={filterHref({ type: value })}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeType === value
                    ? 'bg-green-400 text-black'
                    : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map(({ value, label }) => (
              <Link
                key={value}
                href={filterHref({ category: value })}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === value
                    ? 'bg-zinc-600 text-white'
                    : 'border border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <CampaignGrid
            campaigns={campaigns}
            emptyMessage="No drops found for this filter."
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
