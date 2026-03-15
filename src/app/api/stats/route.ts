import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Stats } from '@/types'

export async function GET() {
  const supabase = await createClient()

  const [{ data: campaigns }, { data: snapshot }] = await Promise.all([
    supabase
      .from('campaigns')
      .select('total, tip, subtotal')
      .eq('published', true),
    supabase
      .from('treasury_snapshots')
      .select('balance_usd')
      .order('snapshot_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const rows = campaigns ?? []

  const stats: Stats = {
    campaignCount: rows.length,
    totalSpent: rows.reduce((sum, c) => sum + (c.total ?? 0), 0),
    totalTipped: rows.reduce((sum, c) => sum + (c.tip ?? 0), 0),
    totalSubtotal: rows.reduce((sum, c) => sum + (c.subtotal ?? 0), 0),
    biggestSingleTip: rows.length > 0 ? Math.max(...rows.map((c) => c.tip ?? 0)) : 0,
    latestTreasuryBalance: snapshot?.balance_usd ?? null,
    treasuryDisbursed: rows.reduce((sum, c) => sum + (c.total ?? 0), 0),
  }

  return NextResponse.json(stats)
}
