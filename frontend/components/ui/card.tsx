import * as React from 'react';
import { cn } from '@/lib/utils';

function Card({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { unstyled?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        !unstyled && [
          'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
        ],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { unstyled?: boolean }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        !unstyled && [
          '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        ],
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { unstyled?: boolean }) {
  return (
    <div
      data-slot="card-title"
      className={cn(!unstyled && ['leading-none font-semibold'], className)}
      {...props}
    />
  );
}

function CardDescription({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { unstyled?: boolean }) {
  return (
    <div
      data-slot="card-description"
      className={cn(!unstyled && ['text-sm text-muted-foreground'], className)}
      {...props}
    />
  );
}

function CardAction({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { unstyled?: boolean }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        !unstyled && ['col-start-2 row-span-2 row-start-1 self-start justify-self-end'],
        className,
      )}
      {...props}
    />
  );
}

function CardContent({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { unstyled?: boolean }) {
  return (
    <div data-slot="card-content" className={cn(!unstyled && ['px-6'], className)} {...props} />
  );
}

function CardFooter({
  unstyled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & { unstyled?: boolean }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(!unstyled && ['flex items-center px-6 [.border-t]:pt-6'], className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
