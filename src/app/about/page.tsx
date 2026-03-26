import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Coins, Gift, Eye, Smartphone, Shield, Repeat, Sparkles } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { config } from '@/giggybank.config'

export const metadata: Metadata = {
  title: 'About',
  description: config.description,
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-16">

          {/* Hero */}
          <div className="border-b border-zinc-200 pb-16 text-center">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Powered by Bags.fm fee-sharing
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Bags App Genesis Cohort
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900">
              High-Tip Drops
              <br />
              <span className="text-green-600">for gig workers.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-zinc-600">
              Turning{' '}
              <span className="font-semibold text-slate-900">{config.token.symbol}</span>{' '}
              trading fees into surprise tips for gig workers — verified on-chain, every single time.
            </p>
          </div>

          {/* Bags Genesis Cohort */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Bags App Genesis Cohort</h2>
            <p className="leading-relaxed text-zinc-600">
              GiggyBank was accepted into the{' '}
              <span className="font-semibold text-slate-900">Bags App Genesis Cohort</span> —
              the first cohort of the Bags.fm hackathon. Selected from applicants building on
              the Bags platform, GiggyBank is proving that token communities can create real,
              measurable impact beyond speculation. The genesis cohort represents the earliest
              projects shaping what Bags-powered apps look like.
            </p>
          </section>

          {/* Token fees fund high tips */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Community growth funds high tips</h2>
            <p className="leading-relaxed text-zinc-600">
              As the{' '}
              <span className="font-semibold text-slate-900">{config.token.symbol}</span>{' '}
              community grows — through trading on Bags.fm, minting honorary PFPs, and engaging
              with the project — fee-sharing revenue flows into a public, on-chain treasury
              wallet. That treasury is dedicated to one purpose:{' '}
              <span className="font-semibold text-slate-900">
                funding High-Tip Drops for gig workers.
              </span>
            </p>
            <p className="leading-relaxed text-zinc-600">
              GiggyBank places a real order on a delivery or rideshare platform — DoorDash,
              Instacart, Lyft — with an outsized tip funded entirely by the treasury. The platform
              determines which worker receives the job, and that worker receives the full tip on
              completion. Not a grant, not a loan — a real tip at a scale gig workers rarely see.
            </p>
            <p className="leading-relaxed text-zinc-600">
              The bigger the community grows, the more fees the treasury collects, and the more
              High-Tip Drops gig workers receive. Every trade, every mint, every interaction
              contributes to the next tip.
            </p>
          </section>

          {/* How it works */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">How High Tips are funded</h2>
            <p className="mb-2 text-sm text-zinc-500">
              A transparent pipeline from token trade to worker tip.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: Coins,
                  title: 'Token fees power the treasury',
                  body: `Every ${config.token.symbol} trade on Bags.fm generates fee-sharing revenue. It flows directly into a public, on-chain treasury wallet — visible to anyone.`,
                },
                {
                  icon: Gift,
                  title: 'A gig worker receives the surprise tip',
                  body: 'GiggyBank places a real order on a gig platform with an outsized tip funded by the treasury. The platform determines which worker receives the job, and that worker receives the full tip on completion.',
                },
                {
                  icon: Eye,
                  title: 'Every drop is public proof',
                  body: 'Receipts, social posts, and treasury transaction hashes are published for every drop. Verifiable by anyone, on-chain, forever.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-green-100 p-1.5">
                    <Icon size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-slate-900">{title}</p>
                    <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Drop types */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Two types of drops</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <span className="mb-3 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  High-Tip Drop
                </span>
                <p className="text-sm leading-relaxed text-zinc-600">
                  A real order placed on a gig platform with an outsized tip funded by the treasury.
                  The platform routes the job to whichever worker accepts it — that worker receives the
                  full tip. Documented with a receipt and on-chain treasury transaction.
                </p>
              </div>
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
                <span className="mb-3 inline-block rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                  Cause Drop
                </span>
                <p className="text-sm leading-relaxed text-zinc-600">
                  A donation to an organization, shelter, rescue, or community cause — funded by the
                  same treasury, held to the same proof standard. Receipt, beneficiary, and treasury
                  transaction published for every one.
                </p>
              </div>
            </div>
            <p className="leading-relaxed text-zinc-600">
              Every drop includes:
            </p>
            <ul className="space-y-2 text-zinc-600">
              {[
                'A delivery record — platform, order details, and tip amount',
                'A financial breakdown — subtotal, tip amount, and total',
                'A receipt image — proof of delivery',
                'A treasury transaction hash — on-chain proof of disbursement',
                'A social post — community-facing verification',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mint an Honorary */}
          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Sparkles size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Mint an Honorary PFP</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              Upload your image, pay with{' '}
              <span className="font-semibold text-slate-900">{config.token.symbol}</span>, and
              receive a unique GiggyBank honorary profile picture — an on-chain NFT that merges
              your image with the GiggyBank mascot. It&apos;s your membership in the community and
              a stake in the movement.
            </p>
            <p className="mb-6 leading-relaxed text-zinc-600">
              The framework gives creators a choice: minting can be configured to either{' '}
              <span className="font-semibold text-slate-900">pay with the token</span> (sending
              it to the treasury) or{' '}
              <span className="font-semibold text-slate-900">burn the token</span> (removing it
              from supply permanently). It&apos;s a single config toggle — the creator decides
              which model fits their community best.
            </p>
            <Link
              href="/mint"
              className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
            >
              Mint Your Honorary
              <ArrowRight size={14} />
            </Link>
          </section>

          {/* iOS App */}
          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Smartphone size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The GiggyBank iOS App</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              The GiggyBank iOS app lets the community track High-Tip Drops in real time,
              browse the public proof record for every drop, and follow treasury activity.
              GiggyBank places the orders — the gig platform routes the job to a worker, who
              receives the surprise tip on completion.
            </p>
            <p className="mb-6 leading-relaxed text-zinc-600">
              What you see on this dashboard is the public ledger of every drop the app has
              facilitated — a permanent record that can&apos;t be edited or hidden.
            </p>
            {config.appStoreUrl && (
              <a
                href={config.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
              >
                Download on the App Store
                <ArrowRight size={14} />
              </a>
            )}
          </section>

          {/* Transparency */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Shield size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Transparency commitment</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              Every drop on this site is manually entered by the GiggyBank team and linked to
              verifiable on-chain evidence. The treasury wallet is public. The transaction hashes
              are public. The receipts are public. If something can&apos;t be proven, it
              doesn&apos;t get posted.
            </p>
            <p className="leading-relaxed text-zinc-600">
              Team allocation is locked for{' '}
              <span className="font-semibold text-slate-900">
                {config.team.lockupMonths} months
              </span>
              . This isn&apos;t a project that cashes out. It&apos;s a system that pays it
              forward.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={config.treasury.solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 transition-colors hover:text-green-700"
              >
                View treasury wallet ↗
              </a>
              <Link
                href="/campaigns"
                className="text-sm text-zinc-500 transition-colors hover:text-slate-900"
              >
                See all drops →
              </Link>
            </div>
          </section>

          {/* Open-source framework */}
          <section className="rounded-xl border border-dashed border-zinc-300 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-zinc-100 p-2.5">
                <Repeat size={20} className="text-zinc-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Clone the framework</h2>
            </div>
            <p className="mb-4 leading-relaxed text-zinc-600">
              GiggyBank is built on an{' '}
              <Link href="/framework" className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700">
                open-source framework
              </Link>
              {' '}designed to help token communities grow. Fork the repo, update a single config
              file, and your community gets honorary NFT minting, a transparent proof layer, and
              tools to build real engagement — all out of the box.
            </p>
            <p className="mb-4 leading-relaxed text-zinc-600">
              The framework makes it easy for any token project to give their holders a way to
              mint honorary PFPs, build community identity, and channel the fees generated from
              that community growth into real-world impact — just like GiggyBank does with
              High-Tip Drops. Creators can configure minting to accept payment in their token
              or burn it on mint — a single toggle in the config that lets each project choose
              the tokenomics model that works for their community.
            </p>
            <div className="mt-4">
              <Link
                href="/framework"
                className="text-sm text-green-600 transition-colors hover:text-green-700"
              >
                Learn more about the framework →
              </Link>
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
