import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/**
 * shadcn/ui Button, restyled as frosted glass:
 * translucent fill + backdrop blur + hairline light border + inner top highlight.
 * The effect is strongest over imagery (hero, product tiles); on plain white it reads as soft grey glass.
 */
const frost =
  'backdrop-blur-xl backdrop-saturate-150 border shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_8px_24px_-12px_rgb(0_0_0/0.35)]';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Smoky dark glass: primary actions (Buy, Purchase all, Add shoe)
        default: cn(frost, 'border-white/20 bg-ink/70 text-white hover:bg-ink/80'),
        // Light glass: for use over photos (hero CTA)
        accent: cn(frost, 'border-white/50 bg-white/25 text-white hover:bg-white/35'),
        // Pale glass: secondary actions on white pages
        outline: cn(frost, 'border-black/10 bg-black/[0.03] text-ink hover:bg-black/[0.07]'),
        ghost: 'rounded-xl hover:bg-black/5',
        destructive: 'rounded-xl text-destructive hover:bg-destructive/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-12 px-7 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
