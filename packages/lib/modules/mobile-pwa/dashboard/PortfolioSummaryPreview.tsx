'use client'

import { abbreviateAddress } from '../../../shared/utils/addresses'
import { useWatchedPortfolio } from '../portfolio/useWatchedPortfolio'
import { Card } from '../ui/card'
import { StatusChip } from '../ui/status-chip'
import { WatchedAccount } from '../watchlist/watchlist.types'

type PortfolioSummaryPreviewProps = {
  account: WatchedAccount
}

export function PortfolioSummaryPreview({ account }: PortfolioSummaryPreviewProps) {
  const portfolio = useWatchedPortfolio({ address: account.address })
  const totalValue = portfolio.data?.totalValue || 0
  const positionsCount = portfolio.data?.positions.length || 0

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-500">Watching</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {abbreviateAddress(account.address)}
          </p>
        </div>
        <StatusChip tone={portfolio.status === 'error' ? 'danger' : 'warning'}>
          {portfolio.status === 'loading' ? 'Loading' : 'Read-only'}
        </StatusChip>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-500">Portfolio value</p>
        <p className="mt-2 text-4xl font-semibold">{formatUsd(totalValue)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Claimable</p>
          <p className="mt-1 font-semibold text-white">Unavailable</p>
        </div>
        <div>
          <p className="text-slate-500">Positions</p>
          <p className="mt-1 font-semibold text-white">{positionsCount} pools</p>
        </div>
      </div>
      {portfolio.status === 'error' ? (
        <p className="text-sm text-red-200">Portfolio data could not be loaded. Try again later.</p>
      ) : null}
    </Card>
  )
}

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: value > 100 ? 0 : 2,
    style: 'currency',
  }).format(value)
}
