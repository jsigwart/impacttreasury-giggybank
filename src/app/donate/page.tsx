'use client'

import { useState, useMemo, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { ArrowRight, CheckCircle, AlertCircle, Loader2, Heart } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { config } from '@/giggybank.config'

const PRESET_AMOUNTS = [0.1, 0.25, 0.5, 1]

export default function DonatePage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { setVisible } = useWalletModal()

  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [txSignature, setTxSignature] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const treasuryPubkey = useMemo(() => {
    try {
      return new PublicKey(config.treasury.wallet)
    } catch {
      return null
    }
  }, [])

  const handleSend = useCallback(async () => {
    if (!publicKey || !treasuryPubkey) return

    const solAmount = parseFloat(amount)
    if (isNaN(solAmount) || solAmount <= 0) {
      setErrorMsg('Enter a valid SOL amount.')
      setStatus('error')
      return
    }

    try {
      setStatus('sending')
      setErrorMsg('')

      const lamports = Math.round(solAmount * LAMPORTS_PER_SOL)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPubkey,
          lamports,
        }),
      )

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signature = await sendTransaction(transaction, connection)

      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        'confirmed',
      )

      setTxSignature(signature)
      setStatus('success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transaction failed'
      setErrorMsg(message)
      setStatus('error')
    }
  }, [publicKey, treasuryPubkey, amount, connection, sendTransaction])

  const reset = () => {
    setStatus('idle')
    setAmount('')
    setTxSignature('')
    setErrorMsg('')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-400/10">
              <Heart size={24} className="text-green-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Fund the Treasury
            </h1>
            <p className="text-sm text-zinc-400">
              Send SOL directly to the {config.name} public treasury.
              <br />
              Every contribution funds gig-worker High-Tip Drops.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            {status === 'success' ? (
              <div className="text-center">
                <CheckCircle size={40} className="mx-auto mb-4 text-green-400" />
                <p className="mb-2 font-semibold text-white">
                  Transaction confirmed!
                </p>
                <p className="mb-4 text-sm text-zinc-400">
                  Thank you for contributing to the treasury.
                </p>
                <a
                  href={`https://solscan.io/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 inline-flex items-center gap-2 text-sm text-green-400 transition-colors hover:text-green-300"
                >
                  View on Solscan <ArrowRight size={14} />
                </a>
                <div className="mt-4">
                  <button
                    onClick={reset}
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Amount input */}
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  placeholder="0.00"
                  className="mb-4 w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-lg font-mono text-white placeholder-zinc-600 outline-none transition-colors focus:border-green-400"
                />

                {/* Preset buttons */}
                <div className="mb-6 flex gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(String(preset))
                        if (status === 'error') setStatus('idle')
                      }}
                      className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                        amount === String(preset)
                          ? 'border-green-400 bg-green-400/10 text-green-400'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      {preset} SOL
                    </button>
                  ))}
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-900/10 p-3 text-sm text-red-400">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Send / Connect button */}
                {publicKey ? (
                  <button
                    onClick={handleSend}
                    disabled={status === 'sending' || !amount}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-400 py-3 font-semibold text-black transition-colors hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Confirming…
                      </>
                    ) : (
                      <>
                        Send SOL to Treasury
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setVisible(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-400 py-3 font-semibold text-black transition-colors hover:bg-green-300"
                  >
                    Connect Wallet to Donate
                    <ArrowRight size={16} />
                  </button>
                )}

                {/* Treasury info */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-zinc-600">
                    Sending to treasury:{' '}
                    <a
                      href={config.treasury.solscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 underline transition-colors hover:text-zinc-300"
                    >
                      {config.treasury.wallet.slice(0, 8)}…
                      {config.treasury.wallet.slice(-8)}
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
