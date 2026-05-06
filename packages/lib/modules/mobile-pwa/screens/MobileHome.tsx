import { MobileShell } from '../layout/MobileShell'
import { MobileTabBar } from '../navigation/MobileTabBar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { StatusChip } from '../ui/status-chip'

export function MobileHome() {
  return (
    <MobileShell
      bottomNavigation={<MobileTabBar activeTab="dashboard" />}
      statusSlot={<StatusChip tone="neutral">Watch mode</StatusChip>}
    >
      <section className="space-y-5">
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-violet-200">Balancer mobile</p>
          <h1 className="text-4xl font-semibold tracking-normal">Portfolio dashboard</h1>
          <p className="text-sm leading-6 text-slate-400">
            Track Balancer positions by address. Wallet connection and transactions are not part of
            this MVP.
          </p>
        </div>

        <Card className="space-y-3 p-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">Watch an address</h2>
            <p className="text-sm text-slate-400">
              Enter an address or ENS name to load a dashboard.
            </p>
          </div>
          <Input placeholder="0x... or name.eth" />
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="primary">
              Continue
            </Button>
            <Button type="button" variant="secondary">
              Scan QR
            </Button>
          </div>
        </Card>

        <Card className="space-y-3 p-4">
          <div>
            <p className="text-xs uppercase text-slate-500">Portfolio value</p>
            <p className="mt-2 text-4xl font-semibold">$0.00</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Claimable</p>
              <p className="mt-1 font-semibold text-white">$0.00</p>
            </div>
            <div>
              <p className="text-slate-500">Positions</p>
              <p className="mt-1 font-semibold text-white">0 pools</p>
            </div>
          </div>
        </Card>
      </section>
    </MobileShell>
  )
}
