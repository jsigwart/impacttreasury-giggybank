import Link from 'next/link'
import { config } from '@/giggybank.config'

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-6xl px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">{config.name}</span>
              <span className="rounded bg-green-400/10 px-1.5 py-0.5 text-xs font-semibold text-green-400">
                {config.token.symbol}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              {config.tagline}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/mint" className="text-zinc-400 transition-colors hover:text-white">
                  Mint
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 transition-colors hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/framework" className="text-zinc-400 transition-colors hover:text-white">
                  Framework
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 transition-colors hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              {config.social.twitter && (
                <li>
                  <a
                    href={config.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                  >
                    Twitter
                    <span className="text-zinc-600">↗</span>
                  </a>
                </li>
              )}
              {config.social.tiktok && (
                <li>
                  <a
                    href={config.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                  >
                    TikTok
                    <span className="text-zinc-600">↗</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href="https://discord.gg/giggybank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                >
                  Discord
                  <span className="text-zinc-600">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/jsigwart/impacttreasury-giggybank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                >
                  GitHub
                  <span className="text-zinc-600">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={config.treasury.solscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                >
                  Treasury
                  <span className="text-zinc-600">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={config.token.dexScreenerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                >
                  DexScreener
                  <span className="text-zinc-600">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={config.token.coingeckoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                >
                  CoinGecko
                  <span className="text-zinc-600">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={config.token.bagsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
                >
                  Bags.fm
                  <span className="text-zinc-600">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-900 py-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            The first live deployment of{' '}
            <Link href="/framework" className="text-zinc-500 transition-colors hover:text-zinc-400">
              ImpactTreasury
            </Link>
            {' '}&mdash; turning token fees into real-world impact.
          </p>
          <a
            href={config.token.bagsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Powered by Bags.fm
          </a>
        </div>
      </div>
    </footer>
  )
}
