import { MobileShell } from '../layout/MobileShell'
import { MobileTab, MobileTabBar } from '../navigation/MobileTabBar'
import { StatusChip } from '../ui/status-chip'

type ComingSoonScreenProps = {
  activeTab: MobileTab
  title: string
}

export function ComingSoonScreen({ activeTab, title }: ComingSoonScreenProps) {
  return (
    <MobileShell bottomNavigation={<MobileTabBar activeTab={activeTab} />}>
      <section className="flex min-h-[70dvh] flex-col justify-between">
        <div className="space-y-4">
          <StatusChip>Coming later</StatusChip>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
            <p className="max-w-72 text-sm leading-6 text-slate-400">
              This area is part of the mobile app skeleton and will be built after the portfolio
              dashboard MVP.
            </p>
          </div>
        </div>

        <section className="rounded-3xl bg-white/[0.035] p-4">
          <p className="text-sm text-slate-300">
            Dashboard and Settings are available in this MVP. Transaction flows stay out of scope.
          </p>
        </section>
      </section>
    </MobileShell>
  )
}
