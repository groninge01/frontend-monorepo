'use client'

import Link from 'next/link'
import { BarChart3, CirclePlus, Settings, Shuffle, WavesLadder } from 'lucide-react'
import { useWatchAddress } from '../watchlist/WatchAddressProvider'
import { cn } from '../ui/cn'

export type MobileTab = 'dashboard' | 'swap' | 'watch' | 'pools' | 'settings'

type MobileTabBarProps = {
  activeTab: MobileTab
}

const tabs = [
  { href: '/', icon: BarChart3, id: 'dashboard' as const, type: 'link' as const },
  { href: '/swap', icon: Shuffle, id: 'swap' as const, type: 'link' as const },
  { icon: CirclePlus, id: 'watch' as const, type: 'action' as const },
  { href: '/pools', icon: WavesLadder, id: 'pools' as const, type: 'link' as const },
  { href: '/settings', icon: Settings, id: 'settings' as const, type: 'link' as const },
] as const

type TabItem = (typeof tabs)[number]

export function MobileTabBar({ activeTab }: MobileTabBarProps) {
  const { setOpen } = useWatchAddress()

  const isActive = (tab: TabItem) => {
    if (tab.type === 'action') return false
    return tab.id === activeTab
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-white/10 bg-[#111722]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur-xl">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <linearGradient id="mobile-tab-active-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#7f6ae8" />
            <stop offset="100%" stopColor="#00d395" />
          </linearGradient>
        </defs>
      </svg>
      <div className="grid grid-cols-5 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = isActive(tab)

          if (tab.type === 'link') {
            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 items-center justify-center rounded-lg text-slate-500 transition',
                  active && 'text-white'
                )}
                href={tab.href}
                key={tab.id}
              >
                <Icon
                  aria-hidden="true"
                  color={active ? 'url(#mobile-tab-active-gradient)' : 'currentColor'}
                  size={28}
                  strokeWidth={2.2}
                />
              </Link>
            )
          }

          return (
            <button
              aria-label="Watch an address"
              className="flex min-h-14 items-center justify-center rounded-lg text-slate-500 transition hover:text-white"
              key={tab.id}
              onClick={() => setOpen(true)}
              type="button"
            >
              <Icon aria-hidden="true" size={28} strokeWidth={2.2} />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
