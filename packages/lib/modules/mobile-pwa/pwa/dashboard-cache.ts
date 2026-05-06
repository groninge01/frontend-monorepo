import { LS_KEYS } from '../../local-storage/local-storage.constants'
import { MobilePortfolioViewModel } from '../portfolio/mobilePortfolio.types'

export type CachedDashboard = MobilePortfolioViewModel & {
  cachedAt: number
}

export function readCachedDashboard(): CachedDashboard | undefined {
  const raw = localStorage.getItem(LS_KEYS.MobilePwa.CachedDashboard)
  if (!raw) return undefined

  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : undefined
  } catch {
    localStorage.removeItem(LS_KEYS.MobilePwa.CachedDashboard)
    return undefined
  }
}

export function writeCachedDashboard(data: MobilePortfolioViewModel, cachedAt: number): void {
  localStorage.setItem(
    LS_KEYS.MobilePwa.CachedDashboard,
    JSON.stringify({
      ...data,
      cachedAt,
    })
  )
}
