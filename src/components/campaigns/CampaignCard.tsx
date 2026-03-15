import Link from 'next/link'
import { formatCurrency, formatDateShort, categoryLabel, campaignTypeLabel } from '@/lib/utils'
import type { Campaign } from '@/types'

interface CampaignCardProps {
  campaign: Campaign
}

const typeStyles: Record<string, string> = {
  high_tip_drop: 'bg-green-400/10 text-green-400',
  cause_drop: 'bg-purple-400/10 text-purple-400',
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const typeClass = typeStyles[campaign.campaign_type] ?? typeStyles.high_tip_drop

  return (
    <Link
      href={`/campaigns/${campaign.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
    >
      {/* Type + Platform */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${typeClass}`}>
          {campaignTypeLabel(campaign.campaign_type)}
        </span>
        {campaign.platform && (
          <span className="text-xs text-zinc-600">{campaign.platform}</span>
        )}
      </div>

      {/* Receipt image */}
      {campaign.receipt_image_url && (
        <div className="mb-4 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={campaign.receipt_image_url}
            alt={campaign.title}
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="mb-1 font-semibold leading-snug text-white transition-colors group-hover:text-green-400">
        {campaign.title}
      </h3>

      {/* Beneficiary */}
      {campaign.beneficiary && (
        <p className="mb-1 text-xs font-medium text-zinc-500">
          {campaign.beneficiary}
        </p>
      )}

      {/* Description */}
      {campaign.description && (
        <p className="mb-4 line-clamp-2 text-sm text-zinc-500">
          {campaign.description}
        </p>
      )}

      {/* Footer: date + category + amounts */}
      <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">{formatDateShort(campaign.date)}</span>
          <span className="text-xs text-zinc-700">·</span>
          <span className="text-xs text-zinc-600">{categoryLabel(campaign.category)}</span>
        </div>
        <div className="text-right">
          {campaign.tip != null && campaign.tip > 0 ? (
            <>
              <span className="block font-semibold tabular-nums text-green-400">
                {formatCurrency(campaign.tip)}{' '}
                {campaign.campaign_type === 'high_tip_drop' ? 'surprise tip' : 'tip'}
              </span>
              <span className="block text-xs tabular-nums text-zinc-600">
                {formatCurrency(campaign.total)} total
              </span>
            </>
          ) : (
            <span className="font-semibold tabular-nums text-green-400">
              {formatCurrency(campaign.total)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
