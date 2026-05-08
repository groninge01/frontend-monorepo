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
    <div className="space-y-10">
      <section className="space-y-3 pt-2">
        <section className="rounded-2xl bg-[var(--mobile-bg-level-2)] p-4">
          <SummaryMetric
            isLoading={isLoading}
            label="Portfolio value"
            skeletonClassName="h-12 w-56 rounded-xl"
            value={formatUsd(dashboard?.totalValue || 0)}
            valueClassName="text-5xl tracking-tight"
          />

          <div className="mt-5 grid grid-cols-2 divide-x divide-[var(--mobile-border-zen)] border-t border-[var(--mobile-border-zen)] pt-4">
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

      <div className="space-y-10">
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
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[var(--mobile-text-primary)]">Positions</h2>
        <span className="text-xs text-[var(--mobile-text-muted)]">{positions.length} pools</span>
      </div>
      {isLoading ? (
        <PositionsSkeleton />
      ) : positions.length ? (
        <div className="divide-y divide-[var(--mobile-border-zen)] border-t border-[var(--mobile-border-zen)]">
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
