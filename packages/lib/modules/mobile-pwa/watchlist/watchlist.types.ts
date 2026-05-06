import { Address } from 'viem'

export type WatchedAccount = {
  address: Address
  ensName?: string
  label?: string
  addedAt: number
  lastSelectedAt: number
}

export type WatchAccountInputResult =
  | { type: 'address'; address: Address }
  | { type: 'ens'; name: string }
  | { type: 'invalid'; reason: 'empty' | 'invalid-format' }
