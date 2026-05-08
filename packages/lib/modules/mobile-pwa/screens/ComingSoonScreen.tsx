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
    <section className="space-y-5">
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

      <div className="space-y-3 pt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="rounded-2xl bg-[var(--mobile-bg-level-2)] p-4" key={index}>
            <div className="h-4 w-2/3 rounded-md bg-[var(--mobile-gradient-skeleton)] bg-[length:220%_100%]" />
            <div className="mt-3 h-3 w-1/3 rounded-md bg-[var(--mobile-gradient-skeleton)] bg-[length:220%_100%]" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-8 rounded-xl bg-[var(--mobile-bg-level-0)]" />
              <div className="h-8 rounded-xl bg-[var(--mobile-bg-level-0)]" />
              <div className="h-8 rounded-xl bg-[var(--mobile-bg-level-0)]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
