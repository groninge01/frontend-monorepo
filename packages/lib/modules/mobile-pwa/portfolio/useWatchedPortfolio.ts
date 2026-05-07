'use client'

import { useQuery } from '@apollo/client/react'
import { Address } from 'viem'
import { PROJECT_CONFIG } from '../../../config/getProjectConfig'
import { Pool } from '../../pool/pool.types'
import { GetPoolsDocument } from '../../../shared/services/api/generated/graphql'
import {
  getMobilePortfolioChainAllocation,
  getMobilePortfolioTotalValue,
  mapMobilePortfolioPositions,
} from './mobilePortfolio.mapper'
import { MobilePortfolioViewModel } from './mobilePortfolio.types'

type UseWatchedPortfolioInput = {
  address: Address | null | undefined
}

export function useWatchedPortfolio({ address }: UseWatchedPortfolioInput) {
  const chainIn = PROJECT_CONFIG.supportedNetworks
  const isEnabled = !!address

  const { data, error, loading, refetch } = useQuery(GetPoolsDocument, {
    variables: {
      where: {
        chainIn,
        userAddress: address?.toLowerCase(),
      },
    },
    fetchPolicy: 'no-cache',
    skip: !isEnabled,
  })

  const poolsData = data ? ((data.pools || []) as unknown as Pool[]) : undefined
  const positions = poolsData ? mapMobilePortfolioPositions(poolsData) : undefined
  const portfolio: MobilePortfolioViewModel | undefined =
    address && positions
      ? {
          account: address,
          chainAllocation: getMobilePortfolioChainAllocation(positions),
          claimableRewardsValue: null,
          positions,
          totalValue: getMobilePortfolioTotalValue(positions),
          updatedAt: 0,
        }
      : undefined

  return {
    data: portfolio,
    error,
    isStale: false,
    refetch,
    status: loading ? 'loading' : error ? 'error' : portfolio ? 'success' : 'idle',
  } as const
}
