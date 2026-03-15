import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import CampaignProofs from '@/components/campaigns/CampaignProofs'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, categoryLabel, campaignTypeLabel } from '@/lib/utils'
import type { Campaign, ProofItem } from '@/types'

async function getCampaign(slug: string): Promise<Campaign | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return data as Campaign | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const campaign = await getCampaign(slug)
  if (!campaign) return {}
  return {
    title: campaign.title,
    description: campaign.description ?? undefined,
  }
}

const categoryColors: Record<string, string> = {
  food: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
  transport: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  supplies: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  other: 'bg-zinc-400/10 text-zinc-400 border-zinc-400/20',
}

const typeStyles: Record<string, string> = {
  high_tip_drop: 'bg-green-400/10 text-green-400 border-green-400/30',
  cause_drop: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const campaign = await getCampaign(slug)
  if (!campaign) notFound()

  // Derive proof items from campaign fields.
  // Extend this array to support multiple images without changing CampaignProofs.
  const proofs: ProofItem[] = [
    ...(campaign.receipt_image_url
      ? [{ type: 'image' as const, url: campaign.receipt_image_url, label: 'Receipt' }]
      : []),
    ...(campaign.social_post_url
      ? [{ type: 'social' as const, url: campaign.social_post_url, label: 'Social Post' }]
      : []),
  ]

  const colorClass = categoryColors[campaign.category] ?? categoryColors.other
  const typeClass = typeStyles[campaign.campaign_type] ?? typeStyles.high_tip_drop

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            All Drops
          </Link>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${typeClass}`}>
                {campaignTypeLabel(campaign.campaign_type)}
              </span>
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${colorClass}`}
              >
                {categoryLabel(campaign.category)}
              </span>
              {campaign.platform && (
                <span className="rounded-full border border-zinc-800 px-3 py-0.5 text-xs text-zinc-500">
                  {campaign.platform}
                </span>
              )}
              <span className="text-xs text-zinc-600">
                {formatDate(campaign.date)}
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white">
              {campaign.title}
            </h1>
            {campaign.beneficiary && (
              <p className="mt-2 text-sm font-medium text-zinc-400">{campaign.beneficiary}</p>
            )}
            {campaign.description && (
              <p className="mt-3 text-base leading-relaxed text-zinc-400">
                {campaign.description}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Financials
            </p>
            <div className="space-y-2">
              {campaign.subtotal != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="tabular-nums text-white">
                    {formatCurrency(campaign.subtotal)}
                  </span>
                </div>
              )}
              {campaign.tip != null && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-green-400">Tip</span>
                  <span className="font-semibold tabular-nums text-green-400">
                    {formatCurrency(campaign.tip)}
                  </span>
                </div>
              )}
              <div className="my-2 border-t border-zinc-800" />
              <div className="flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-lg font-bold tabular-nums text-green-400">
                  {formatCurrency(campaign.total)}
                </span>
              </div>
            </div>

            {campaign.treasury_tx && (
              <div className="mt-4 border-t border-zinc-800 pt-4">
                <a
                  href={`https://solscan.io/tx/${campaign.treasury_tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-green-400 transition-colors hover:text-green-300"
                >
                  <ExternalLink size={14} />
                  Verify treasury tx on Solscan
                </a>
              </div>
            )}
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Drop Receipt &amp; Proof
            </p>
            <CampaignProofs proofs={proofs} />
          </div>

          {campaign.notes && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Notes
              </p>
              <p className="text-sm leading-relaxed text-zinc-400">{campaign.notes}</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
