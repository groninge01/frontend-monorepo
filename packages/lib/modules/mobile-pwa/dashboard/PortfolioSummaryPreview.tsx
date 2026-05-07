'use client'

import { WatchedAccount } from '../watchlist/watchlist.types'
import { MobileDashboard } from './MobileDashboard'

type PortfolioSummaryPreviewProps = {
  account: WatchedAccount
}

export function PortfolioSummaryPreview({ account }: PortfolioSummaryPreviewProps) {
  return <MobileDashboard account={account} />
}
