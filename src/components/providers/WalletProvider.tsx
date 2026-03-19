'use client'

import { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
const ConnProvider = ConnectionProvider as any
const WalletProv = SolanaWalletProvider as any
const ModalProv = WalletModalProvider as any
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), [])

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  )

  return (
    <ConnProvider endpoint={endpoint}>
      <WalletProv wallets={wallets} autoConnect>
        <ModalProv>{children}</ModalProv>
      </WalletProv>
    </ConnProvider>
  )
}
