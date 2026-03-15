import { Gift } from 'lucide-react'
import CampaignCard from './CampaignCard'
import type { Campaign } from '@/types'

interface CampaignGridProps {
  campaigns: Campaign[]
  emptyMessage?: string
}

export default function CampaignGrid({
  campaigns,
  emptyMessage = 'No drops yet.',
}: CampaignGridProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 py-20 text-center">
        <Gift className="mx-auto mb-3 text-zinc-700" size={28} />
        <p className="text-sm font-medium text-zinc-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  )
}
