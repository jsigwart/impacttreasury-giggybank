import Link from 'next/link'
import { ArrowRight, Coins, Gift, Eye } from 'lucide-react'
import { Tweet } from 'react-tweet'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { config } from '@/giggybank.config'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-zinc-800 px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Powered by Bags.fm fee-sharing
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Bags App Genesis Cohort
            </div>
          </div>
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            High-Tip Drops
            <br />
            <span className="text-green-400">for gig workers.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-zinc-400">
            Turning{' '}
            <span className="font-semibold text-white">{config.token.symbol}</span>{' '}
            trading fees into surprise tips for gig workers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={config.token.bagsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-green-400 px-6 py-3 font-semibold text-black transition-colors hover:bg-green-300"
            >
              Trade {config.token.symbol}
              <ArrowRight size={16} />
            </a>
            {config.appStoreUrl && (
              <a
                href={config.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-white transition-colors hover:border-zinc-500"
              >
                Get the App
              </a>
            )}
          </div>
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Token Address
            </p>
            <p className="mt-1 font-mono text-sm text-zinc-400 break-all">
              {config.token.address}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-zinc-800 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-white">
            How High-Tip Drops work
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            A transparent pipeline from token trade to worker tip.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Coins,
                step: '01',
                title: 'Token fees power the treasury',
                body: `Every ${config.token.symbol} trade on Bags.fm generates fee-sharing revenue. It flows directly into a public, on-chain treasury wallet — visible to anyone.`,
              },
              {
                icon: Gift,
                step: '02',
                title: 'A gig worker receives the surprise tip',
                body: `GiggyBank places a real order on a gig platform with an outsized tip funded by the treasury. The platform determines which worker receives the job, and that worker receives the full tip on completion.`,
              },
              {
                icon: Eye,
                step: '03',
                title: 'Every drop is public proof',
                body: `Receipts, social posts, and treasury transaction hashes are published for every drop. Verifiable by anyone, on-chain, forever.`,
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <div
                key={step}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-green-400/10 p-2.5">
                    <Icon size={20} className="text-green-400" />
                  </div>
                  <span className="text-4xl font-bold tabular-nums text-zinc-800">
                    {step}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treasury CTA */}
      <section className="border-b border-zinc-800 bg-zinc-950 px-4 py-16 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Public Treasury Wallet
        </p>
        <p className="mb-4 text-lg font-mono text-zinc-400 break-all max-w-xl mx-auto">
          {config.treasury.wallet}
        </p>
        <a
          href={config.treasury.solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-green-400 transition-colors hover:text-green-300"
        >
          Verify treasury on Solscan <ArrowRight size={14} />
        </a>
      </section>

      {/* Hackathon Tweet */}
      <section className="border-t border-zinc-800 px-4 py-16">
        <div className="mx-auto max-w-xl">
          <div className="flex justify-center rounded-xl bg-white p-4" data-theme="light">
            <Tweet id="2033733353019765129" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
