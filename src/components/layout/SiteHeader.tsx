'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { config } from '@/giggybank.config'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-zinc-400 transition-colors hover:text-white sm:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-zinc-800 bg-black px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Drops
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              About
            </Link>
            <a
              href={config.token.bagsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-lg bg-green-400 px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
            >
              Get {config.token.symbol}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
