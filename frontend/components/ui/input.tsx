import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({
  unstyled = false,
  className,
  type,
  ...props
}: React.ComponentProps<'input'> & { unstyled?: boolean }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        !unstyled && [
          'w-full border border-border bg-charcoal px-5 py-4 font-condensed text-[0.95rem] tracking-[0.05em] text-cream transition-colors placeholder:text-muted focus:border-gold focus:outline-none',
        ],
        className,
      )}
      {...props}
    />
  );
}

export { Input };
