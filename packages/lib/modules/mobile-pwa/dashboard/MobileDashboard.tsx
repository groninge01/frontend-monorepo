'use client'

import { RefreshCcw } from 'lucide-react'
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
    <div className="flex h-full min-h-0 flex-col gap-6">
      <section className="space-y-3 pt-2">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(127,106,232,0.36),transparent_34%),linear-gradient(145deg,rgba(36,40,51,0.96),rgba(24,27,35,0.98)_58%,rgba(20,23,32,1))] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.32),0_0_45px_rgba(127,106,232,0.16)]">
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[var(--mobile-purple)]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-8 h-36 w-36 rounded-full bg-[var(--mobile-green)]/10 blur-3xl" />

          <div className="relative">
            <SummaryMetric
              isLoading={isLoading}
              label="Portfolio value"
              skeletonClassName="h-12 w-56 rounded-xl"
              value={formatUsd(dashboard?.totalValue || 0)}
              valueClassName="text-5xl tracking-tight"
            />
          </div>

          <div className="relative mt-5 grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 pt-4">
            <SummaryMetric
              isLoading={isLoading}
              label="Claimable"
              value={formatClaimable(dashboard)}
            />
            <SummaryMetric
              className="pl-4"
              isLoading={isLoading}
              label="Positions"
              value={`${dashboard?.positions.length || 0} pools`}
            />
          </div>
        </section>

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

      <div className="min-h-0 flex-1">
        <PositionsCard dashboard={dashboard} isLoading={isLoading} />
      </div>
    </div>
  )
}

function SummaryMetric({
  className,
  isLoading,
  label,
  skeletonClassName = 'h-6 w-24 rounded-md',
  value,
  valueClassName = 'text-2xl',
}: {
  className?: string
  isLoading?: boolean
  label: string
  skeletonClassName?: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--mobile-text-muted)]">{label}</p>
      {isLoading ? (
        <Skeleton className={cn('mt-3', skeletonClassName)} />
      ) : (
        <p className={cn('mt-3 font-semibold text-[var(--mobile-text-primary)]', valueClassName)}>
          {value}
        </p>
      )}
    </div>
  )
}

function PositionsCard({
  dashboard,
  isLoading,
}: {
  dashboard: MobilePortfolioViewModel | undefined
  isLoading?: boolean
}) {
  const positions = dashboard?.positions || []

  return (
    <section className="flex h-full min-h-0 flex-col space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[var(--mobile-text-primary)]">Positions</h2>
        <span className="text-xs text-[var(--mobile-text-muted)]">{positions.length} pools</span>
      </div>
      {isLoading ? (
        <PositionsSkeleton />
      ) : positions.length ? (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-[var(--mobile-border-zen)] pb-6">
          <div className="divide-y divide-[var(--mobile-border-zen)]">
            {positions.map(position => (
              <div
                className="grid min-h-16 grid-cols-[auto_20%] items-start gap-3 py-3"
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
        </div>
      ) : (
        <p className="border-t border-[var(--mobile-border-zen)] pt-3 text-sm text-[var(--mobile-text-secondary)]">
          No pool positions found for this address.
        </p>
      )}
    </section>
  )
}

function PositionsSkeleton() {
  return (
    <div className="divide-y divide-[var(--mobile-border-zen)] border-t border-[var(--mobile-border-zen)]">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="grid min-h-16 grid-cols-[auto_20%] items-start gap-3 py-3" key={index}>
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

function formatClaimable(dashboard: MobilePortfolioViewModel | undefined) {
  if (!dashboard || dashboard.claimableRewardsValue === null) return 'Unavailable'
  return formatUsd(dashboard.claimableRewardsValue)
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
