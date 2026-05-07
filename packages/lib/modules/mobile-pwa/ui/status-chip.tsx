import { HTMLAttributes } from 'react'
import { cn } from './cn'

export type StatusChipProps = HTMLAttributes<HTMLDivElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}

export function StatusChip({ className, tone = 'neutral', ...props }: StatusChipProps) {
  const toneClass = {
    danger:
      'border-[rgba(244,137,117,0.3)] bg-[rgba(234,98,73,0.12)] text-[var(--mobile-text-error)]',
    neutral:
      'border-[var(--mobile-border-zen)] bg-[var(--mobile-bg-level-2)] text-[var(--mobile-text-secondary)]',
    success: 'border-[rgba(0,211,149,0.3)] bg-[rgba(0,211,149,0.12)] text-[var(--mobile-green)]',
    warning:
      'border-[rgba(253,186,116,0.3)] bg-[rgba(253,186,116,0.12)] text-[var(--mobile-text-warning)]',
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
