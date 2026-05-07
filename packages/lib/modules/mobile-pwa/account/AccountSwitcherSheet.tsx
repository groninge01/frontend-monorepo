'use client'

import { Check, ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Address } from 'viem'
import { abbreviateAddress, isSameAddress } from '../../../shared/utils/addresses'
import { Button } from '../ui/button'
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
import { useWatchlist } from '../watchlist/useWatchlist'
import { WatchedAccount } from '../watchlist/watchlist.types'

type AccountSwitcherSheetProps = {
  activeAccount: WatchedAccount
}

export function AccountSwitcherSheet({ activeAccount }: AccountSwitcherSheetProps) {
  const { accounts, removeAccount, selectAccount } = useWatchlist()
  const [open, setOpen] = useState(false)

  function selectAndClose(address: Address) {
    selectAccount(address)
    setOpen(false)
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="min-w-32 rounded-full px-3" type="button" variant="secondary">
          {abbreviateAddress(activeAccount.address)}
          <ChevronDown aria-hidden className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay />
        <SheetContent className="space-y-4">
          <SheetHandle />
          <div className="space-y-1">
            <SheetTitle className="text-base font-semibold">Wallet address</SheetTitle>
            <SheetDescription className="text-sm leading-6 text-slate-400">
              Switch or remove addresses saved on this device.
            </SheetDescription>
          </div>

          {accounts.length ? (
            <div className="space-y-1">
              {accounts.map(account => {
                const isActive = isSameAddress(account.address, activeAccount.address)

                return (
                  <div
                    className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl bg-white/[0.04] px-2 py-1"
                    key={account.address}
                  >
                    <button
                      className="min-h-12 rounded-lg px-2 text-left text-sm font-semibold text-white"
                      onClick={() => selectAndClose(account.address)}
                      type="button"
                    >
                      <span className="flex items-center gap-2">
                        {isActive ? (
                          <Check aria-hidden className="h-4 w-4 text-emerald-200" />
                        ) : null}
                        {abbreviateAddress(account.address)}
                      </span>
                    </button>
                    <Button
                      aria-label={`Remove ${abbreviateAddress(account.address)}`}
                      onClick={() => removeAccount(account.address)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 aria-hidden className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="rounded-xl bg-white/[0.04] p-3 text-sm text-slate-400">
              No watched addresses saved yet.
            </p>
          )}
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
