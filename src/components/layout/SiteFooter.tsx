import Link from 'next/link'
import { config } from '@/giggybank.config'

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">{config.name}</span>
              <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-xs font-semibold text-green-600">
                {config.token.symbol}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              {config.tagline}
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Navigate
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/mint" className="text-gray-600 transition-colors hover:text-slate-900">
                  Mint
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 transition-colors hover:text-slate-900">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/framework" className="text-gray-600 transition-colors hover:text-slate-900">
                  Framework
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 transition-colors hover:text-slate-900">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* External */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              External
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={config.treasury.solscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                >
                  Treasury
                  <span className="text-gray-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={config.token.dexScreenerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                >
                  DexScreener
                  <span className="text-gray-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={config.token.coingeckoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                >
                  CoinGecko
                  <span className="text-gray-400">↗</span>
                </a>
              </li>
              {config.social.twitter && (
                <li>
                  <a
                    href={config.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                  >
                    Twitter
                    <span className="text-gray-400">↗</span>
                  </a>
                </li>
              )}
              {config.social.tiktok && (
                <li>
                  <a
                    href={config.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                  >
                    TikTok
                    <span className="text-gray-400">↗</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href="https://github.com/jsigwart/impacttreasury-giggybank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                >
                  GitHub
                  <span className="text-gray-400">↗</span>
                </a>
              </li>
              <li>
                <span
                  title="Coming Soon"
                  className="inline-flex cursor-default items-center gap-1 text-gray-400"
                >
                  iOS App
                </span>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={config.token.bagsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                >
                  Bags.fm
                  <span className="text-gray-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/giggybank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-slate-900"
                >
                  Discord
                  <span className="text-gray-400">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            The first live deployment of{' '}
            <Link href="/framework" className="text-gray-600 transition-colors hover:text-slate-900">
              ImpactTreasury
            </Link>
            {' '}&mdash; turning token fees into real-world impact.
          </p>
          <a
            href={config.token.bagsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-xs text-gray-500 transition-colors hover:text-slate-900"
          >
            Powered by Bags.fm
          </a>
        </div>
      </div>
    </footer>
  )
}
