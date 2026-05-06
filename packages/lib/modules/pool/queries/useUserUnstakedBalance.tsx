import { getChainId } from '@repo/lib/config/app.config'
import { bn } from '@repo/lib/shared/utils/numbers'
import { compact, keyBy } from 'lodash'
import { Address, formatUnits, parseAbi } from 'viem'
import { useReadContracts } from 'wagmi'
import { UserAccountContext } from '../../web3/UserAccountProvider'
import { Pool } from '../pool.types'
import { BPT_DECIMALS } from '../pool.constants'
import { useContext, useMemo } from 'react'
import { useTokens } from '../../tokens/TokensProvider'

export type UnstakedBalanceByPoolId = ReturnType<
  typeof useUserUnstakedBalance
>['unstakedBalanceByPoolId']

type UseUserUnstakedBalanceOptions = {
  enabled?: boolean
  userAddress?: Address
}

export function useUserUnstakedBalance(
  pools: Pool[] = [],
  options: UseUserUnstakedBalanceOptions = {}
) {
  const userAccount = useContext(UserAccountContext)
  const userAddress = options.userAddress || userAccount?.userAddress
  const isEnabled = options.enabled ?? userAccount?.isConnected ?? false
  const { priceFor } = useTokens()

  // All pool version will implement balanceOf the same ABI function is shared
  const balanceOfAbi = parseAbi(['function balanceOf(address account) view returns (uint256)'])

  const {
    data: unstakedPoolBalances = [],
    isLoading,
    isFetching,
    refetch,
    error,
  } = useReadContracts({
    allowFailure: false,
    query: {
      enabled: !!userAddress && isEnabled,
    },
    contracts: pools.map(
      pool =>
        ({
          abi: balanceOfAbi,
          address: pool.address as Address,
          functionName: 'balanceOf',
          args: [userAddress as Address],
          chainId: getChainId(pool.chain),
        }) as const
    ),
  })

  // for each pool get the unstaked balance
  const balances = useMemo(() => {
    if (isFetching) return []

    return compact(
      unstakedPoolBalances.map((rawBalance, index) => {
        const pool = pools[index]
        if (!pool) return undefined

        const bptPrice = priceFor(pool.address, pool.chain)
        const humanUnstakedBalance = formatUnits(rawBalance || 0n, BPT_DECIMALS)

        return {
          poolId: pool.id,
          rawUnstakedBalance: rawBalance,
          unstakedBalance: humanUnstakedBalance,
          unstakedBalanceUsd: bn(humanUnstakedBalance).times(bptPrice),
        }
      })
    )
  }, [isLoading, unstakedPoolBalances, pools, userAddress, isFetching, priceFor])

  const unstakedBalanceByPoolId = keyBy(balances, 'poolId')

  return {
    unstakedBalanceByPoolId,
    isLoading,
    isFetching,
    refetch,
    error,
  }
}
