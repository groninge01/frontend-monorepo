import { bn } from '../../../shared/utils/numbers'
import { getUserTotalBalanceUsd } from '../../pool/user-balance.helpers'
import { Pool } from '../../pool/pool.types'
import { MobilePortfolioChainAllocation, MobilePortfolioPosition } from './mobilePortfolio.types'

export function mapMobilePortfolioPositions(pools: Pool[]): MobilePortfolioPosition[] {
  return pools
    .filter(pool => pool.userBalance && pool.userBalance.totalBalance !== '0')
    .map(pool => ({
      chain: pool.chain,
      id: pool.id,
      name: pool.name,
      totalBalanceUsd: Number(getUserTotalBalanceUsd(pool)),
    }))
    .sort((a, b) => b.totalBalanceUsd - a.totalBalanceUsd)
}

export function getMobilePortfolioTotalValue(positions: MobilePortfolioPosition[]) {
  return positions.reduce((total, position) => total + position.totalBalanceUsd, 0)
}

export function getMobilePortfolioChainAllocation(
  positions: MobilePortfolioPosition[]
): MobilePortfolioChainAllocation[] {
  const valueByChain = positions.reduce(
    (acc, position) => {
      acc[position.chain] = bn(acc[position.chain] || 0)
        .plus(position.totalBalanceUsd)
        .toNumber()
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(valueByChain)
    .map(([chain, value]) => ({
      chain: chain as MobilePortfolioChainAllocation['chain'],
      value,
    }))
    .sort((a, b) => b.value - a.value)
}
