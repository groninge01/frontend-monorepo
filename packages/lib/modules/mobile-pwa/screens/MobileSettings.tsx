'use client'

import { MobileShell } from '../layout/MobileShell'
import { MobileTabBar } from '../navigation/MobileTabBar'
import { useInstallPrompt } from '../pwa/useInstallPrompt'
import { useOnlineStatus } from '../pwa/useOnlineStatus'
import { Button } from '../ui/button'

export function MobileSettings() {
  const isOnline = useOnlineStatus()
  const installPrompt = useInstallPrompt()

  return (
    <MobileShell bottomNavigation={<MobileTabBar activeTab="settings" />}>
      <section className="space-y-6">
        <div className="space-y-2 pt-2">
          <h1 className="text-3xl font-semibold tracking-normal">Settings</h1>
          <p className="text-sm leading-6 text-slate-400">
            Device-level app preferences and installation status.
          </p>
        </div>

        <section className="space-y-3 rounded-2xl bg-white/[0.04] p-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">PWA status</h2>
            <p className="text-sm text-slate-400">
              {isOnline
                ? 'Online and ready for live portfolio data.'
                : 'Offline. Cached dashboard data may be shown.'}
            </p>
          </div>
          <Button
            disabled={!installPrompt.canPrompt}
            onClick={installPrompt.promptInstall}
            type="button"
            variant="secondary"
          >
            {installPrompt.canPrompt ? 'Install app' : 'Install unavailable'}
          </Button>
        </section>
      </section>
    </MobileShell>
  )
}
