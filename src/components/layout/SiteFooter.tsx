import Link from 'next/link'
import { config } from '@/giggybank.config'

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="font-bold text-white">{config.name}</span>
              <span className="rounded bg-green-400/10 px-1.5 py-0.5 text-xs font-semibold text-green-400">
                {config.token.symbol}
              </span>
            </div>
            <p className="max-w-xs text-sm text-zinc-500">{config.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
            <Link href="/dashboard" className="transition-colors hover:text-white">
              Dashboard
            </Link>
            <Link href="/campaigns" className="transition-colors hover:text-white">
              Drops
            </Link>
            <Link href="/framework" className="transition-colors hover:text-white">
              Framework
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <a
              href={config.treasury.solscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Treasury ↗
            </a>
            {config.social.twitter && (
              <a
                href={config.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                Twitter ↗
              </a>
            )}
            {config.appStoreUrl && (
              <a
                href={config.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                iOS App ↗
              </a>
            )}
            <a
              href={config.token.bagsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Powered by Bags.fm ↗
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-900 pt-6 text-xs text-zinc-600">
          Team allocation locked for {config.team.lockupMonths} months. All campaign
          disbursements are publicly verifiable on Solana.{' '}
          Built on{' '}
          <Link href="/framework" className="text-zinc-500 transition-colors hover:text-zinc-400">
            ImpactTreasury
          </Link>
          .
        </div>
      </div>
    </footer>
  )
}
