import { ReactNode } from 'react'
import { cn } from '../ui/cn'

type MobileShellProps = {
  children: ReactNode
  bottomNavigation?: ReactNode
  statusSlot?: ReactNode
}

export function MobileShell({ bottomNavigation, children, statusSlot }: MobileShellProps) {
  return (
    <div className="min-h-dvh bg-[#070a10] text-white">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-[#12161f] shadow-[0_0_80px_rgba(0,0,0,0.55)]">
        <div
          className={cn(
            'relative flex min-h-dvh flex-col',
            'pb-[calc(env(safe-area-inset-bottom)+80px)] pt-[env(safe-area-inset-top)]'
          )}
        >
          {statusSlot ? <div className="px-4 pt-3">{statusSlot}</div> : null}
          <main className="flex-1 px-4 py-4">{children}</main>
          {bottomNavigation}
        </div>
      </div>
    </div>
  )
}
