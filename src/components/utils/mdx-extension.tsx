import { cn } from '@/lib/utils';
import React from 'react';

export const Duration = React.forwardRef<
  HTMLSpanElement,
  { className?: string } & React.ComponentPropsWithoutRef<'span'>
>((props, ref) => {
  return (
    <span className={cn(props.className, 'text-muted-foreground float-end text-right')} ref={ref}>
      {props.children}
    </span>
  );
});

export const TechStack = React.forwardRef<
  HTMLSpanElement,
  { className?: string } & React.ComponentPropsWithoutRef<'span'>
>((props, ref) => {
  return (
    <span className={cn(props.className, 'text-[75%] block font-semibold')} ref={ref}>
      {props.children}
    </span>
  );
});
