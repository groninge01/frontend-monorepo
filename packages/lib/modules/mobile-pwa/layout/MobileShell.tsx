'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, createContext, useContext, useState } from 'react'
import { AnimatePresence, Variants, motion } from 'motion/react'
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
const slideOffset = 32
const slideVariants: Variants = {
  enter: (direction: SwipeDirection) => ({
    opacity: 0,
    x: direction === 'next' ? slideOffset : -slideOffset,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: SwipeDirection) => ({
    opacity: 0,
    x: direction === 'next' ? -slideOffset : slideOffset,
  }),
}

type SwipeDirection = 'next' | 'previous'
type SwipeNavigationContextValue = {
  direction: SwipeDirection
  setDirection: (direction: SwipeDirection) => void
}

const SwipeNavigationContext = createContext<SwipeNavigationContextValue | null>(null)

export function MobileSwipeNavigationProvider({ children }: { children: ReactNode }) {
  const [direction, setDirection] = useState<SwipeDirection>('next')

  return (
    <SwipeNavigationContext.Provider value={{ direction, setDirection }}>
      {children}
    </SwipeNavigationContext.Provider>
  )
}

function useSwipeNavigationDirection() {
  const context = useContext(SwipeNavigationContext)

  if (!context) {
    return {
      direction: 'next' as SwipeDirection,
      setDirection: () => undefined,
    }
  }

  return context
}

export function MobileShell({ bottomNavigation, children, swipeNavigation }: MobileShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { direction, setDirection } = useSwipeNavigationDirection()
  const swipeHandlers = useSwipeable({
    delta: minSwipeDistance,
    onSwipedLeft: () => {
      if (!swipeNavigation?.nextHref) return

      setDirection('next')
      router.push(swipeNavigation.nextHref)
    },
    onSwipedRight: () => {
      if (!swipeNavigation?.previousHref) return

      setDirection('previous')
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
            <AnimatePresence custom={direction} initial={false} mode="popLayout">
              <motion.div
                animate="center"
                className="h-full"
                custom={direction}
                exit="exit"
                initial="enter"
                key={pathname}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                variants={slideVariants}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          {bottomNavigation}
        </div>
      </div>
    </div>
  )
}
