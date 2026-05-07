import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from './cn'

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--mobile-gradient-primary)] text-[var(--mobile-bg-level-1)] shadow-[0_12px_30px_rgba(127,106,232,0.28)]',
        secondary:
          'border border-[var(--mobile-border-zen)] bg-[var(--mobile-bg-level-2)] text-[var(--mobile-text-primary)] hover:bg-[var(--mobile-bg-level-3)]',
        ghost:
          'text-[var(--mobile-text-secondary)] hover:bg-[rgba(229,211,190,0.06)] hover:text-[var(--mobile-text-primary)]',
        danger:
          'border border-[rgba(244,137,117,0.3)] bg-[rgba(234,98,73,0.12)] text-[var(--mobile-text-error)] hover:bg-[rgba(234,98,73,0.18)]',
      },
      size: {
        sm: 'h-10 px-3',
        md: 'h-11 px-4',
        lg: 'h-12 px-5',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, className, size, variant, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'

    return (
      <Component
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
