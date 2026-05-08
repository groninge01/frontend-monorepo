'use client'

import { AccountSwitcherSheet } from '../account/AccountSwitcherSheet'
import { useWatchlist } from '../watchlist/useWatchlist'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { motion } from 'motion/react'

export function MobileTopBar() {
  const { activeAccount } = useWatchlist()

  return (
    <header
      className="sticky top-0 z-30 bg-transparent px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)]"
      style={{ viewTransitionName: 'site-header' }}
    >
      <div className="grid min-h-10 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div />
        {activeAccount ? <AccountSwitcherSheet activeAccount={activeAccount} /> : <div />}
        <motion.div className="justify-self-end" whileTap={{ rotate: 24, scale: 0.92 }}>
          <Link
            aria-label="Settings"
            className="block rounded-full p-2 text-[var(--mobile-text-muted)] transition hover:text-[var(--mobile-text-primary)]"
            href="/settings"
          >
            <Settings aria-hidden="true" size={24} strokeWidth={2.2} />
          </Link>
        </motion.div>
      </div>
    </header>
  )
}
