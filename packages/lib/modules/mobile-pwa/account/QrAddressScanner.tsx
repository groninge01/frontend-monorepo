'use client'

import { Camera, X } from 'lucide-react'
import QrScanner from 'qr-scanner'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { parseQrAddressPayload } from '../watchlist/qr-parser'
import { useWatchlist } from '../watchlist/useWatchlist'

type QrAddressScannerProps = {
  trigger?: React.ReactNode
  onAccountAdded?: () => void
}

export function QrAddressScanner({ onAccountAdded, trigger }: QrAddressScannerProps) {
  const { addAccount } = useWatchlist()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('Point the camera at an address QR code.')
  const videoRef = useRef<HTMLVideoElement>(null)
  const handledPayloadRef = useRef(false)

  const handlePayload = useCallback(
    (payload: string) => {
      const result = parseQrAddressPayload(payload)

      if (result.type === 'invalid') {
        setStatus('This QR code does not contain a supported wallet address.')
        return
      }

      if (result.type === 'ens') {
        setStatus('ENS QR payloads are recognized, but ENS resolution is not wired yet.')
        return
      }

      handledPayloadRef.current = true
      addAccount({ address: result.address })
      setStatus('Address saved.')
      setOpen(false)
      onAccountAdded?.()
    },
    [addAccount, onAccountAdded]
  )

  useEffect(() => {
    if (!open) return

    let cancelled = false
    let scanner: QrScanner | undefined

    async function startScanner() {
      handledPayloadRef.current = false

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('Camera access is unavailable in this browser. Paste the QR payload instead.')
        return
      }

      try {
        const video = videoRef.current
        if (!video) return

        scanner = new QrScanner(
          video,
          result => {
            if (cancelled || handledPayloadRef.current) return
            handlePayload(result.data)
          },
          {
            highlightScanRegion: false,
            maxScansPerSecond: 8,
            onDecodeError: error => {
              if (error !== QrScanner.NO_QR_CODE_FOUND) {
                setStatus('Could not read a QR code from this frame.')
              }
            },
            preferredCamera: 'environment',
            returnDetailedScanResult: true,
          }
        )

        await scanner.start()
      } catch {
        setStatus('Camera permission was not granted. Paste the QR payload instead.')
      }
    }

    startScanner()

    return () => {
      cancelled = true
      scanner?.destroy()
      if (videoRef.current) videoRef.current.srcObject = null
    }
  }, [handlePayload, open])

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="secondary">
            <Camera aria-hidden className="h-4 w-4" />
            Scan
          </Button>
        )}
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay className="bg-black" />
        <SheetContent className="inset-0 max-h-none max-w-none rounded-none border-0 bg-black p-0">
          <SheetTitle className="sr-only">Scan address</SheetTitle>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            ref={videoRef}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_36%,rgba(0,0,0,0.46)_58%,rgba(0,0,0,0.72)_100%)]" />
          <button
            aria-label="Close scanner"
            className="absolute right-4 top-[calc(env(safe-area-inset-top)+16px)] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/70"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X aria-hidden size={24} />
          </button>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-10">
            <div className="relative aspect-square w-full max-w-72">
              <span className="absolute left-0 top-0 h-12 w-12 rounded-tl-2xl border-l-4 border-t-4 border-white" />
              <span className="absolute right-0 top-0 h-12 w-12 rounded-tr-2xl border-r-4 border-t-4 border-white" />
              <span className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-2xl border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-0 right-0 h-12 w-12 rounded-br-2xl border-b-4 border-r-4 border-white" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+32px)] px-6 text-center">
            <p className="rounded-full bg-black/60 px-4 py-3 text-sm leading-5 text-white backdrop-blur-md">
              {status}
            </p>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
