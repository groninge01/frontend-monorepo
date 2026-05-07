'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from './cn'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex rounded-lg border border-[var(--mobile-border-zen)] bg-[var(--mobile-bg-level-2)] p-1',
        className
      )}
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
        'min-h-9 rounded-md px-3 text-sm font-medium text-[var(--mobile-text-secondary)] data-[state=active]:bg-[var(--mobile-bg-level-3)] data-[state=active]:text-[var(--mobile-text-primary)]',
        className
      )}
      {...props}
    />
  )
}

export const TabsContent = TabsPrimitive.Content
