'use client'

import { RefreshCcw } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { MobilePortfolioViewModel } from '../portfolio/mobilePortfolio.types'
import { useWatchedPortfolio } from '../portfolio/useWatchedPortfolio'
import { readCachedDashboard, writeCachedDashboard } from '../pwa/dashboard-cache'
import { useOnlineStatus } from '../pwa/useOnlineStatus'
import { Button } from '../ui/button'
import { StatusChip } from '../ui/status-chip'
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
  const statusTone = portfolio.status === 'error' && !isUsingStaleData ? 'danger' : 'warning'

  useEffect(() => {
    if (portfolio.data) writeCachedDashboard(portfolio.data, Date.now())
  }, [portfolio.data])

  return (
    <div className="space-y-10">
      <section className="space-y-5 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Portfolio value</p>
            <p className="mt-3 text-5xl font-semibold tracking-tight">
              {formatUsd(dashboard?.totalValue || 0)}
            </p>
          </div>
          <StatusChip className="mt-1 shrink-0" tone={statusTone}>
            {isUsingStaleData ? 'Stale' : portfolio.status === 'loading' ? 'Loading' : 'Read-only'}
          </StatusChip>
        </div>

        <div>
          {isUsingStaleData ? (
            <p className="mt-2 text-sm text-orange-100">Offline. Showing cached data.</p>
          ) : null}
          {portfolio.status === 'error' && !isUsingStaleData ? (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
              <span>Portfolio data could not be loaded.</span>
              <Button onClick={() => portfolio.refetch()} size="sm" type="button" variant="ghost">
                <RefreshCcw aria-hidden className="h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 py-3 text-sm">
          <Metric label="Claimable" value={formatClaimable(dashboard)} />
          <Metric label="Positions" value={`${dashboard?.positions.length || 0} pools`} />
        </div>
      </section>

      <div className="space-y-10">
        <ChainAllocationCard dashboard={dashboard} />
        <PositionsCard dashboard={dashboard} />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 first:pl-0 last:pr-0">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  )
}

function ChainAllocationCard({ dashboard }: { dashboard: MobilePortfolioViewModel | undefined }) {
  const totalValue = dashboard?.totalValue || 0
  const allocations = dashboard?.chainAllocation || []

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Chain allocation</h2>
        <span className="text-xs text-slate-500">{allocations.length} chains</span>
      </div>
      {allocations.length ? (
        <div className="space-y-3">
          {allocations.slice(0, 4).map(allocation => {
            const percentage = totalValue ? Math.round((allocation.value / totalValue) * 100) : 0

            return (
              <div className="space-y-2" key={allocation.chain}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-white">{formatChain(allocation.chain)}</span>
                  <span className="text-slate-400">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#7f6ae8,#00d395)]"
                    style={{ width: `${Math.max(percentage, 4)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="border-t border-white/10 pt-3 text-sm text-slate-400">
          No active chain balances.
        </p>
      )}
    </section>
  )
}

function PositionsCard({ dashboard }: { dashboard: MobilePortfolioViewModel | undefined }) {
  const positions = dashboard?.positions || []

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Positions</h2>
        <span className="text-xs text-slate-500">{positions.length} pools</span>
      </div>
      {positions.length ? (
        <div className="divide-y divide-white/10 border-y border-white/10">
          {positions.slice(0, 5).map(position => (
            <div
              className="flex min-h-16 items-center justify-between gap-3 py-3"
              key={position.id}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{position.name}</p>
                <p className="mt-1 text-xs text-slate-500">{formatChain(position.chain)}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-white">
                {formatUsd(position.totalBalanceUsd)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="border-t border-white/10 pt-3 text-sm text-slate-400">
          No pool positions found for this address.
        </p>
      )}
    </section>
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
