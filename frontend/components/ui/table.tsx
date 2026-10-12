'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function Table({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'table'> & { unstyled?: boolean }) {
  if (unstyled) return <table data-slot="table" className={className} {...props} />;

  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn(!unstyled && ['w-full caption-bottom text-sm'], className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'thead'> & { unstyled?: boolean }) {
  return (
    <thead
      data-slot="table-header"
      className={cn(!unstyled && ['[&_tr]:border-b'], className)}
      {...props}
    />
  );
}

function TableBody({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'tbody'> & { unstyled?: boolean }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(!unstyled && ['[&_tr:last-child]:border-0'], className)}
      {...props}
    />
  );
}

function TableFooter({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'tfoot'> & { unstyled?: boolean }) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        !unstyled && ['border-t bg-charcoal/50 font-medium [&>tr]:last:border-b-0'],
        className,
      )}
      {...props}
    />
  );
}

function TableRow({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'tr'> & { unstyled?: boolean }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        !unstyled && [
          'border-b transition-colors hover:bg-charcoal/50 has-aria-expanded:bg-charcoal/50 data-[state=selected]:bg-charcoal',
        ],
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'th'> & { unstyled?: boolean }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        !unstyled && [
          'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        ],
        className,
      )}
      {...props}
    />
  );
}

function TableCell({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'td'> & { unstyled?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        !unstyled && [
          'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        ],
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'caption'> & { unstyled?: boolean }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(!unstyled && ['mt-4 text-sm text-muted-foreground'], className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
