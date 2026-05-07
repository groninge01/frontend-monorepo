import { Address, getAddress, isAddress } from 'viem'
import { WatchAccountInputResult } from './watchlist.types'

const ensNamePattern = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/i
const completeEthereumAddressPattern = /^0x[a-fA-F0-9]{40}$/

export function isCompleteEthereumAddress(input: string): boolean {
  return completeEthereumAddressPattern.test(input.trim())
}

export function parseWatchAccountInput(input: string): WatchAccountInputResult {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return { type: 'invalid', reason: 'empty' }
  }

  if (isAddress(trimmedInput)) {
    return { type: 'address', address: getAddress(trimmedInput) as Address }
  }

  if (ensNamePattern.test(trimmedInput)) {
    return { type: 'ens', name: trimmedInput.toLowerCase() }
  }

  return { type: 'invalid', reason: 'invalid-format' }
}
