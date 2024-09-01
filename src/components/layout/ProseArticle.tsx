import { cn } from '@/lib/utils';
import React from 'react';

export const ProseArticle = React.forwardRef<
  HTMLDivElement,
  { className?: string } & React.ComponentPropsWithoutRef<'div'>
>((props, ref) => {
  return (
    <article
      className={cn(props.className, 'prose print:prose max-md:prose-sm prose-zinc dark:prose-invert my-8 min-w-full')}
      ref={ref}
    >
      {props.children}
    </article>
  );
});
