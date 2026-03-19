'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Wallet } from 'lucide-react'

export default function WalletButton() {
  const { publicKey, disconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()

  if (connecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-500"
      >
        Connecting…
      </button>
    )
  }

  if (publicKey) {
    const address = publicKey.toBase58()
    const short = `${address.slice(0, 4)}…${address.slice(-4)}`
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
        title={`Connected: ${address}. Click to disconnect.`}
      >
        <Wallet size={14} />
        {short}
      </button>
    )
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
    >
      <Wallet size={14} />
      Connect Wallet
    </button>
  )
}
