import Link from 'next/link'
import { ArrowRight, Coins, Gift, Eye, Sparkles } from 'lucide-react'
import { Tweet } from 'react-tweet'
import TikTokEmbed from '@/components/TikTokEmbed'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { config } from '@/giggybank.config'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-gray-200 px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Powered by Bags.fm fee-sharing
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Bags App Genesis Cohort
            </div>
          </div>
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            High-Tip Drops
            <br />
            <span className="text-green-500">for gig workers.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-gray-600">
            Turning{' '}
            <span className="font-semibold text-slate-900">{config.token.symbol}</span>{' '}
            trading fees into surprise tips for gig workers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={config.token.bagsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
            >
              Trade {config.token.symbol}
              <ArrowRight size={16} />
            </a>
            {config.appStoreUrl && (
              <a
                href={config.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-slate-900 transition-colors hover:border-gray-400"
              >
                Get the App
              </a>
            )}
          </div>
          <div className="mt-6">
            <a
              href={`https://solscan.io/token/${config.token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-sm text-gray-500 break-all transition-colors hover:text-green-500"
            >
              {config.token.address}
            </a>
            <div className="mt-2 flex items-center justify-center gap-4 text-sm">
              <a
                href={config.token.dexScreenerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-green-500"
              >
                DexScreener
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TikTok Video */}
      <section className="border-b border-gray-200 px-4 py-16">
        <div className="mx-auto max-w-xl">
          <div className="flex justify-center rounded-xl bg-gray-50 p-4">
            <TikTokEmbed videoId="7619036406349876494" username="giggybankapp" />
          </div>
        </div>
      </section>

      {/* Hackathon Tweet */}
      <section className="border-b border-gray-200 px-4 py-16">
        <div className="mx-auto max-w-xl">
          <div className="flex justify-center rounded-xl bg-gray-50 p-4" data-theme="light">
            <Tweet id="2033733353019765129" />
          </div>
        </div>
      </section>

      {/* Honorary PFP */}
      <section className="border-b border-gray-200 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div>
              <span className="mb-4 inline-block rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                Honorary PFP Mint
              </span>
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Mint the culture.
              </h2>
              <p className="mb-4 leading-relaxed text-gray-600">
                Any holder can mint an Honorary PFP — an on-chain NFT that composites
                their own image with the {config.name} mascot. Your image. Your style.
                Recognizably {config.name}.
              </p>
              <p className="mb-6 leading-relaxed text-gray-600">
                Every mint fee goes directly to the treasury, funding more tips for
                gig workers. The community grows through culture, not ad spend.
              </p>
              <Link
                href="/mint"
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                <Sparkles size={14} />
                Mint an Honorary
              </Link>
            </div>
            <div className="space-y-3">
              {[
                'Your image composited with the GiggyBank mascot',
                'Minted as an NFT directly to your Solana wallet',
                'Mint fees fund the High-Tip Drop treasury',
                'Every honorary is unique — nobody else has yours',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-gray-200 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-slate-900">
            How High-Tip Drops work
          </h2>
          <p className="mb-12 text-center text-sm text-gray-500">
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
                className="rounded-xl border border-gray-200 bg-gray-50 p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-green-500/10 p-2.5">
                    <Icon size={20} className="text-green-500" />
                  </div>
                  <span className="text-4xl font-bold tabular-nums text-gray-200">
                    {step}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The flywheel */}
      <section className="border-b border-gray-200 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-slate-900">The loop</h2>
          <p className="mb-10 text-sm text-gray-500">
            Each piece reinforces the others. Trading funds tips. Tips build trust.
            Trust grows the community. The community trades more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              { step: 'Trade', detail: `Buy or sell $${config.token.symbol}` },
              { step: 'Fees', detail: 'Flow to the treasury' },
              { step: 'Mint', detail: 'Honorary PFPs grow the culture' },
              { step: 'Tip', detail: 'Real drops for gig workers' },
              { step: 'Prove', detail: 'Every drop publicly verified' },
              { step: 'Grow', detail: 'Trust attracts more supporters' },
            ].map(({ step, detail }, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
                  <p className="font-semibold text-slate-900">{step}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{detail}</p>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight size={14} className="shrink-0 text-gray-300" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/whitepaper"
              className="text-sm text-green-600 transition-colors hover:text-green-700"
            >
              Read the full whitepaper →
            </Link>
          </div>
        </div>
      </section>

      {/* Treasury CTA */}
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-16 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          Public Treasury Wallet
        </p>
        <p className="mb-4 text-lg font-mono text-gray-600 break-all max-w-xl mx-auto">
          {config.treasury.wallet}
        </p>
        <a
          href={config.treasury.solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-green-500 transition-colors hover:text-green-600"
        >
          Verify treasury on Solscan <ArrowRight size={14} />
        </a>
      </section>

      <SiteFooter />
    </div>
  )
}
