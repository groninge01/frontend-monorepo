'use client'

import { createContext, useMemo, useState } from 'react'
import { useMandatoryContext } from '../../../shared/utils/contexts'

type WatchAddressContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const WatchAddressProviderContext = createContext<WatchAddressContextValue>({
  open: false,
  setOpen: () => {},
})

type WatchAddressProviderProps = {
  children: React.ReactNode
}

export function WatchAddressProvider({ children }: WatchAddressProviderProps) {
  const [open, setOpen] = useState(false)

  return (
    <WatchAddressProviderContext.Provider value={useMemo(() => ({ open, setOpen }), [open])}>
      {children}
    </WatchAddressProviderContext.Provider>
  )
}

export function useWatchAddress() {
  return useMandatoryContext(WatchAddressProviderContext, 'WatchAddress')
}
