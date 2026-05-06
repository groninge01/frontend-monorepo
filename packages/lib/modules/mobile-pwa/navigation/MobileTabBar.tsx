'use client'

import Link from 'next/link'
import { BarChart3, Droplets, Settings, Shuffle } from 'lucide-react'
import { cn } from '../ui/cn'

export type MobileTab = 'dashboard' | 'swap' | 'pools' | 'settings'

type MobileTabBarProps = {
  activeTab: MobileTab
}

const tabs = [
  { href: '/', icon: BarChart3, id: 'dashboard', label: 'Dashboard' },
  { href: '/swap', icon: Shuffle, id: 'swap', label: 'Swap' },
  { href: '/pools', icon: Droplets, id: 'pools', label: 'Pools' },
  { href: '/settings', icon: Settings, id: 'settings', label: 'Settings' },
] as const

export function MobileTabBar({ activeTab }: MobileTabBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-white/10 bg-[#111722]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium text-slate-500 transition',
                isActive && 'bg-white/[0.08] text-white'
              )}
              href={tab.href}
              key={tab.id}
            >
              <Icon aria-hidden="true" size={19} strokeWidth={2.2} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
