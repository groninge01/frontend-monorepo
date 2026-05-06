'use client'

import { DialogProps } from '@radix-ui/react-dialog'
import { Drawer } from 'vaul'
import { cn } from './cn'

export const Sheet = Drawer.Root
export const SheetTrigger = Drawer.Trigger
export const SheetClose = Drawer.Close

export function SheetPortal(props: DialogProps & { children: React.ReactNode }) {
  return <Drawer.Portal {...props} />
}

export function SheetOverlay({ className, ...props }: React.ComponentProps<typeof Drawer.Overlay>) {
  return <Drawer.Overlay className={cn('fixed inset-0 z-50 bg-black/55', className)} {...props} />
}

export function SheetContent({ className, ...props }: React.ComponentProps<typeof Drawer.Content>) {
  return (
    <Drawer.Content
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] max-w-[430px] rounded-t-2xl border border-white/10 bg-[#151923] px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 text-white outline-none',
        className
      )}
      {...props}
    />
  )
}

export function SheetHandle() {
  return <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
}

export const SheetTitle = Drawer.Title
export const SheetDescription = Drawer.Description
