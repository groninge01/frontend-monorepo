import { Address } from 'viem'
import { LS_KEYS } from '../../local-storage/local-storage.constants'
import { isSameAddress } from '../../../shared/utils/addresses'
import { WatchedAccount } from './watchlist.types'

type AddWatchedAccountInput = {
  address: Address
  ensName?: string
  label?: string
}

export function getWatchedAccounts(): WatchedAccount[] {
  const rawWatchlist = localStorage.getItem(LS_KEYS.MobilePwa.Watchlist)
  if (!rawWatchlist) return []

  try {
    const parsed = JSON.parse(rawWatchlist)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(LS_KEYS.MobilePwa.Watchlist)
    return []
  }
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

export function getActiveWatchedAccount(): WatchedAccount | undefined {
  const activeAddress = getActiveAccountAddress()
  if (!activeAddress) return undefined

  return getWatchedAccounts().find(account => isSameAddress(account.address, activeAddress))
}

function setWatchedAccounts(accounts: WatchedAccount[]): void {
  localStorage.setItem(LS_KEYS.MobilePwa.Watchlist, JSON.stringify(accounts))
}

function setActiveAccountAddress(address: Address): void {
  localStorage.setItem(LS_KEYS.MobilePwa.ActiveAccount, address)
}

function getActiveAccountAddress(): Address | undefined {
  return (localStorage.getItem(LS_KEYS.MobilePwa.ActiveAccount) || undefined) as Address | undefined
}
