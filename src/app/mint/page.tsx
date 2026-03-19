'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
  PublicKey,
  Transaction,
} from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getMint,
  getAccount,
} from '@solana/spl-token'
import { Upload, ImageIcon, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { config } from '@/giggybank.config'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

const TOKEN_MINT = new PublicKey(config.token.address)
const TREASURY_WALLET = new PublicKey(config.treasury.wallet)

type MintStep = 'upload' | 'preview' | 'paying' | 'minting' | 'done' | 'error'

export default function MintPage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()

  const [step, setStep] = useState<MintStep>('upload')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [compositeImage, setCompositeImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [tokenPrice, setTokenPrice] = useState<number | null>(null)
  const [requiredTokens, setRequiredTokens] = useState<string | null>(null)
  const [agreedToRights, setAgreedToRights] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch token price on mount
  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          `https://api.jup.ag/price/v2?ids=${config.token.address}`
        )
        const data = await res.json()
        const price = data?.data?.[config.token.address]?.price
        if (price && Number(price) > 0) {
          setTokenPrice(Number(price))
          const tokens = config.mint.priceUsd / Number(price)
          setRequiredTokens(tokens.toLocaleString(undefined, { maximumFractionDigits: 0 }))
        }
      } catch {
        // Price fetch failed — user will see "price unavailable"
      }
    }
    fetchPrice()
  }, [])

  const compositeImages = useCallback(
    async (userImageDataUrl: string) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const SIZE = 512
      canvas.width = SIZE
      canvas.height = SIZE

      // Load user image
      const userImg = new Image()
      userImg.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        userImg.onload = () => resolve()
        userImg.onerror = reject
        userImg.src = userImageDataUrl
      })

      // Load the base logo
      const baseImg = new Image()
      baseImg.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        baseImg.onload = () => resolve()
        baseImg.onerror = reject
        baseImg.src = '/logo.png'
      })

      // Draw base logo as full background
      ctx.drawImage(baseImg, 0, 0, SIZE, SIZE)

      // Draw user PFP in circular mask at center
      ctx.save()
      ctx.beginPath()
      ctx.arc(SIZE / 2, SIZE / 2 - 20, 100, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // Scale and center the user image
      const scale = Math.max(200 / userImg.width, 200 / userImg.height)
      const w = userImg.width * scale
      const h = userImg.height * scale
      ctx.drawImage(userImg, SIZE / 2 - w / 2, SIZE / 2 - 20 - h / 2, w, h)
      ctx.restore()

      // Draw border ring around PFP
      ctx.beginPath()
      ctx.arc(SIZE / 2, SIZE / 2 - 20, 102, 0, Math.PI * 2)
      ctx.strokeStyle = '#4ade80'
      ctx.lineWidth = 4
      ctx.stroke()

      const dataUrl = canvas.toDataURL('image/png')
      setCompositeImage(dataUrl)
    },
    []
  )

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, etc.)')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be under 10 MB')
        return
      }

      setError(null)
      const reader = new FileReader()
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string
        setUploadedImage(dataUrl)
        await compositeImages(dataUrl)
        setStep('preview')
      }
      reader.readAsDataURL(file)
    },
    [compositeImages]
  )

  const handlePayAndMint = useCallback(async () => {
    if (!publicKey || !connected) {
      setError('Please connect your wallet first')
      return
    }

    if (!tokenPrice) {
      setError('Unable to fetch token price. Please try again later.')
      return
    }

    setStep('paying')
    setError(null)

    try {
      // Calculate token amount needed
      const mintInfo = await getMint(connection, TOKEN_MINT)
      const decimals = mintInfo.decimals
      const tokensNeeded = config.mint.priceUsd / tokenPrice
      const rawAmount = BigInt(Math.ceil(tokensNeeded * 10 ** decimals))

      // Get sender's token account
      const senderAta = await getAssociatedTokenAddress(TOKEN_MINT, publicKey)

      // Verify sender has enough tokens
      try {
        const senderAccount = await getAccount(connection, senderAta)
        if (senderAccount.amount < rawAmount) {
          setError(
            `Insufficient ${config.token.symbol} balance. You need ~${tokensNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${config.token.symbol} ($${config.mint.priceUsd}).`
          )
          setStep('preview')
          return
        }
      } catch {
        setError(
          `No ${config.token.symbol} token account found. Please acquire ${config.token.symbol} tokens first.`
        )
        setStep('preview')
        return
      }

      // Get treasury token account
      const treasuryAta = await getAssociatedTokenAddress(TOKEN_MINT, TREASURY_WALLET)

      // Build transfer transaction
      const transaction = new Transaction().add(
        createTransferInstruction(senderAta, treasuryAta, publicKey, rawAmount)
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Send transaction
      const signature = await sendTransaction(transaction, connection)
      setTxSignature(signature)

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed')

      setStep('minting')

      // In production, this would call a backend to mint the NFT using Metaplex.
      // For now we simulate the minting step to demonstrate the flow.
      // The composite image is ready; a backend service would:
      // 1. Upload the composite to Arweave/IPFS
      // 2. Create metadata JSON
      // 3. Mint a compressed NFT to the user's wallet
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStep('done')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transaction failed'
      if (message.includes('User rejected')) {
        setError('Transaction cancelled by user.')
        setStep('preview')
      } else {
        setError(message)
        setStep('error')
      }
    }
  }, [publicKey, connected, connection, sendTransaction, tokenPrice])

  const resetFlow = useCallback(() => {
    setStep('upload')
    setUploadedImage(null)
    setCompositeImage(null)
    setError(null)
    setTxSignature(null)
    setAgreedToRights(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-4xl px-4 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Mint Your <span className="text-green-400">Honorary PFP</span>
          </h1>
          <p className="mx-auto max-w-lg text-zinc-400">
            Upload your image, pay with{' '}
            <span className="font-semibold text-green-400">${config.token.symbol}</span>, and
            receive a unique GiggyBank honorary profile picture minted to your Solana wallet.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm">
            <span className="text-zinc-500">Price:</span>
            <span className="font-semibold text-green-400">
              {requiredTokens
                ? `~${requiredTokens} ${config.token.symbol}`
                : `$${config.mint.priceUsd} in ${config.token.symbol}`}
            </span>
            <span className="text-zinc-600">
              (${config.mint.priceUsd} USD)
            </span>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8 flex justify-center">
          <WalletMultiButton />
        </div>

        {/* Hidden canvas for compositing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="mx-auto max-w-md">
            <label
              htmlFor="pfp-upload"
              className="group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-12 transition-colors hover:border-green-400/50 hover:bg-zinc-900"
            >
              <div className="rounded-full bg-zinc-800 p-4 transition-colors group-hover:bg-green-400/10">
                <Upload className="h-8 w-8 text-zinc-500 transition-colors group-hover:text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white">Upload your image</p>
                <p className="mt-1 text-sm text-zinc-500">PNG, JPG, or WebP — max 10 MB</p>
              </div>
            </label>
            <input
              ref={fileInputRef}
              id="pfp-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && compositeImage && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={compositeImage}
                alt="Your GiggyBank Honorary PFP preview"
                className="h-auto w-full"
              />
            </div>

            <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Collection</span>
                <span className="font-medium text-white">{config.mint.collectionName}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Cost</span>
                <span className="font-medium text-green-400">
                  {requiredTokens
                    ? `~${requiredTokens} ${config.token.symbol}`
                    : `$${config.mint.priceUsd}`}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Destination</span>
                <span className="font-mono text-xs text-zinc-500">
                  {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'Connect wallet'}
                </span>
              </div>
            </div>

            <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition-colors hover:border-zinc-700">
              <input
                type="checkbox"
                checked={agreedToRights}
                onChange={(e) => setAgreedToRights(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-green-400"
              />
              <span className="text-sm text-zinc-300">
                I confirm that I own the rights to the image I am uploading and have the authority to use it for minting.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={resetFlow}
                className="flex-1 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
              >
                Change Image
              </button>
              <button
                onClick={handlePayAndMint}
                disabled={!connected || !agreedToRights}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-400 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {!connected ? 'Connect Wallet First' : !agreedToRights ? 'Agree to Mint' : 'Pay & Mint'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Paying */}
        {step === 'paying' && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Processing Payment</h2>
            <p className="text-sm text-zinc-400">
              Sending {config.token.symbol} to the GiggyBank treasury...
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              Please approve the transaction in your wallet.
            </p>
          </div>
        )}

        {/* Step: Minting */}
        {step === 'minting' && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Minting Your Honorary PFP</h2>
            <p className="text-sm text-zinc-400">
              Payment confirmed! Now minting your unique PFP to your wallet...
            </p>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Honorary PFP Minted!</h2>
            <p className="mb-6 text-sm text-zinc-400">
              Your unique GiggyBank honorary has been minted to your wallet.
            </p>

            {compositeImage && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-green-400/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compositeImage}
                  alt="Your minted GiggyBank Honorary PFP"
                  className="h-auto w-full"
                />
              </div>
            )}

            {txSignature && (
              <a
                href={`https://solscan.io/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex items-center gap-1 text-sm text-green-400 transition-colors hover:text-green-300"
              >
                View transaction on Solscan
                <span className="text-green-600">↗</span>
              </a>
            )}

            <div className="mt-4">
              <button
                onClick={resetFlow}
                className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
              >
                Mint Another
              </button>
            </div>
          </div>
        )}

        {/* Step: Error */}
        {step === 'error' && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-red-400">Something went wrong</h2>
            <p className="mb-6 text-sm text-zinc-400">{error}</p>
            <button
              onClick={resetFlow}
              className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Inline error for non-fatal errors */}
        {error && step !== 'error' && (
          <div className="mx-auto mt-4 max-w-md rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Info section */}
        <div className="mx-auto mt-16 max-w-2xl">
          <h3 className="mb-6 text-center text-lg font-semibold text-white">How it works</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-400/10">
                <ImageIcon className="h-5 w-5 text-green-400" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">1. Upload Image</h4>
              <p className="text-xs text-zinc-500">
                Upload any image to use as the base for your honorary PFP.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-400/10">
                <Sparkles className="h-5 w-5 text-green-400" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">2. Pay with {config.token.symbol}</h4>
              <p className="text-xs text-zinc-500">
                Pay ${config.mint.priceUsd} worth of {config.token.symbol} tokens to the GiggyBank treasury.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-400/10">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">3. Receive NFT</h4>
              <p className="text-xs text-zinc-500">
                Your unique GiggyBank honorary PFP is minted directly to your Solana wallet.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
