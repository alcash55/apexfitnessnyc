'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label as LabelPrimitive } from 'radix-ui';

function Label({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { unstyled?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        !unstyled && ['font-condensed text-xs tracking-label text-gold uppercase'],
        className,
      )}
      {...props}
    />
  );
}

export { Label };
