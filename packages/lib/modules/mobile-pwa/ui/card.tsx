import { HTMLAttributes, forwardRef } from 'react'
import { cn } from './cn'

export type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--mobile-border-zen)] bg-[var(--mobile-bg-level-2)] shadow-2xl',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Card.displayName = 'Card'
