import { Address } from 'viem'
import { GqlChain } from '../../../shared/services/api/generated/graphql'

export type MobilePortfolioPosition = {
  chain: GqlChain
  id: string
  name: string
  totalBalanceUsd: number
}

export type MobilePortfolioChainAllocation = {
  chain: GqlChain
  value: number
}

export type MobilePortfolioViewModel = {
  account: Address
  chainAllocation: MobilePortfolioChainAllocation[]
  claimableRewardsValue: number | null
  positions: MobilePortfolioPosition[]
  totalValue: number
  updatedAt: number
}
