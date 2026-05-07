import { Address } from 'viem'
import { LS_KEYS } from '../../local-storage/local-storage.constants'
import { isSameAddress } from '../../../shared/utils/addresses'
import { MobilePortfolioViewModel } from '../portfolio/mobilePortfolio.types'

export type CachedDashboard = MobilePortfolioViewModel & {
  cachedAt: number
}

export function readCachedDashboard(input?: { account?: Address }): CachedDashboard | undefined {
  if (!hasLocalStorage()) return undefined

  const raw = localStorage.getItem(LS_KEYS.MobilePwa.CachedDashboard)
  if (!raw) return undefined

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return undefined
    if (input?.account && !isSameAddress(parsed.account, input.account)) return undefined

    return parsed
  } catch {
    localStorage.removeItem(LS_KEYS.MobilePwa.CachedDashboard)
    return undefined
  }
}

export function writeCachedDashboard(data: MobilePortfolioViewModel, cachedAt: number): void {
  if (!hasLocalStorage()) return

  localStorage.setItem(
    LS_KEYS.MobilePwa.CachedDashboard,
    JSON.stringify({
      ...data,
      cachedAt,
    })
  )
}

function hasLocalStorage(): boolean {
  return typeof localStorage !== 'undefined'
}
