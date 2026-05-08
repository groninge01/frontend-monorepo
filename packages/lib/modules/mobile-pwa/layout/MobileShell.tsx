'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useSwipeable } from 'react-swipeable'
import { MobileTopBar } from '../navigation/MobileTopBar'
import { cn } from '../ui/cn'

type MobileShellProps = {
  children: ReactNode
  bottomNavigation?: ReactNode
  swipeNavigation?: {
    nextHref?: string
    previousHref?: string
  }
}

const minSwipeDistance = 60

export function MobileShell({ bottomNavigation, children, swipeNavigation }: MobileShellProps) {
  const router = useRouter()
  const swipeHandlers = useSwipeable({
    delta: minSwipeDistance,
    onSwipedLeft: () => {
      if (!swipeNavigation?.nextHref) return

      router.push(swipeNavigation.nextHref)
    },
    onSwipedRight: () => {
      if (!swipeNavigation?.previousHref) return

      router.push(swipeNavigation.previousHref)
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
  })

  return (
    <div className="min-h-dvh bg-[var(--mobile-bg-base)] text-[var(--mobile-text-primary)]">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-[var(--mobile-bg-level-1)] shadow-[0_0_80px_rgba(0,0,0,0.3)]">
        <div
          className={cn(
            'relative flex min-h-dvh flex-col',
            'pb-[calc(env(safe-area-inset-bottom)+80px)]'
          )}
        >
          <MobileTopBar />
          <main className="flex-1 px-4 py-4" {...swipeHandlers}>
            {children}
          </main>
          {bottomNavigation}
        </div>
      </div>
    </div>
  )
}
