import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from './cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-violet-300/70 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'
