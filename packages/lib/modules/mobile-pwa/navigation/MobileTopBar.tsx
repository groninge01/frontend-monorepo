'use client'

import { AccountSwitcherSheet } from '../account/AccountSwitcherSheet'
import { useWatchlist } from '../watchlist/useWatchlist'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export function MobileTopBar() {
  const { activeAccount } = useWatchlist()

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--mobile-border-zen)] bg-[var(--mobile-bg-level-1)]/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] backdrop-blur-xl">
      <div className="grid min-h-10 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <img alt="Balancer" height={28} src="/balancer.png" width={28} />
        {activeAccount ? <AccountSwitcherSheet activeAccount={activeAccount} /> : <div />}
        <Link
          aria-label="Settings"
          className="justify-self-end rounded-full p-2 text-[var(--mobile-text-muted)] transition hover:text-[var(--mobile-text-primary)]"
          href="/settings"
        >
          <Settings aria-hidden="true" size={24} strokeWidth={2.2} />
        </Link>
      </div>
    </header>
  )
}
