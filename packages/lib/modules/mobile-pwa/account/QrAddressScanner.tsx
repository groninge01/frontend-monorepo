'use client'

import { Camera, X } from 'lucide-react'
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

type BarcodeDetectorInstance = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorInstance

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor
  }
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
    let animationFrameId: number | undefined
    let stream: MediaStream | undefined

    async function startScanner() {
      handledPayloadRef.current = false

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('Camera access is unavailable in this browser. Paste the QR payload instead.')
        return
      }

      if (!window.BarcodeDetector) {
        setStatus('QR scanning is unavailable in this browser. Paste the QR payload instead.')
        return
      }

      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: 'environment' } },
        })

        if (cancelled) {
          stopStream(stream)
          return
        }

        const video = videoRef.current
        if (!video) return

        video.srcObject = stream
        await video.play()

        async function scanFrame() {
          const currentVideo = videoRef.current
          if (cancelled || !currentVideo || handledPayloadRef.current) return

          try {
            const codes = await detector.detect(currentVideo)
            const payload = codes[0]?.rawValue
            if (payload) handlePayload(payload)
          } catch {
            setStatus('Could not read a QR code from this frame.')
          }

          animationFrameId = window.requestAnimationFrame(scanFrame)
        }

        animationFrameId = window.requestAnimationFrame(scanFrame)
      } catch {
        setStatus('Camera permission was not granted. Paste the QR payload instead.')
      }
    }

    startScanner()

    return () => {
      cancelled = true
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
      if (stream) stopStream(stream)
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

function stopStream(stream: MediaStream) {
  stream.getTracks().forEach(track => track.stop())
}
