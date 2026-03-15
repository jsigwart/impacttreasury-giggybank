import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import AdminShell from '@/components/layout/AdminShell'
import CampaignForm from '@/components/admin/CampaignForm'
import { createClient } from '@/lib/supabase/server'
import type { Campaign } from '@/types'

async function getCampaign(id: string): Promise<Campaign | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()
  return data as Campaign | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const campaign = await getCampaign(id)
  return { title: campaign ? `Edit: ${campaign.title}` : 'Edit Campaign' }
}

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = await getCampaign(id)
  if (!campaign) notFound()

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Campaign</h1>
            <p className="mt-0.5 line-clamp-1 text-sm text-zinc-500">{campaign.title}</p>
          </div>
          {campaign.published && (
            <Link
              href={`/campaigns/${campaign.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <ExternalLink size={12} />
              View live
            </Link>
          )}
        </div>

        <div className="max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <CampaignForm campaign={campaign} />
        </div>
      </div>
    </AdminShell>
  )
}
