import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { balance_sol, balance_usd, sol_price } = body

  if (!balance_sol || !balance_usd) {
    return NextResponse.json(
      { error: 'balance_sol and balance_usd are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('treasury_snapshots')
    .insert({ balance_sol, balance_usd, sol_price: sol_price ?? null })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data, { status: 201 })
}
