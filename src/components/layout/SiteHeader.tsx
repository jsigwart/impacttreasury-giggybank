import Link from 'next/link'
import { config } from '@/giggybank.config'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            {config.name}
          </span>
          <span className="rounded bg-green-400/10 px-1.5 py-0.5 text-xs font-semibold text-green-400">
            {config.token.symbol}
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Drops
          </Link>
          <Link
            href="/about"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            About
          </Link>
          <a
            href={config.token.bagsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-400 px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
          >
            Get {config.token.symbol}
          </a>
        </nav>
      </div>
    </header>
  )
}
