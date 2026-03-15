import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('treasury_snapshots')
    .select('*')
    .order('snapshot_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return NextResponse.json(null)
  }

  return NextResponse.json(data)
}
