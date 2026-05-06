'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from './cn'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex rounded-lg border border-white/10 bg-white/[0.06] p-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'min-h-9 rounded-md px-3 text-sm font-medium text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white',
        className
      )}
      {...props}
    />
  )
}

export const TabsContent = TabsPrimitive.Content
