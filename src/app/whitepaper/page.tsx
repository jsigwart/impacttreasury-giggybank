import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Rocket, Image, Users, Coins, Heart, Sparkles, Film } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { config } from '@/giggybank.config'

export const metadata: Metadata = {
  title: 'Whitepaper',
  description:
    'The GiggyBank thesis: launch a coin, mint honoraries that grow the community, and use fees to generously tip gig workers.',
}

export default function WhitepaperPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-16">

          {/* Hero */}
          <div className="border-b border-zinc-200 pb-16 text-center">
            <span className="mb-4 inline-block rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">
              Whitepaper
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900">
              Launch a coin.
              <br />
              Mint the culture.
              <br />
              <span className="text-green-600">Tip generously.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-zinc-600">
              The {config.name} thesis — how a token, community-minted honoraries,
              and transparent fee routing create a self-sustaining cycle of impact
              and culture.
            </p>
          </div>

          {/* The Thesis */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">The thesis</h2>
            <p className="leading-relaxed text-zinc-600">
              Most token projects promise impact but deliver nothing verifiable.{' '}
              <span className="font-semibold text-slate-900">{config.name}</span> is
              built on a different premise: launch a coin on Bags.fm, let the
              community mint honoraries that merge their own IP with the
              project&apos;s mascot, and route every fee the token generates into
              generous, documented tips for gig workers.
            </p>
            <p className="leading-relaxed text-zinc-600">
              The result is a loop — trading activity funds the treasury, the
              treasury funds real-world impact, the impact grows the community,
              and the community fuels more trading activity. Every step is public,
              every tip is provable, and every honorary is uniquely the
              holder&apos;s own.
            </p>
          </section>

          {/* Step 1 — Launch a coin */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Rocket size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. Launch a coin</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              {config.name} launches on{' '}
              <a
                href={config.token.bagsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700"
              >
                Bags.fm
              </a>
              , a Solana-based trading platform with built-in fee-sharing. Every
              time someone buys or sells{' '}
              <span className="font-semibold text-slate-900">${config.token.symbol}</span>,
              a portion of the trading fee is automatically routed to the
              project&apos;s{' '}
              <a
                href={config.treasury.solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700"
              >
                public treasury wallet
              </a>
              .
            </p>
            <p className="leading-relaxed text-zinc-600">
              There&apos;s no fundraising round, no VC allocation, no backroom
              deals. The treasury fills organically from real trading volume. The
              more the community trades, the more impact gets funded.
            </p>
          </section>

          {/* Step 2 — Mint an Honorary */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Image size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. Mint an honorary</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              Any holder can{' '}
              <Link
                href="/mint"
                className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700"
              >
                mint an Honorary PFP
              </Link>
              {' '}— an on-chain NFT that composites their own image with the{' '}
              {config.name} mascot. The IP automatically grows because every
              honorary carries the project&apos;s visual identity into a new
              context, attached to a new person, in a new style.
            </p>
            <p className="leading-relaxed text-zinc-600">
              This is the key insight:{' '}
              <span className="font-semibold text-slate-900">
                the community gets a recognizable asset that is genuinely theirs
              </span>
              . They can make memes with it, use it as a PFP, remix it however
              they want. It shows the {config.name} IP — the mascot is right
              there — but it&apos;s still their own style, their own image, their
              own honorary. Nobody else has the same one.
            </p>
            <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-5">
              <span className="mb-3 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
                Why this matters
              </span>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <span>
                    Every honorary is a piece of content that spreads the brand
                    organically — no marketing budget needed
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <span>
                    Memes made from honoraries are unique but still recognizably {config.name} —
                    the IP compounds with every remix
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <span>
                    Holders have genuine ownership — it&apos;s their image, their
                    style, their honorary, minted to their wallet
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <span>
                    Mint fees go directly to the treasury, funding more tips
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 3 — Community grows itself */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Users size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. The community grows itself</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              Traditional token projects spend treasury funds on paid promotions
              and influencer deals. {config.name} inverts this. The honorary
              system turns every holder into a voluntary brand ambassador — not
              because they&apos;re paid to be, but because their PFP naturally
              carries the {config.name} identity.
            </p>
            <p className="leading-relaxed text-zinc-600">
              When a holder posts a meme using their honorary, it&apos;s content
              that shows the mascot in their own creative style. When someone
              asks &quot;what&apos;s that PFP?&quot; the answer leads back to the
              project. The community grows through culture, not ad spend.
            </p>

            {/* Sloperator Engine */}
            <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Film size={18} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">The Sloperator Engine</h3>
              </div>
              <p className="leading-relaxed text-zinc-600">
                The Sloperator Engine takes community-driven content to the next
                level. Anyone can submit a script — a skit, a meme concept, a
                short storyline — and pay with{' '}
                <span className="font-semibold text-slate-900">${config.token.symbol}</span>{' '}
                tokens to have it produced as a video featuring the project&apos;s
                IP and characters. Video generation has real compute costs —
                the token payment covers those fees while also creating
                natural demand for {config.token.symbol}.
              </p>
              <p className="leading-relaxed text-zinc-600">
                Holders who minted honorary NFTs can even cast their own
                characters in the videos, turning their unique composited PFPs
                into animated stars. The result is a constant stream of
                community-authored content that spreads {config.name} memes,
                lore, and identity across social feeds organically.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-1 shrink-0 text-green-500" />
                  <span className="text-sm text-zinc-600">
                    Submit a script and pay in{' '}
                    <span className="font-semibold text-slate-900">${config.token.symbol}</span>{' '}
                    — the engine handles production
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-1 shrink-0 text-green-500" />
                  <span className="text-sm text-zinc-600">
                    Feature official IP characters or your own honorary NFT persona
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-1 shrink-0 text-green-500" />
                  <span className="text-sm text-zinc-600">
                    Every video spreads the brand — memes, skits, and lore that
                    grow mindshare
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 4 — Fees fund generous tips */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Heart size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">4. The team tips generously</h2>
            </div>
            <p className="leading-relaxed text-zinc-600">
              Here&apos;s where the loop closes. The fees generated from trading
              and minting don&apos;t sit idle and they don&apos;t line anyone&apos;s
              pockets. The {config.name} team uses them to place{' '}
              <span className="font-semibold text-slate-900">High-Tip Drops</span> —
              real orders on gig platforms like DoorDash, Instacart, and Lyft
              with outsized, generous tips that make a real difference in a
              worker&apos;s day.
            </p>
            <p className="leading-relaxed text-zinc-600">
              Every drop is documented: the platform, the order, the tip amount,
              the receipt, and the on-chain treasury transaction hash. Nothing is
              hidden. If it can&apos;t be proven, it doesn&apos;t get posted.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-5">
                <span className="mb-3 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
                  High-Tip Drops
                </span>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Real orders on real gig platforms with generous tips funded
                  entirely by the treasury. The platform assigns the worker —
                  they get a surprise bonus they never expected.
                </p>
              </div>
              <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-5">
                <span className="mb-3 inline-block rounded bg-purple-400/10 px-2 py-0.5 text-xs font-semibold text-purple-400">
                  Cause Drops
                </span>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Donations to shelters, rescues, and community organizations —
                  same transparency standard, same public proof layer.
                </p>
              </div>
            </div>
          </section>

          {/* The flywheel */}
          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2.5">
                <Sparkles size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">The flywheel</h2>
            </div>
            <p className="mb-6 leading-relaxed text-zinc-600">
              Each piece reinforces the others. This isn&apos;t a roadmap with
              vague milestones — it&apos;s a system that compounds:
            </p>
            <div className="space-y-3">
              {[
                {
                  step: 'Trade',
                  detail: `Buy or sell $${config.token.symbol} on Bags.fm — fees flow to the treasury`,
                },
                {
                  step: 'Mint',
                  detail: 'Mint an honorary — your image + the mascot, owned by you, recognized by everyone',
                },
                {
                  step: 'Meme',
                  detail: `Create content with your honorary — the ${config.name} IP spreads in your style`,
                },
                {
                  step: 'Grow',
                  detail: 'New people discover the project through your content and join the community',
                },
                {
                  step: 'Tip',
                  detail: 'The team uses accumulated fees to drop generous tips on real gig workers',
                },
                {
                  step: 'Prove',
                  detail: 'Every tip is documented with receipts and on-chain proof — building trust and attracting more supporters',
                },
              ].map(({ step, detail }, i) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900">{step}</span>
                    <span className="text-zinc-500"> — </span>
                    <span className="text-zinc-600">{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team commitment */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Team commitment</h2>
            <p className="leading-relaxed text-zinc-600">
              The team allocation is locked for{' '}
              <span className="font-semibold text-slate-900">
                {config.team.lockupMonths} months
              </span>
              . This project doesn&apos;t exist to cash out — it exists to prove
              that a token community can fund genuine, verifiable good in the
              real world. The treasury is{' '}
              <a
                href={config.treasury.solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-600 underline underline-offset-2 hover:text-green-700"
              >
                public
              </a>
              , every drop is documented, and every claim is backed by proof.
            </p>
          </section>

          {/* CTA */}
          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Ready to join?
            </p>
            <p className="mb-4 text-lg font-bold text-slate-900">
              Trade the token. Mint your honorary. Be part of the impact.
            </p>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-zinc-600">
              Every trade funds the treasury. Every honorary grows the culture.
              Every tip changes someone&apos;s day.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={config.token.bagsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-300"
              >
                Trade {config.token.symbol}
                <ArrowRight size={14} />
              </a>
              <Link
                href="/mint"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
              >
                Mint an Honorary
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
