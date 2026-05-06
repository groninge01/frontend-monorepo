'use client'

import { PropsWithChildren, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import { createReadonlyWagmiConfig } from './createReadonlyWagmiConfig'

export function ReadonlyWagmiProvider({ children }: PropsWithChildren) {
  const config = useMemo(() => createReadonlyWagmiConfig(), [])

  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
