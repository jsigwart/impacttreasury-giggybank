import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { config } from '@/giggybank.config'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s — ${config.name}`,
  },
  description: config.description,
  openGraph: {
    title: config.name,
    description: config.description,
    siteName: config.name,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="overflow-x-hidden bg-pink-50 text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
