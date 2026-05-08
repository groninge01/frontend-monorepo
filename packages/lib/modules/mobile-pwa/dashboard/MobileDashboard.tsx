'use client'

import { ChevronRight, RefreshCcw } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { MobilePortfolioViewModel } from '../portfolio/mobilePortfolio.types'
import { useWatchedPortfolio } from '../portfolio/useWatchedPortfolio'
import { readCachedDashboard, writeCachedDashboard } from '../pwa/dashboard-cache'
import { useOnlineStatus } from '../pwa/useOnlineStatus'
import { Button } from '../ui/button'
import { cn } from '../ui/cn'
import { WatchedAccount } from '../watchlist/watchlist.types'

type MobileDashboardProps = {
  account: WatchedAccount
}

export function MobileDashboard({ account }: MobileDashboardProps) {
  const isOnline = useOnlineStatus()
  const portfolio = useWatchedPortfolio({ address: account.address })
  const cachedDashboard = useMemo(
    () => readCachedDashboard({ account: account.address }),
    [account.address]
  )
  const dashboard = portfolio.data || (!isOnline ? cachedDashboard : undefined)
  const isUsingStaleData = !portfolio.data && !isOnline && !!cachedDashboard
  const isLoading = portfolio.status === 'loading' && !dashboard
  const refetchPortfolio = portfolio.refetch

  useEffect(() => {
    if (portfolio.data) writeCachedDashboard(portfolio.data, Date.now())
  }, [portfolio.data])

  useEffect(() => {
    function refreshVisibleDashboard() {
      if (!isOnline || document.visibilityState !== 'visible') return

      refetchPortfolio()
    }

    document.addEventListener('visibilitychange', refreshVisibleDashboard)
    window.addEventListener('focus', refreshVisibleDashboard)

    return () => {
      document.removeEventListener('visibilitychange', refreshVisibleDashboard)
      window.removeEventListener('focus', refreshVisibleDashboard)
    }
  }, [isOnline, refetchPortfolio])

  return (
    <div className="space-y-6 pb-2">
      <section className="relative -mx-4 -mt-20 bg-[linear-gradient(165deg,#12161f_0%,#1a1040_35%,#2d1b69_55%,#7f6ae8_78%,#e88a5a_100%)] px-4 pb-18 pt-8 text-center">
        <img
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-9/10 -translate-y-1/2 opacity-[0.18] blur-[4px]"
          src="/balancer-icon.svg"
        />
        <div className="relative mt-16 flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-white/88">Portfolio value</p>
          {isLoading ? (
            <Skeleton className="mx-auto mt-4 h-12 w-56 rounded-xl bg-white/20" />
          ) : (
            <p className="mt-3 text-6xl font-black tracking-[-0.08em] text-white">
              {formatUsd(dashboard?.totalValue || 0)}
            </p>
          )}
        </div>

        <div>
          {isUsingStaleData ? (
            <p className="mt-2 text-sm text-[var(--mobile-text-warning)]">
              Offline. Showing cached data.
            </p>
          ) : null}
          {portfolio.status === 'error' && !isUsingStaleData ? (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[rgba(244,137,117,0.24)] bg-[rgba(234,98,73,0.12)] p-3 text-sm text-[var(--mobile-text-error)]">
              <span>Portfolio data could not be loaded.</span>
              <Button onClick={() => portfolio.refetch()} size="sm" type="button" variant="ghost">
                <RefreshCcw aria-hidden className="h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : null}
        </div>
      </section>
      <PositionsCard className="relative -mt-12" dashboard={dashboard} isLoading={isLoading} />
      <section className="rounded-3xl bg-[var(--mobile-bg-level-2)] p-4">place holder</section>
    </div>
  )
}

function PositionsCard({
  className,
  dashboard,
  isLoading,
}: {
  className?: string
  dashboard: MobilePortfolioViewModel | undefined
  isLoading?: boolean
}) {
  const positions = dashboard?.positions || []
  const previewPositions = positions.slice(0, 5)

  return (
    <section className={cn('rounded-3xl bg-[var(--mobile-bg-level-2)] p-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[var(--mobile-text-primary)]">Positions</h2>
        <button
          aria-label="View all positions"
          className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--mobile-text-muted)] transition hover:text-[var(--mobile-text-primary)]"
          type="button"
        >
          <ChevronRight aria-hidden className="h-5 w-5" />
        </button>
      </div>
      {isLoading ? (
        <PositionsSkeleton />
      ) : positions.length ? (
        <div className="mt-3 space-y-2">
          {previewPositions.map(position => (
            <div
              className="grid min-h-14 grid-cols-[auto_24%] items-start gap-3 rounded-2xl py-2"
              key={position.id}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--mobile-text-primary)]">
                  {position.name}
                </p>
                <p className="mt-1 text-xs text-[var(--mobile-text-muted)]">
                  {formatChain(position.chain)}
                </p>
              </div>
              <p className="shrink-0 text-right text-sm font-semibold text-[var(--mobile-text-primary)]">
                {formatUsd(position.totalBalanceUsd)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--mobile-text-secondary)]">
          No pool positions found for this address.
        </p>
      )}
    </section>
  )
}

function PositionsSkeleton() {
  return (
    <div className="mt-3 space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="grid min-h-14 grid-cols-[auto_24%] items-start gap-3 py-2" key={index}>
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      ))}
    </div>
  )
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--mobile-gradient-skeleton)] bg-[length:220%_100%]',
        className
      )}
    />
  )
}

function formatChain(chain: string) {
  return chain
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: value > 100 ? 0 : 2,
    style: 'currency',
  }).format(value)
}
