import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slot } from 'radix-ui';

// APEX variants reuse the existing button styles. Unstyled lets callers own the classes.
const buttonVariants = cva('', {
  variants: {
    variant: {
      default: 'btn-gold',
      outline: 'btn-outline',
      destructive: 'btn-gold bg-error text-black',
      secondary: 'btn-outline bg-charcoal',
      ghost: 'font-condensed text-gold hover:bg-gold-dim',
      link: 'text-gold underline-offset-4 hover:underline',
      unstyled: '',
    },
    size: {
      default: '',
      xs: 'px-2 py-1 text-xs',
      sm: 'px-6 py-3 text-sm',
      lg: 'px-12 py-5',
      icon: 'size-9 justify-center p-0',
      'icon-xs': 'size-6 justify-center p-0',
      'icon-sm': 'size-8 justify-center p-0',
      'icon-lg': 'size-10 justify-center p-0',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={
        variant === 'unstyled' ? className : cn(buttonVariants({ variant, size, className }))
      }
      {...props}
    />
  );
}

export { Button, buttonVariants };
