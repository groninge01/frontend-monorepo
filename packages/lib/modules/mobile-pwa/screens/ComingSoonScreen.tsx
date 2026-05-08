import { MobileShell } from '../layout/MobileShell'
import { MobileTab, MobileTabBar } from '../navigation/MobileTabBar'
import { StatusChip } from '../ui/status-chip'

type ComingSoonScreenProps = {
  activeTab: MobileTab
  previousPreview?: React.ReactNode
  previousHref?: string
}

export function ComingSoonScreen({
  activeTab,
  previousHref,
  previousPreview,
}: ComingSoonScreenProps) {
  return (
    <MobileShell
      bottomNavigation={<MobileTabBar activeTab={activeTab} />}
      previousPreview={previousPreview}
      swipeNavigation={{ previousHref }}
    >
      <PoolsPreview />
    </MobileShell>
  )
}

export function PoolsPreview() {
  return (
    <section className="flex min-h-[70dvh] flex-col justify-between">
      <div className="space-y-4">
        <StatusChip>Coming later</StatusChip>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-normal">Pools</h1>
          <p className="max-w-72 text-sm leading-6 text-[var(--mobile-text-secondary)]">
            This area is part of the mobile app skeleton and will be built after the portfolio
            dashboard MVP.
          </p>
        </div>
      </div>

      <section className="rounded-3xl bg-[var(--mobile-bg-level-2)] p-4">
        <p className="text-sm text-[var(--mobile-text-primary)]">
          Dashboard and Settings are available in this MVP. Transaction flows stay out of scope.
        </p>
      </section>
    </section>
  )
}
