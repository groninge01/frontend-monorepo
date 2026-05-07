'use client'

import { FormEvent, useState } from 'react'
import { Clipboard, QrCode } from 'lucide-react'
import { useMandatoryContext } from '../../../shared/utils/contexts'
import { useWatchlist } from './useWatchlist'
import { WatchAddressProviderContext } from './WatchAddressProvider'
import { parseWatchAccountInput } from './address-input'
import { QrAddressScanner } from '../account/QrAddressScanner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHandle,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
} from '../ui/sheet'

type AddressInputProps = {
  onAccountAdded?: () => void
}

function AddressInput({ onAccountAdded }: AddressInputProps) {
  const { addAccount } = useWatchlist()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | undefined>()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = parseWatchAccountInput(input)

    if (result.type === 'invalid') {
      setError(
        result.reason === 'empty' ? 'Enter an address or ENS name.' : 'Invalid address or ENS name.'
      )
      return
    }

    if (result.type === 'ens') {
      setError('ENS resolution is not wired yet. Paste a 0x address for now.')
      return
    }

    addAccount({ address: result.address })
    setInput('')
    setError(undefined)
    onAccountAdded?.()
  }

  async function pasteFromClipboard() {
    const clipboardText = await navigator.clipboard?.readText()
    if (clipboardText) {
      setInput(clipboardText)
      const result = parseWatchAccountInput(clipboardText)
      if (result.type === 'address') {
        addAccount({ address: result.address })
        setInput('')
        setError(undefined)
        onAccountAdded?.()
      }
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="relative">
        <Input
          autoCapitalize="none"
          autoComplete="off"
          className="pr-24"
          onChange={event => setInput(event.target.value)}
          placeholder="0x... or name.eth"
          spellCheck={false}
          value={input}
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          <button
            aria-label="Paste address"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
            onClick={pasteFromClipboard}
            type="button"
          >
            <Clipboard aria-hidden size={18} />
          </button>
          <QrAddressScanner
            onAccountAdded={onAccountAdded}
            trigger={
              <button
                aria-label="Scan address"
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                type="button"
              >
                <QrCode aria-hidden size={20} />
              </button>
            }
          />
        </div>
      </div>
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
      <Button className="w-full" type="submit" variant="primary">
        Continue
      </Button>
    </form>
  )
}

export function AddressInputSheet({ onAccountAdded }: AddressInputProps) {
  const { open: isSheetOpen, setOpen } = useMandatoryContext(
    WatchAddressProviderContext,
    'WatchAddress'
  )

  return (
    <Sheet onOpenChange={setOpen} open={isSheetOpen}>
      <SheetPortal>
        <SheetOverlay />
        <SheetContent className="space-y-4">
          <SheetHandle />
          <div className="space-y-1">
            <SheetTitle className="text-base font-semibold">Add address</SheetTitle>
            <SheetDescription className="text-sm leading-6 text-slate-400">
              Save an address and make it active on this device.
            </SheetDescription>
          </div>
          <AddressInput onAccountAdded={onAccountAdded} />
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
