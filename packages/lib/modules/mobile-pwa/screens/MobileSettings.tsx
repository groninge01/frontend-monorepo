import { MobileShell } from '../layout/MobileShell'
import { MobileTabBar } from '../navigation/MobileTabBar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { StatusChip } from '../ui/status-chip'

export function MobileSettings() {
  return (
    <MobileShell
      bottomNavigation={<MobileTabBar activeTab="settings" />}
      statusSlot={<StatusChip tone="neutral">Local watchlist</StatusChip>}
    >
      <section className="space-y-5">
        <div className="space-y-2 pt-2">
          <h1 className="text-3xl font-semibold tracking-normal">Settings</h1>
          <p className="text-sm leading-6 text-slate-400">
            Manage watched addresses and app-level PWA state.
          </p>
        </div>

        <Card className="space-y-3 p-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">Watched addresses</h2>
            <p className="text-sm text-slate-400">
              Address management will live here and remain local to this device.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary">
              Add
            </Button>
            <Button type="button" variant="secondary">
              Scan
            </Button>
          </div>
        </Card>

        <Card className="space-y-2 p-4">
          <h2 className="text-sm font-semibold text-white">PWA status</h2>
          <p className="text-sm text-slate-400">
            Install prompts and offline state will surface here when browser support is available.
          </p>
        </Card>
      </section>
    </MobileShell>
  )
}
