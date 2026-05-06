'use client'

import { PropsWithChildren } from 'react'
import { ReactQueryClientProvider } from '../../../shared/app/react-query.provider'
import { UserSettingsProvider } from '../../user/settings/UserSettingsProvider'
import { WatchlistProvider } from '../watchlist/useWatchlist'

export function MobileClientProviders({ children }: PropsWithChildren) {
  return (
    <ReactQueryClientProvider>
      <UserSettingsProvider>
        <WatchlistProvider>{children}</WatchlistProvider>
      </UserSettingsProvider>
    </ReactQueryClientProvider>
  )
}
