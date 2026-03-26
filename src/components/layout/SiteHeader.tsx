'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { config } from '@/giggybank.config'
import ComingSoonLink from '@/components/ui/ComingSoonLink'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
            {config.name}
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/whitepaper"
            className="text-sm text-gray-600 transition-colors hover:text-slate-900"
          >
            Whitepaper
          </Link>
          <ComingSoonLink className="text-sm" position="below">
            Mint
          </ComingSoonLink>
          <a
            href={config.token.bagsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            Get {config.token.symbol}
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-gray-600 transition-colors hover:text-slate-900 sm:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/whitepaper"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-600 transition-colors hover:text-slate-900"
            >
              Whitepaper
            </Link>
            <ComingSoonLink className="text-sm" position="below">
              Mint
            </ComingSoonLink>
            <a
              href={config.token.bagsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-lg bg-green-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
            >
              Get {config.token.symbol}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
