'use client'

import { AddressEntry } from '../account/AddressEntry'
import { PortfolioSummaryPreview } from '../dashboard/PortfolioSummaryPreview'
import { MobileShell } from '../layout/MobileShell'
import { MobileTabBar } from '../navigation/MobileTabBar'
import { PwaStatusChip } from '../pwa/PwaStatusChip'
import { useWatchlist } from '../watchlist/useWatchlist'

export function MobileHome() {
  const { activeAccount } = useWatchlist()

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

        {activeAccount ? <PortfolioSummaryPreview account={activeAccount} /> : <AddressEntry />}
      </section>
    </MobileShell>
  )
}
