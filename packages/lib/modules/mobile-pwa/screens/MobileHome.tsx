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
      <MobileHomeContent activeAccount={activeAccount} />

      <AddressInputSheet onAccountAdded={() => setOpen(false)} />
    </MobileShell>
  )
}

function MobileHomeContent({
  activeAccount,
}: {
  activeAccount: ReturnType<typeof useWatchlist>['activeAccount']
}) {
  return (
    <section>
      {activeAccount ? (
        <MobileDashboard account={activeAccount} />
      ) : (
        <div className="space-y-2 py-8 text-center">
          <p className="text-sm text-[var(--mobile-text-secondary)]">
            Tap the <span className="font-medium text-[var(--mobile-text-primary)]">+</span> icon
            below to watch an address.
          </p>
        </div>
      )}
    </section>
  )
}
