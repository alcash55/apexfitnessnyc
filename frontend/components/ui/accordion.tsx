'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & { unstyled?: boolean }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(!unstyled && ['border-b last:border-b-0'], className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  unstyled = false,
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { unstyled?: boolean }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          !unstyled && [
            'flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          ],
          className,
        )}
        {...props}
      >
        {children}
        {!unstyled && (
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  unstyled = false,
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & { unstyled?: boolean }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={
        unstyled
          ? undefined
          : 'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
      }
      {...props}
    >
      <div className={cn(!unstyled && ['pt-0 pb-4'], className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
