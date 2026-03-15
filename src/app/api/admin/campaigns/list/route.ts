import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns ALL campaigns (including drafts) for admin use
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
