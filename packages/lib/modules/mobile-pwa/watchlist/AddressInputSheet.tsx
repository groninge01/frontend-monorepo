'use client'

import { useRef, useState } from 'react'
import { Clipboard, QrCode } from 'lucide-react'
import { useMandatoryContext } from '../../../shared/utils/contexts'
import { useWatchlist } from './useWatchlist'
import { WatchAddressProviderContext } from './WatchAddressProvider'
import { isCompleteEthereumAddress, parseWatchAccountInput } from './address-input'
import { QrAddressScanner } from '../account/QrAddressScanner'
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
  const submittedAddressRef = useRef<string | undefined>(undefined)

  function validateAndAddAddress(value: string) {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      submittedAddressRef.current = undefined
      setError(undefined)
      return
    }

    if (!trimmedValue.startsWith('0x')) {
      submittedAddressRef.current = undefined
      setError('Address must start with 0x.')
      return
    }

    if (trimmedValue.length < 42) {
      submittedAddressRef.current = undefined
      setError(undefined)
      return
    }

    if (!isCompleteEthereumAddress(trimmedValue)) {
      submittedAddressRef.current = undefined
      setError('Address must be 0x followed by 40 hexadecimal characters.')
      return
    }

    const result = parseWatchAccountInput(trimmedValue)

    if (result.type === 'invalid') {
      submittedAddressRef.current = undefined
      setError('Invalid address.')
      return
    }

    if (result.type === 'ens') {
      submittedAddressRef.current = undefined
      setError('ENS resolution is not wired yet. Paste a 0x address for now.')
      return
    }

    if (submittedAddressRef.current === result.address) return

    submittedAddressRef.current = result.address
    addAccount({ address: result.address })
    setInput('')
    setError(undefined)
    onAccountAdded?.()
  }

  async function pasteFromClipboard() {
    const clipboardText = await navigator.clipboard?.readText()
    if (clipboardText) {
      setInput(clipboardText)
      validateAndAddAddress(clipboardText)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          autoCapitalize="none"
          autoComplete="off"
          className="pr-24"
          onChange={event => {
            setInput(event.target.value)
            validateAndAddAddress(event.target.value)
          }}
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
    </div>
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
