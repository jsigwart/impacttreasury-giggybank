'use client'

import dynamic from 'next/dynamic'

const WalletProvider = dynamic(() => import('@/components/WalletProvider'), { ssr: false })

export default function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
