'use client'

import { PropsWithChildren } from 'react'
import { ReactQueryClientProvider } from '../../../shared/app/react-query.provider'
import { UserSettingsProvider } from '../../user/settings/UserSettingsProvider'
import { WatchlistProvider } from '../watchlist/useWatchlist'
import { ReadonlyWagmiProvider } from './ReadonlyWagmiProvider'

export function MobileClientProviders({ children }: PropsWithChildren) {
  return (
    <ReactQueryClientProvider>
      <ReadonlyWagmiProvider>
        <UserSettingsProvider>
          <WatchlistProvider>{children}</WatchlistProvider>
        </UserSettingsProvider>
      </ReadonlyWagmiProvider>
    </ReactQueryClientProvider>
  )
}
