'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [status, setStatus] = useState<'accepted' | 'dismissed' | 'ready' | 'unsupported'>(
    'unsupported'
  )

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setPromptEvent(event as BeforeInstallPromptEvent)
      setStatus('ready')
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  async function promptInstall() {
    if (!promptEvent) return

    await promptEvent.prompt()
    const choice = await promptEvent.userChoice
    setStatus(choice.outcome)
    setPromptEvent(null)
  }

  return {
    canPrompt: !!promptEvent,
    promptInstall,
    status,
  }
}
