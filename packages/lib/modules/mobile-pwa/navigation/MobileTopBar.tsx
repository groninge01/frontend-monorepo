'use client'

import { AccountSwitcherSheet } from '../account/AccountSwitcherSheet'
import { useWatchlist } from '../watchlist/useWatchlist'

export function MobileTopBar() {
  const { activeAccount } = useWatchlist()

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#12161f]/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] backdrop-blur-xl">
      <div className="grid min-h-10 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <p className="text-base font-semibold tracking-tight text-white">Balancer</p>
        {activeAccount ? <AccountSwitcherSheet activeAccount={activeAccount} /> : <div />}
        <div />
      </div>
    </header>
  )
}
