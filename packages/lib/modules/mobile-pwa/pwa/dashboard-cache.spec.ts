import { beforeEach, describe, expect, test } from 'vitest'
import { Address } from 'viem'
import { GqlChain } from '../../../shared/services/api/generated/graphql'
import { LS_KEYS } from '../../local-storage/local-storage.constants'
import { MobilePortfolioViewModel } from '../portfolio/mobilePortfolio.types'
import { readCachedDashboard, writeCachedDashboard } from './dashboard-cache'

const account = '0xba100000625a3754423978a60c9317c58a424e3d' as Address
const otherAccount = '0x0000000000000000000000000000000000000001' as Address

describe('dashboard cache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('reads cached dashboard only for the requested account', () => {
    writeCachedDashboard(viewModel({ account }), 1778061600000)

    expect(readCachedDashboard({ account })?.account).toBe(account)
    expect(readCachedDashboard({ account: otherAccount })).toBeUndefined()
  })

  test('clears invalid cached dashboard JSON', () => {
    localStorage.setItem(LS_KEYS.MobilePwa.CachedDashboard, '{')

    expect(readCachedDashboard({ account })).toBeUndefined()
    expect(localStorage.getItem(LS_KEYS.MobilePwa.CachedDashboard)).toBeNull()
  })
})

function viewModel(input: { account: Address }): MobilePortfolioViewModel {
  return {
    account: input.account,
    chainAllocation: [{ chain: GqlChain.Mainnet, value: 125 }],
    claimableRewardsValue: null,
    positions: [
      {
        chain: GqlChain.Mainnet,
        id: 'pool-id',
        name: 'Balancer pool',
        totalBalanceUsd: 125,
      },
    ],
    totalValue: 125,
    updatedAt: 1778061600000,
  }
}
