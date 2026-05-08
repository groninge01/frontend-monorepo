'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, createContext, useContext, useState } from 'react'
import { AnimatePresence, Variants, motion, useAnimationControls } from 'motion/react'
import { useSwipeable } from 'react-swipeable'
import { MobileTopBar } from '../navigation/MobileTopBar'
import { cn } from '../ui/cn'

type MobileShellProps = {
  children: ReactNode
  bottomNavigation?: ReactNode
  nextPreview?: ReactNode
  previousPreview?: ReactNode
  swipeNavigation?: {
    nextHref?: string
    previousHref?: string
  }
}

const dragNavigationThreshold = 72
const maxDragOffset = 120
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
  const pathname = usePathname()
  const [direction, setDirection] = useState<SwipeDirection>('next')

  return (
    <SwipeNavigationContext.Provider value={{ direction, setDirection }}>
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.div
          animate="center"
          className="min-h-dvh"
          custom={direction}
          exit="exit"
          initial="enter"
          key={pathname}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          variants={slideVariants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
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

export function MobileShell({
  bottomNavigation,
  children,
  nextPreview,
  previousPreview,
  swipeNavigation,
}: MobileShellProps) {
  const router = useRouter()
  const { setDirection } = useSwipeNavigationDirection()
  const dragControls = useAnimationControls()
  const canDragLeft = !!swipeNavigation?.nextHref
  const canDragRight = !!swipeNavigation?.previousHref

  const swipeHandlers = useSwipeable({
    delta: 4,
    onSwiped: event => {
      if (event.absX < dragNavigationThreshold) {
        dragControls.start({ opacity: 1, x: 0 })
        return
      }

      if (event.deltaX < 0 && swipeNavigation?.nextHref) {
        setDirection('next')
        dragControls.start({ opacity: 0.72, x: -180 })
        router.push(swipeNavigation.nextHref)
        return
      }

      if (event.deltaX > 0 && swipeNavigation?.previousHref) {
        setDirection('previous')
        dragControls.start({ opacity: 0.72, x: 180 })
        router.push(swipeNavigation.previousHref)
        return
      }

      dragControls.start({ opacity: 1, x: 0 })
    },
    onSwiping: event => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) return

      const nextX = Math.max(-maxDragOffset, Math.min(maxDragOffset, event.deltaX))

      if (nextX < 0 && !canDragLeft) return
      if (nextX > 0 && !canDragRight) return

      dragControls.set({ opacity: 1, x: nextX })
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
  })

  function handlePointerCancel() {
    dragControls.start({ opacity: 1, x: 0 })
  }

  function navigateOnKeyboard(direction: SwipeDirection) {
    if (direction === 'next' && swipeNavigation?.nextHref) {
      setDirection('next')
      dragControls.start({ opacity: 0.72, x: -180 })
      router.push(swipeNavigation.nextHref)
      return
    }

    if (direction === 'previous' && swipeNavigation?.previousHref) {
      setDirection('previous')
      dragControls.start({ opacity: 0.72, x: 180 })
      router.push(swipeNavigation.previousHref)
    }
  }

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
          <main className="relative flex-1 overflow-hidden">
            {nextPreview ? (
              <div className="pointer-events-none absolute inset-0 translate-x-[78%] px-4 py-4 opacity-80">
                {nextPreview}
              </div>
            ) : null}
            {previousPreview ? (
              <div className="pointer-events-none absolute inset-0 -translate-x-[78%] px-4 py-4 opacity-80">
                {previousPreview}
              </div>
            ) : null}
            <motion.div
              {...swipeHandlers}
              animate={dragControls}
              className="relative z-10 min-h-full select-none bg-[var(--mobile-bg-level-1)] px-4 py-4"
              onKeyDown={event => {
                if (event.key === 'ArrowLeft') navigateOnKeyboard('next')
                if (event.key === 'ArrowRight') navigateOnKeyboard('previous')
              }}
              onPointerCancel={handlePointerCancel}
              role="group"
              style={{ touchAction: 'pan-y', WebkitUserSelect: 'none' }}
              tabIndex={0}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </main>
          {bottomNavigation}
        </div>
      </div>
    </div>
  )
}
