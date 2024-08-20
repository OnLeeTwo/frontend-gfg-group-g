import ThemeToggle from '../layout/ThemeToggle/theme-toggle';
import { cn } from '../../utils/utils';
import React from 'react';
// import { MobileSidebar } from './mobile-sidebar';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn('block lg:!hidden')}>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
