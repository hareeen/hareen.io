'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import Link from 'next/link';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function Header() {
  const { theme, systemTheme, setTheme } = useTheme();
  const currentTheme = (theme === 'system' ? systemTheme : theme) ?? 'light';

  return (
    <>
      <div className="hidden absolute top-8 right-0 print:block">
        <Link href="/">
          <h3 className="text-xl font-bold font-['']">✦</h3>
        </Link>
      </div>
      <div className="my-4 flex items-center print:hidden">
        <Link href="/">
          <h3 className="text-xl font-bold hover:text-[#7654ff] transition-all font-['']">✦</h3>
        </Link>
        <div className="flex-grow" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              {currentTheme === 'light' ? <SunIcon width={18} height={18} /> : <MoonIcon width={18} height={18} />}
              <span className="sr-only">Toggle Theme</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={theme === 'light'}
              onClick={() => {
                setTheme('light');
              }}
            >
              밝게
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === 'dark'}
              onClick={() => {
                setTheme('dark');
              }}
            >
              어둡게
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === 'system'}
              onClick={() => {
                setTheme('system');
              }}
            >
              시스템 설정에 맞게
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
