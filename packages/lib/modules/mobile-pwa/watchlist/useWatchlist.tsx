'use client'

import { PropsWithChildren, createContext, useCallback, useMemo, useSyncExternalStore } from 'react'
import { Address } from 'viem'
import { useMandatoryContext } from '../../../shared/utils/contexts'
import {
  addWatchedAccount,
  getActiveWatchedAccount,
  getWatchedAccounts,
  removeWatchedAccount,
  setActiveWatchedAccount,
} from './watchlist.storage'
import { WatchedAccount } from './watchlist.types'

type AddAccountInput = {
  address: Address
  ensName?: string
  label?: string
}

type WatchlistContextValue = {
  accounts: WatchedAccount[]
  activeAccount?: WatchedAccount
  addAccount: (input: AddAccountInput) => WatchedAccount
  removeAccount: (address: Address) => void
  selectAccount: (address: Address) => WatchedAccount | undefined
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null)
const watchlistChangeEvent = 'mobile-pwa-watchlist-change'

export function WatchlistProvider({ children }: PropsWithChildren) {
  const accounts = useSyncExternalStore(subscribeToWatchlist, getWatchedAccounts, () => [])
  const activeAccount = useMemo(() => getActiveWatchedAccount(), [accounts])

  const notifyWatchlistChanged = useCallback(() => {
    window.dispatchEvent(new Event(watchlistChangeEvent))
  }, [])

  const value = useMemo<WatchlistContextValue>(
    () => ({
      accounts,
      activeAccount,
      addAccount: input => {
        const account = addWatchedAccount(input)
        notifyWatchlistChanged()
        return account
      },
      removeAccount: address => {
        removeWatchedAccount(address)
        notifyWatchlistChanged()
      },
      selectAccount: address => {
        const account = setActiveWatchedAccount(address)
        notifyWatchlistChanged()
        return account
      },
    }),
    [accounts, activeAccount, notifyWatchlistChanged]
  )

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  return useMandatoryContext(WatchlistContext, 'Watchlist')
}

function subscribeToWatchlist(onStoreChange: () => void) {
  window.addEventListener(watchlistChangeEvent, onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener(watchlistChangeEvent, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}
