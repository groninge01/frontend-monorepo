import { ReactNode } from 'react'
import { MobileTopBar } from '../navigation/MobileTopBar'
import { cn } from '../ui/cn'

type MobileShellProps = {
  children: ReactNode
  bottomNavigation?: ReactNode
}

export function MobileShell({ bottomNavigation, children }: MobileShellProps) {
  return (
    <div className="min-h-dvh bg-[var(--mobile-bg-base)] text-[var(--mobile-text-primary)]">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-[var(--mobile-bg-level-1)] shadow-[0_0_80px_rgba(0,0,0,0.3)]">
        <div
          className={cn(
            'relative flex min-h-dvh flex-col',
            'pb-[calc(env(safe-area-inset-bottom)+80px)]'
          )}
        >
          <MobileTopBar />
          <main className="flex-1 px-4 py-4">{children}</main>
          {bottomNavigation}
        </div>
      </div>
    </div>
  )
}
