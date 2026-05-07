import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from './cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-lg border border-[var(--mobile-border-base)] bg-[var(--mobile-bg-level-0)] px-4 text-base text-[var(--mobile-text-primary)] outline-none placeholder:text-[var(--mobile-text-muted)] focus:border-[var(--mobile-purple-highlight)] focus:ring-2 focus:ring-[rgba(159,149,240,0.2)] disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'
