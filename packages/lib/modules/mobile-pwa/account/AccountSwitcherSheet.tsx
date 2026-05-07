'use client'

import { Check, ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Address } from 'viem'
import { abbreviateAddress, isSameAddress } from '../../../shared/utils/addresses'
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
        <button
          className="flex min-h-10 min-w-32 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-medium text-slate-200 transition hover:text-white"
          type="button"
        >
          <span className="max-w-28 truncate">{abbreviateAddress(activeAccount.address)}</span>
          <ChevronDown aria-hidden className="h-4 w-4 text-slate-500" />
        </button>
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
                        <span>{abbreviateAddress(account.address)}</span>
                        {isActive ? (
                          <span className="text-xs font-medium text-slate-500">Read-only</span>
                        ) : null}
                      </span>
                    </button>
                    <button
                      aria-label={`Remove ${abbreviateAddress(account.address)}`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                      onClick={() => removeAccount(account.address)}
                      type="button"
                    >
                      <Trash2 aria-hidden className="h-4 w-4" />
                    </button>
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
