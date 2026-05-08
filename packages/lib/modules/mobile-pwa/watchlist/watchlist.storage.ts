import { Address } from 'viem'
import { LS_KEYS } from '../../local-storage/local-storage.constants'
import { isSameAddress } from '../../../shared/utils/addresses'
import { WatchedAccount } from './watchlist.types'

type AddWatchedAccountInput = {
  address: Address
  ensName?: string
  label?: string
}

const emptyWatchlist: WatchedAccount[] = []
let cachedRawWatchlist: string | null | undefined
let cachedWatchlist = emptyWatchlist

export function getWatchedAccounts(): WatchedAccount[] {
  if (!hasLocalStorage()) return emptyWatchlist

  const rawWatchlist = localStorage.getItem(LS_KEYS.MobilePwa.Watchlist)
  if (!rawWatchlist) {
    cachedRawWatchlist = null
    cachedWatchlist = emptyWatchlist
    return cachedWatchlist
  }
  if (rawWatchlist === cachedRawWatchlist) return cachedWatchlist

  try {
    const parsed = JSON.parse(rawWatchlist)
    cachedRawWatchlist = rawWatchlist
    cachedWatchlist = Array.isArray(parsed) ? parsed : emptyWatchlist
    return cachedWatchlist
  } catch {
    localStorage.removeItem(LS_KEYS.MobilePwa.Watchlist)
    cachedRawWatchlist = null
    cachedWatchlist = emptyWatchlist
    return cachedWatchlist
  }
}

export function getServerWatchedAccountsSnapshot(): WatchedAccount[] {
  return emptyWatchlist
}

export function addWatchedAccount(input: AddWatchedAccountInput): WatchedAccount {
  const now = Date.now()
  const accounts = getWatchedAccounts()
  const existingAccount = accounts.find(account => isSameAddress(account.address, input.address))

  const account: WatchedAccount = existingAccount
    ? {
        ...existingAccount,
        ensName: input.ensName,
        label: input.label,
        lastSelectedAt: now,
      }
    : {
        address: input.address,
        ensName: input.ensName,
        label: input.label,
        addedAt: now,
        lastSelectedAt: now,
      }

  const nextAccounts = existingAccount
    ? accounts.map(item => (isSameAddress(item.address, input.address) ? account : item))
    : [...accounts, account]

  setWatchedAccounts(nextAccounts)
  setActiveAccountAddress(account.address)

  return account
}

export function removeWatchedAccount(address: Address): void {
  const nextAccounts = getWatchedAccounts().filter(
    account => !isSameAddress(account.address, address)
  )
  setWatchedAccounts(nextAccounts)

  const activeAddress = getActiveAccountAddress()
  if (!activeAddress || !isSameAddress(activeAddress, address)) return

  const nextActiveAccount = [...nextAccounts].sort((a, b) => b.lastSelectedAt - a.lastSelectedAt)[0]

  if (nextActiveAccount) {
    setActiveAccountAddress(nextActiveAccount.address)
  } else {
    localStorage.removeItem(LS_KEYS.MobilePwa.ActiveAccount)
  }
}

export function setActiveWatchedAccount(address: Address): WatchedAccount | undefined {
  const now = Date.now()
  let selectedAccount: WatchedAccount | undefined
  const nextAccounts = getWatchedAccounts().map(account => {
    if (!isSameAddress(account.address, address)) return account

    selectedAccount = {
      ...account,
      lastSelectedAt: now,
    }
    return selectedAccount
  })

  if (!selectedAccount) return undefined

  setWatchedAccounts(nextAccounts)
  setActiveAccountAddress(selectedAccount.address)

  return selectedAccount
}

export function getActiveWatchedAccount(
  accounts = getWatchedAccounts()
): WatchedAccount | undefined {
  if (!accounts.length) return undefined

  const activeAddress = getActiveAccountAddress()
  if (!activeAddress) return getLastSelectedAccount(accounts)

  return (
    accounts.find(account => isSameAddress(account.address, activeAddress)) ||
    getLastSelectedAccount(accounts)
  )
}

function getLastSelectedAccount(accounts: WatchedAccount[]): WatchedAccount | undefined {
  return [...accounts].sort((a, b) => b.lastSelectedAt - a.lastSelectedAt)[0]
}

function setWatchedAccounts(accounts: WatchedAccount[]): void {
  if (!hasLocalStorage()) return

  cachedWatchlist = accounts
  cachedRawWatchlist = JSON.stringify(accounts)
  localStorage.setItem(LS_KEYS.MobilePwa.Watchlist, JSON.stringify(accounts))
}

function setActiveAccountAddress(address: Address): void {
  if (!hasLocalStorage()) return

  localStorage.setItem(LS_KEYS.MobilePwa.ActiveAccount, address)
}

function getActiveAccountAddress(): Address | undefined {
  if (!hasLocalStorage()) return undefined

  return (localStorage.getItem(LS_KEYS.MobilePwa.ActiveAccount) || undefined) as Address | undefined
}

function hasLocalStorage(): boolean {
  return typeof localStorage !== 'undefined'
}
