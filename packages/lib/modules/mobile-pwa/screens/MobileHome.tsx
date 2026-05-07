'use client'

import { MobileDashboard } from '../dashboard/MobileDashboard'
import { MobileShell } from '../layout/MobileShell'
import { MobileTabBar } from '../navigation/MobileTabBar'
import { AddressInputSheet } from '../watchlist/AddressInputSheet'
import { useWatchAddress } from '../watchlist/WatchAddressProvider'
import { useWatchlist } from '../watchlist/useWatchlist'

export function MobileHome() {
  const { activeAccount } = useWatchlist()
  const { setOpen } = useWatchAddress()

  return (
    <MobileShell bottomNavigation={<MobileTabBar activeTab="dashboard" />}>
      <section>
        {activeAccount ? (
          <MobileDashboard account={activeAccount} />
        ) : (
          <div className="space-y-2 py-8 text-center">
            <p className="text-sm text-slate-400">
              Tap the <span className="text-white font-medium">+</span> icon below to watch an
              address.
            </p>
          </div>
        )}
      </section>

      <AddressInputSheet onAccountAdded={() => setOpen(false)} />
    </MobileShell>
  )
}
