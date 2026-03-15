'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { config } from '@/giggybank.config'
import {
  LayoutDashboard,
  Megaphone,
  Wallet,
  LogOut,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/admin/treasury', label: 'Treasury', icon: Wallet },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="border-b border-zinc-800 px-5 py-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-white">{config.name}</span>
            <span className="rounded bg-green-400/10 px-1.5 py-0.5 text-xs font-semibold text-green-400">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          <div className="mt-auto pt-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-white"
            >
              <ExternalLink size={16} />
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-red-400"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
