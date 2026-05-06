'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { abbreviateAddress } from '../../../shared/utils/addresses'
import { AddressEntry } from '../account/AddressEntry'
import { QrAddressScanner } from '../account/QrAddressScanner'
import { MobileShell } from '../layout/MobileShell'
import { MobileTabBar } from '../navigation/MobileTabBar'
import { useInstallPrompt } from '../pwa/useInstallPrompt'
import { useOnlineStatus } from '../pwa/useOnlineStatus'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHandle,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { StatusChip } from '../ui/status-chip'
import { useWatchlist } from '../watchlist/useWatchlist'

export function MobileSettings() {
  const { accounts, activeAccount, removeAccount, selectAccount } = useWatchlist()
  const isOnline = useOnlineStatus()
  const installPrompt = useInstallPrompt()
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)

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
          {accounts.length ? (
            <div className="space-y-2">
              {accounts.map(account => {
                const isActive = activeAccount?.address === account.address

                return (
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3"
                    key={account.address}
                  >
                    <button
                      className="min-h-11 flex-1 text-left text-sm font-medium text-white"
                      onClick={() => selectAccount(account.address)}
                      type="button"
                    >
                      {abbreviateAddress(account.address)}
                      {isActive ? (
                        <span className="ml-2 text-xs text-emerald-200">Active</span>
                      ) : null}
                    </button>
                    <Button
                      onClick={() => removeAccount(account.address)}
                      size="sm"
                      type="button"
                      variant="danger"
                    >
                      Remove
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-400">
              No watched addresses saved yet.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Sheet onOpenChange={setIsAddSheetOpen} open={isAddSheetOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="secondary">
                  <Plus aria-hidden className="h-4 w-4" />
                  Add
                </Button>
              </SheetTrigger>
              <SheetPortal>
                <SheetOverlay />
                <SheetContent className="space-y-4">
                  <SheetHandle />
                  <div className="space-y-1">
                    <SheetTitle className="text-base font-semibold">Add address</SheetTitle>
                    <SheetDescription className="text-sm leading-6 text-slate-400">
                      Save another address and make it active on this device.
                    </SheetDescription>
                  </div>
                  <AddressEntry onAccountAdded={() => setIsAddSheetOpen(false)} />
                </SheetContent>
              </SheetPortal>
            </Sheet>
            <QrAddressScanner />
          </div>
        </Card>

        <Card className="space-y-2 p-4">
          <h2 className="text-sm font-semibold text-white">PWA status</h2>
          <p className="text-sm text-slate-400">
            {isOnline
              ? 'Online and ready for live portfolio data.'
              : 'Offline. Cached dashboard data may be shown.'}
          </p>
          <Button
            disabled={!installPrompt.canPrompt}
            onClick={installPrompt.promptInstall}
            type="button"
            variant="secondary"
          >
            {installPrompt.canPrompt ? 'Install app' : 'Install unavailable'}
          </Button>
        </Card>
      </section>
    </MobileShell>
  )
}
