export type CampaignType = 'high_tip_drop' | 'cause_drop'

export interface Campaign {
  id: string
  slug: string
  title: string
  description: string | null
  date: string
  campaign_type: CampaignType
  beneficiary: string | null
  category: 'food' | 'transport' | 'supplies' | 'other'
  platform: string | null
  subtotal: number | null
  tip: number | null
  total: number
  treasury_tx: string | null
  receipt_image_url: string | null
  social_post_url: string | null
  notes: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface TreasurySnapshot {
  id: string
  balance_sol: number
  balance_usd: number
  sol_price: number | null
  snapshot_at: string
}

export interface Stats {
  campaignCount: number
  totalSpent: number
  totalTipped: number
  totalSubtotal: number
  biggestSingleTip: number
  latestTreasuryBalance: number | null
  treasuryDisbursed: number
}

/**
 * Proof items are derived from campaign fields and passed as an array
 * to CampaignProofs. Adding multi-image support = append more items here.
 */
export interface ProofItem {
  type: 'image' | 'link' | 'social'
  url: string
  label?: string
}

export interface ProjectConfig {
  name: string
  tagline: string
  cause: string
  description: string
  token: {
    symbol: string
    address: string
    bagsUrl: string
  }
  treasury: {
    wallet: string
    solscanUrl: string
  }
  team: {
    lockupMonths: number
  }
  theme: {
    accentColor: string
  }
  social: {
    twitter: string
    telegram: string
  }
  appStoreUrl: string
}
