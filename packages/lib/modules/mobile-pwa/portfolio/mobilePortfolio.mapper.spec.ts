import { describe, expect, test } from 'vitest'
import { GqlChain } from '../../../shared/services/api/generated/graphql'
import { Pool } from '../../pool/pool.types'
import {
  getMobilePortfolioChainAllocation,
  getMobilePortfolioTotalValue,
  mapMobilePortfolioPositions,
} from './mobilePortfolio.mapper'

describe('mobile portfolio mapper', () => {
  test('maps non-zero positions sorted by value descending', () => {
    const positions = mapMobilePortfolioPositions([
      pool({ chain: GqlChain.Base, id: 'base-small', name: 'Base small', value: 25 }),
      pool({ chain: GqlChain.Mainnet, id: 'main-large', name: 'Main large', value: 125 }),
      pool({ chain: GqlChain.Arbitrum, id: 'arb-empty', name: 'Arb empty', value: 0 }),
      pool({ chain: GqlChain.Base, id: 'base-mid', name: 'Base mid', value: 50 }),
    ])

    expect(positions).toEqual([
      {
        chain: GqlChain.Mainnet,
        id: 'main-large',
        name: 'Main large',
        totalBalanceUsd: 125,
      },
      {
        chain: GqlChain.Base,
        id: 'base-mid',
        name: 'Base mid',
        totalBalanceUsd: 50,
      },
      {
        chain: GqlChain.Base,
        id: 'base-small',
        name: 'Base small',
        totalBalanceUsd: 25,
      },
    ])
  })

  test('computes totals and chain allocation sorted by value descending', () => {
    const positions = [
      { chain: GqlChain.Base, id: 'base-small', name: 'Base small', totalBalanceUsd: 25 },
      { chain: GqlChain.Mainnet, id: 'main-large', name: 'Main large', totalBalanceUsd: 125 },
      { chain: GqlChain.Base, id: 'base-mid', name: 'Base mid', totalBalanceUsd: 50 },
    ]

    expect(getMobilePortfolioTotalValue(positions)).toBe(200)
    expect(getMobilePortfolioChainAllocation(positions)).toEqual([
      { chain: GqlChain.Mainnet, value: 125 },
      { chain: GqlChain.Base, value: 75 },
    ])
  })
})

function pool(input: { chain: GqlChain; id: string; name: string; value: number }): Pool {
  return {
    chain: input.chain,
    id: input.id,
    name: input.name,
    userBalance: {
      stakedBalances: [],
      totalBalance: input.value === 0 ? '0' : '1',
      totalBalanceUsd: input.value,
      walletBalance: input.value === 0 ? '0' : '1',
      walletBalanceUsd: input.value,
    },
  } as unknown as Pool
}
