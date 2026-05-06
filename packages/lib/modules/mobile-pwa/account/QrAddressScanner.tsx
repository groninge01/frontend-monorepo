'use client'

import { Camera, Clipboard } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
import { parseQrAddressPayload } from '../watchlist/qr-parser'
import { useWatchlist } from '../watchlist/useWatchlist'

type QrAddressScannerProps = {
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

export function QrAddressScanner({ onAccountAdded }: QrAddressScannerProps) {
  const { addAccount } = useWatchlist()
  const [open, setOpen] = useState(false)
  const [manualPayload, setManualPayload] = useState('')
  const [status, setStatus] = useState('Point the camera at an address QR code.')
  const videoRef = useRef<HTMLVideoElement>(null)
  const handledPayloadRef = useRef(false)

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
  }, [open])

  function handlePayload(payload: string) {
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
    setManualPayload('')
    setStatus('Address saved.')
    setOpen(false)
    onAccountAdded?.()
  }

  async function pastePayload() {
    const clipboardText = await navigator.clipboard?.readText()
    if (clipboardText) {
      setManualPayload(clipboardText)
      handlePayload(clipboardText)
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button type="button" variant="secondary">
          <Camera aria-hidden className="h-4 w-4" />
          Scan
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay />
        <SheetContent className="space-y-4">
          <SheetHandle />
          <div className="space-y-1">
            <SheetTitle className="text-base font-semibold">Scan address</SheetTitle>
            <SheetDescription className="text-sm leading-6 text-slate-400">
              Scan an Ethereum address QR code or paste its payload.
            </SheetDescription>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
            <video className="h-full w-full object-cover" muted playsInline ref={videoRef} />
            <div className="pointer-events-none absolute inset-8 rounded-lg border border-white/40" />
          </div>
          <p className="min-h-10 text-sm leading-5 text-slate-300">{status}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={pastePayload} type="button" variant="secondary">
              <Clipboard aria-hidden className="h-4 w-4" />
              Paste
            </Button>
            <Button onClick={() => handlePayload(manualPayload)} type="button" variant="primary">
              Save
            </Button>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}

function stopStream(stream: MediaStream) {
  stream.getTracks().forEach(track => track.stop())
}
