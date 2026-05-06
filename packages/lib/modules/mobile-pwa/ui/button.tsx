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
          'bg-[linear-gradient(135deg,#a9a5f5_0%,#d8cce9_45%,#ef9454_100%)] text-slate-950 shadow-[0_12px_30px_rgba(127,106,232,0.28)]',
        secondary: 'border border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.1]',
        ghost: 'text-slate-300 hover:bg-white/[0.06] hover:text-white',
        danger: 'border border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/15',
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
