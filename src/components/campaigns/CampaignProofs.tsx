import { ExternalLink, ImageIcon } from 'lucide-react'
import type { ProofItem } from '@/types'

interface CampaignProofsProps {
  /**
   * Proof items derived from campaign fields.
   * Designed to accept an array so multi-image support can be added later
   * without refactoring this component — just pass more ProofItem objects.
   */
  proofs: ProofItem[]
}

export default function CampaignProofs({ proofs }: CampaignProofsProps) {
  if (proofs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 py-10 text-center">
        <ImageIcon className="mx-auto mb-2 text-zinc-700" size={24} />
        <p className="text-sm text-zinc-600">No proof attached yet.</p>
      </div>
    )
  }

  const imageProofs = proofs.filter((p) => p.type === 'image')
  const linkProofs = proofs.filter((p) => p.type !== 'image')

  return (
    <div className="space-y-4">
      {/* Image proofs */}
      {imageProofs.length > 0 && (
        <div
          className={
            imageProofs.length === 1
              ? 'block'
              : 'grid grid-cols-2 gap-3 md:grid-cols-3'
          }
        >
          {imageProofs.map((proof, i) => (
            <a
              key={i}
              href={proof.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-xl border border-zinc-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proof.url}
                alt={proof.label ?? 'Receipt proof'}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ maxHeight: imageProofs.length === 1 ? '400px' : '200px' }}
              />
              {proof.label && (
                <div className="border-t border-zinc-800 bg-zinc-900 px-3 py-2">
                  <span className="text-xs text-zinc-500">{proof.label}</span>
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Link / social proofs */}
      {linkProofs.map((proof, i) => (
        <a
          key={i}
          href={proof.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:border-zinc-700"
        >
          <ExternalLink size={16} className="shrink-0 text-zinc-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">
              {proof.label ?? (proof.type === 'social' ? 'Social Post' : 'Link')}
            </p>
            <p className="truncate text-xs text-zinc-500">{proof.url}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
