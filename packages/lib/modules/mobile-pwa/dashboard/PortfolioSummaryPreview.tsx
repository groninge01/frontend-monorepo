import { abbreviateAddress } from '../../../shared/utils/addresses'
import { Card } from '../ui/card'
import { StatusChip } from '../ui/status-chip'
import { WatchedAccount } from '../watchlist/watchlist.types'

type PortfolioSummaryPreviewProps = {
  account: WatchedAccount
}

export function PortfolioSummaryPreview({ account }: PortfolioSummaryPreviewProps) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-500">Watching</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {abbreviateAddress(account.address)}
          </p>
        </div>
        <StatusChip tone="warning">Read-only</StatusChip>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-500">Portfolio value</p>
        <p className="mt-2 text-4xl font-semibold">$0.00</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Claimable</p>
          <p className="mt-1 font-semibold text-white">$0.00</p>
        </div>
        <div>
          <p className="text-slate-500">Positions</p>
          <p className="mt-1 font-semibold text-white">0 pools</p>
        </div>
      </div>
    </Card>
  )
}
