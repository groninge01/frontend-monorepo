import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Address } from 'viem'
import { LS_KEYS } from '../../local-storage/local-storage.constants'
import {
  addWatchedAccount,
  getActiveWatchedAccount,
  getServerWatchedAccountsSnapshot,
  getWatchedAccounts,
  removeWatchedAccount,
  setActiveWatchedAccount,
} from './watchlist.storage'

const address = '0xba100000625a3754423978a60c9317c58a424e3d' as Address
const sameAddressDifferentCase = '0xBA100000625A3754423978A60C9317C58A424E3D' as Address
const otherAddress = '0x0000000000000000000000000000000000000001' as Address

describe('watchlist storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.setSystemTime(new Date('2026-05-06T10:00:00.000Z'))
  })

  test('adds a watched account and selects it as active', () => {
    addWatchedAccount({ address, ensName: 'balancer.eth' })

    expect(getWatchedAccounts()).toEqual([
      {
        address,
        ensName: 'balancer.eth',
        addedAt: 1778061600000,
        lastSelectedAt: 1778061600000,
      },
    ])
    expect(getActiveWatchedAccount()).toEqual(getWatchedAccounts()[0])
  })

  test('deduplicates addresses case-insensitively and updates selection time', () => {
    addWatchedAccount({ address })
    vi.setSystemTime(new Date('2026-05-06T10:01:00.000Z'))
    addWatchedAccount({ address: sameAddressDifferentCase, label: 'Treasury' })

    expect(getWatchedAccounts()).toEqual([
      {
        address,
        label: 'Treasury',
        addedAt: 1778061600000,
        lastSelectedAt: 1778061660000,
      },
    ])
  })

  test('removes active account and selects the most recently selected remaining account', () => {
    addWatchedAccount({ address })
    vi.setSystemTime(new Date('2026-05-06T10:01:00.000Z'))
    addWatchedAccount({ address: otherAddress })

    removeWatchedAccount(otherAddress)

    expect(getWatchedAccounts()).toHaveLength(1)
    expect(getActiveWatchedAccount()?.address).toBe(address)
  })

  test('sets an existing watched account as active', () => {
    addWatchedAccount({ address })
    addWatchedAccount({ address: otherAddress })
    vi.setSystemTime(new Date('2026-05-06T10:02:00.000Z'))

    setActiveWatchedAccount(address)

    expect(getActiveWatchedAccount()?.address).toBe(address)
    expect(getActiveWatchedAccount()?.lastSelectedAt).toBe(1778061720000)
  })

  test('clears corrupted watchlist JSON', () => {
    localStorage.setItem(LS_KEYS.MobilePwa.Watchlist, '{')

    expect(getWatchedAccounts()).toEqual([])
    expect(localStorage.getItem(LS_KEYS.MobilePwa.Watchlist)).toBeNull()
  })

  test('returns stable snapshots for React external store reads', () => {
    addWatchedAccount({ address })

    expect(getWatchedAccounts()).toBe(getWatchedAccounts())
    expect(getServerWatchedAccountsSnapshot()).toBe(getServerWatchedAccountsSnapshot())
  })
})
