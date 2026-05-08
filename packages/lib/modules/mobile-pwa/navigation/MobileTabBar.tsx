'use client'

import Link from 'next/link'
import { BarChart3, Plus, WavesLadder } from 'lucide-react'
import { useWatchAddress } from '../watchlist/WatchAddressProvider'
import { cn } from '../ui/cn'

export type MobileTab = 'dashboard' | 'watch' | 'pools' | 'settings'

type MobileTabBarProps = {
  activeTab: MobileTab
}

const tabs = [
  { href: '/', icon: BarChart3, id: 'dashboard' as const, type: 'link' as const },
  { icon: Plus, id: 'watch' as const, type: 'action' as const },
  { href: '/pools', icon: WavesLadder, id: 'pools' as const, type: 'link' as const },
] as const

type TabItem = (typeof tabs)[number]

export function MobileTabBar({ activeTab }: MobileTabBarProps) {
  const { setOpen } = useWatchAddress()

  const isActive = (tab: TabItem) => {
    if (tab.type === 'action') return false
    return tab.id === activeTab
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-[var(--mobile-border-zen)] bg-[var(--mobile-bg-level-1)]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-64 grid-cols-3 gap-4">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = isActive(tab)

          if (tab.type === 'link') {
            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 items-center justify-center rounded-lg text-[var(--mobile-text-muted)] transition',
                  active && 'text-[var(--mobile-purple)]'
                )}
                href={tab.href}
                key={tab.id}
              >
                <Icon aria-hidden="true" size={28} strokeWidth={2.2} />
              </Link>
            )
          }

          return (
            <button
              aria-label="Watch an address"
              className="flex min-h-14 items-center justify-center rounded-lg transition"
              key={tab.id}
              onClick={() => setOpen(true)}
              type="button"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mobile-purple)] text-white shadow-[0_10px_30px_rgba(127,106,232,0.35)] transition active:scale-95">
                <Icon aria-hidden="true" size={30} strokeWidth={2.6} />
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
