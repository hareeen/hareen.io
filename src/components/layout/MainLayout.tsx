import { cn } from '@/lib/utils';
import React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export const MainLayout = React.forwardRef<
  HTMLDivElement,
  { className?: string } & React.ComponentPropsWithoutRef<'div'>
>((props, ref) => {
  return (
    <main className={cn(props.className, 'flex min-h-screen flex-col items-center px-4')} ref={ref}>
      <div className="w-full max-w-2xl print:max-w-full relative">
        <Header />
        {props.children}
        <Footer />
      </div>
    </main>
  );
});
