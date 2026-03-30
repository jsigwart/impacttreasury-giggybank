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
import { Upload, ImageIcon, Sparkles, Loader2, CheckCircle2, AlertCircle, Github, Layers } from 'lucide-react'
import { config } from '@/giggybank.config'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

const TOKEN_MINT = new PublicKey(config.token.address)
const TREASURY_WALLET = new PublicKey(config.treasury.wallet)

type MintStep = 'upload' | 'preview' | 'paying' | 'minting' | 'done' | 'error'

export default function MintPage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, signMessage, connected } = useWallet()

  const [step, setStep] = useState<MintStep>('upload')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [compositeImage, setCompositeImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [tokenPrice, setTokenPrice] = useState<number | null>(null)
  const [requiredTokens, setRequiredTokens] = useState<string | null>(null)
  const [ownershipAgreed, setOwnershipAgreed] = useState(false)
  const [mintAddress, setMintAddress] = useState<string | null>(null)
  const [mintError, setMintError] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch token price on mount
  useEffect(() => {
    async function fetchPrice() {
      try {
        // Use DexScreener for price (Jupiter v2 requires auth)
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${config.token.address}`
        )
        const data = await res.json()
        const pairs = data?.pairs
        const price = pairs?.[0]?.priceUsd
        if (!price || Number(price) <= 0) return
        setTokenPrice(Number(price))
        const tokens = config.mint.priceUsd / Number(price)
        setRequiredTokens(tokens.toLocaleString(undefined, { maximumFractionDigits: 0 }))
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
      ctx.strokeStyle = '#22c55e'
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

  // DEVNET TESTING: detect devnet from RPC URL
  const isDevnet = process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.includes('devnet')

  const handlePayAndMint = useCallback(async () => {
    if (!publicKey || !connected) {
      setError('Please connect your wallet first')
      return
    }

    if (!ownershipAgreed) {
      setError('You must agree that you own the rights to the uploaded image.')
      return
    }

    if (!signMessage) {
      setError('Your wallet does not support message signing. Please use a compatible wallet.')
      return
    }

    setStep('paying')
    setError(null)

    try {
      // Request wallet signature to confirm image ownership agreement
      const message = new TextEncoder().encode(
        'I confirm that I own the rights to the image I am uploading and agree to mint it as a GiggyBank Honorary PFP.'
      )
      await signMessage(message)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signature failed'
      if (message.includes('User rejected') || message.includes('rejected')) {
        setError('Signature request cancelled. You must sign to proceed with minting.')
      } else {
        setError(message)
      }
      setStep('preview')
      return
    }

    try {
      if (isDevnet) {
        // DEVNET: skip token payment, go straight to generate
        // TODO: Remove this block before production
        setStep('minting')

        const generateRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referenceImage: uploadedImage,
            txSignature: 'devnet-test',
            walletAddress: publicKey!.toBase58(),
          }),
        })

        if (!generateRes.ok) {
          const errData = await generateRes.json()
          throw new Error(errData.error || 'Image generation failed')
        }

        const generateData = await generateRes.json()
        if (generateData.image?.data) {
          const mime = generateData.image.mimeType ?? 'image/png'
          setGeneratedImage(`data:${mime};base64,${generateData.image.data}`)
        }

        if (generateData.mintAddress) {
          setMintAddress(generateData.mintAddress)
        }
        if (generateData.mintError) {
          setMintError(generateData.mintError)
        }

        setStep('done')
        return
      }

      // PRODUCTION: full payment flow
      if (!tokenPrice) {
        setError('Unable to fetch token price. Please try again later.')
        return
      }

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
        createTransferInstruction(senderAta, treasuryAta, publicKey!, rawAmount)
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Send transaction
      const signature = await sendTransaction(transaction, connection)
      setTxSignature(signature)

      // Wait for confirmation with retry — if the first attempt times out,
      // check the signature status directly before giving up
      try {
        await connection.confirmTransaction(signature, 'confirmed')
      } catch (confirmErr: unknown) {
        const msg = confirmErr instanceof Error ? confirmErr.message : ''
        if (msg.includes('not confirmed') || msg.includes('timeout') || msg.includes('Timed out')) {
          // Transaction may still have succeeded — check status directly
          const status = await connection.getSignatureStatus(signature)
          const confirmed = status?.value?.confirmationStatus === 'confirmed' ||
            status?.value?.confirmationStatus === 'finalized'
          if (!confirmed) {
            // One more attempt with longer timeout
            try {
              await connection.confirmTransaction(signature, 'confirmed')
            } catch {
              const recheck = await connection.getSignatureStatus(signature)
              const recheckConfirmed = recheck?.value?.confirmationStatus === 'confirmed' ||
                recheck?.value?.confirmationStatus === 'finalized'
              if (!recheckConfirmed) {
                throw new Error(
                  `Transaction sent but not yet confirmed. Your signature: ${signature}. ` +
                  'Please check Solscan and contact support if your tokens were deducted.'
                )
              }
            }
          }
        } else {
          throw confirmErr
        }
      }

      setStep('minting')

      // Call the generate API with the verified transaction signature
      // The backend verifies the payment on-chain before generating
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceImage: uploadedImage,
          txSignature: signature,
        }),
      })

      if (!generateRes.ok) {
        const errData = await generateRes.json()
        throw new Error(errData.error || 'Image generation failed')
      }

      const generateData = await generateRes.json()
      if (generateData.image?.data) {
        const mime = generateData.image.mimeType ?? 'image/png'
        setGeneratedImage(`data:${mime};base64,${generateData.image.data}`)
      }

      if (generateData.mintAddress) {
        setMintAddress(generateData.mintAddress)
      }
      if (generateData.mintError) {
        setMintError(generateData.mintError)
      }

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
  }, [publicKey, connected, connection, sendTransaction, signMessage, tokenPrice, ownershipAgreed, isDevnet, uploadedImage])

  const resetFlow = useCallback(() => {
    setStep('upload')
    setUploadedImage(null)
    setCompositeImage(null)
    setGeneratedImage(null)
    setError(null)
    setTxSignature(null)
    setOwnershipAgreed(false)
    setMintAddress(null)
    setMintError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-4xl px-4 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Mint Your <span className="text-green-500">Honorary PFP</span>
          </h1>
          <p className="mx-auto max-w-lg text-gray-600">
            Upload your image, pay with{' '}
            <span className="font-semibold text-green-500">${config.token.symbol}</span>, and
            receive a unique GiggyBank honorary profile picture minted to your Solana wallet.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm">
            <span className="text-gray-500">Price:</span>
            <span className="font-semibold text-green-500">
              {requiredTokens
                ? `~${requiredTokens} ${config.token.symbol}`
                : `$${config.mint.priceUsd} in ${config.token.symbol}`}
            </span>
            <span className="text-gray-400">
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
              className="group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 transition-colors hover:border-green-500/50 hover:bg-gray-100"
            >
              <div className="rounded-full bg-gray-200 p-4 transition-colors group-hover:bg-green-500/10">
                <Upload className="h-8 w-8 text-gray-500 transition-colors group-hover:text-green-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-slate-900">Upload your image</p>
                <p className="mt-1 text-sm text-gray-500">PNG, JPG, or WebP — max 10 MB</p>
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
            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={compositeImage}
                alt="Your GiggyBank Honorary PFP preview"
                className="h-auto w-full"
              />
            </div>

            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Collection</span>
                <span className="font-medium text-slate-900">{config.mint.collectionName}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">Cost</span>
                <span className="font-medium text-green-500">
                  {requiredTokens
                    ? `~${requiredTokens} ${config.token.symbol}`
                    : `$${config.mint.priceUsd}`}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">Destination</span>
                <span className="font-mono text-xs text-gray-400">
                  {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'Connect wallet'}
                </span>
              </div>
            </div>

            <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition-colors hover:border-gray-300">
              <input
                type="checkbox"
                checked={ownershipAgreed}
                onChange={(e) => setOwnershipAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-green-500"
              />
              <span className="text-sm text-gray-700">
                I confirm that I own the rights to the image I am uploading and have the authority to use it for minting.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={resetFlow}
                className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-slate-900"
              >
                Change Image
              </button>
              <button
                onClick={handlePayAndMint}
                disabled={!connected || !ownershipAgreed}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {!connected ? 'Connect Wallet First' : !ownershipAgreed ? 'Agree to Mint' : isDevnet ? 'Test Mint (Devnet)' : 'Pay & Mint'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Paying */}
        {step === 'paying' && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-500" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Processing Payment</h2>
            <p className="text-sm text-gray-600">
              Sending {config.token.symbol} to the GiggyBank treasury...
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Please approve the transaction in your wallet.
            </p>
          </div>
        )}

        {/* Step: Minting */}
        {step === 'minting' && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-500" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Generating Your Honorary PFP</h2>
            <p className="text-sm text-gray-600">
              Payment confirmed! AI is now styling your image with the GiggyBank mascot...
            </p>
            <p className="mt-2 text-xs text-gray-400">This may take a few seconds.</p>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">
              {mintAddress ? 'Your Honorary PFP has been minted as an NFT!' : 'Honorary PFP Generated!'}
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              {mintAddress
                ? 'Your unique GiggyBank honorary NFT has been minted to your wallet.'
                : 'Your unique GiggyBank honorary has been generated.'}
            </p>

            {mintError && (
              <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                NFT minting failed: {mintError}. Your image was still generated successfully.
              </div>
            )}

            {(generatedImage || compositeImage) && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-green-500/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImage ?? compositeImage!}
                  alt="Your GiggyBank Honorary PFP"
                  className="h-auto w-full"
                />
              </div>
            )}
            {generatedImage && (
              <a
                href={generatedImage}
                download="giggybank-honorary.png"
                className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-slate-900"
              >
                Download image ↓
              </a>
            )}

            <div className="flex flex-col items-center gap-2">
              {mintAddress && (
                <a
                  href={`https://solscan.io/token/${mintAddress}${isDevnet ? '?cluster=devnet' : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-500 transition-colors hover:text-green-600"
                >
                  View NFT on Solscan
                  <span className="text-green-400">↗</span>
                </a>
              )}
              {txSignature && (
                <a
                  href={`https://solscan.io/tx/${txSignature}${isDevnet ? '?cluster=devnet' : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-500 transition-colors hover:text-green-600"
                >
                  View payment transaction on Solscan
                  <span className="text-green-400">↗</span>
                </a>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={resetFlow}
                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-slate-900"
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
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-red-500">Something went wrong</h2>
            <p className="mb-6 text-sm text-gray-600">{error}</p>
            <button
              onClick={resetFlow}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-slate-900"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Inline error for non-fatal errors */}
        {error && step !== 'error' && (
          <div className="mx-auto mt-4 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Info section */}
        <div className="mx-auto mt-16 max-w-2xl">
          <h3 className="mb-6 text-center text-lg font-semibold text-slate-900">How it works</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <ImageIcon className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-slate-900">1. Upload Image</h4>
              <p className="text-xs text-gray-500">
                Upload any image to use as the base for your honorary PFP.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-slate-900">2. Pay with {config.token.symbol}</h4>
              <p className="text-xs text-gray-500">
                Pay ${config.mint.priceUsd} worth of {config.token.symbol} tokens to the GiggyBank treasury.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-slate-900">3. Receive NFT</h4>
              <p className="text-xs text-gray-500">
                Your unique GiggyBank honorary PFP is minted directly to your Solana wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Framework & IP Details */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Layers className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">The ImpactTreasury Framework</h3>
            </div>
            <p className="mb-4 leading-relaxed text-gray-600">
              GiggyBank is built on <span className="font-medium text-slate-900">ImpactTreasury</span> — an
              open-source framework that lets any token community turn trading fees into real-world
              impact campaigns. Honorary PFP minting is a core feature of the framework.
            </p>
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
              <h4 className="mb-2 text-sm font-semibold text-slate-900">How Honorary Minting Works with Token IP</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                When you mint an Honorary PFP, your uploaded image (your IP) is composited with the{' '}
                <span className="text-green-500">${config.token.symbol}</span> token&apos;s branded imagery
                (the token&apos;s IP). The result is a unique on-chain NFT that merges both — a personalized
                collectible representing your individual identity and your membership in the community.
                You pay in <span className="text-green-500">${config.token.symbol}</span> tokens, which go
                directly to the project treasury to fund future impact campaigns.
              </p>
            </div>
            <p className="mb-5 text-sm text-gray-500">
              The framework is fully config-driven — any token project can fork it, update a single
              config file, and launch their own honorary minting and transparent impact program.
            </p>
            <a
              href="https://github.com/jsigwart/impacttreasury-giggybank"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <span className="text-gray-400">↗</span>
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
