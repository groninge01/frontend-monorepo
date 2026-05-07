'use client'

import { MobileDashboard } from '../dashboard/MobileDashboard'
import { MobileShell } from '../layout/MobileShell'
import { MobileTabBar } from '../navigation/MobileTabBar'
import { PwaStatusChip } from '../pwa/PwaStatusChip'
import { AddressInputSheet } from '../watchlist/AddressInputSheet'
import { useWatchAddress } from '../watchlist/WatchAddressProvider'
import { useWatchlist } from '../watchlist/useWatchlist'

export function MobileHome() {
  const { activeAccount } = useWatchlist()
  const { setOpen } = useWatchAddress()

  return (
    <MobileShell
      bottomNavigation={<MobileTabBar activeTab="dashboard" />}
      statusSlot={<PwaStatusChip />}
    >
      <section className="space-y-5">
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-violet-200">Balancer mobile</p>
          <h1 className="text-4xl font-semibold tracking-normal">Portfolio dashboard</h1>
          <p className="text-sm leading-6 text-slate-400">
            Track Balancer positions by address. Wallet connection and transactions are not part of
            this MVP.
          </p>
        </div>

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
