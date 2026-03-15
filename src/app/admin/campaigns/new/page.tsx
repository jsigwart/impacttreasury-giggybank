import type { Metadata } from 'next'
import AdminShell from '@/components/layout/AdminShell'
import CampaignForm from '@/components/admin/CampaignForm'

export const metadata: Metadata = { title: 'New Campaign — Admin' }

export default function NewCampaignPage() {
  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">New Campaign</h1>
          <p className="text-sm text-zinc-500">
            Create a new impact campaign receipt.
          </p>
        </div>

        <div className="max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <CampaignForm />
        </div>
      </div>
    </AdminShell>
  )
}
