import { HTMLAttributes } from 'react'
import { cn } from './cn'

export type StatusChipProps = HTMLAttributes<HTMLDivElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}

export function StatusChip({ className, tone = 'neutral', ...props }: StatusChipProps) {
  const toneClass = {
    danger: 'border-red-400/30 bg-red-500/10 text-red-100',
    neutral: 'border-white/10 bg-white/[0.06] text-slate-300',
    success: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
    warning: 'border-orange-300/30 bg-orange-400/10 text-orange-100',
  }[tone]

  return (
    <div
      className={cn(
        'inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs',
        toneClass,
        className
      )}
      {...props}
    />
  )
}
