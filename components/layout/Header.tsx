'use client';

import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { toast } from 'sonner';

export function Header() {
  const handleNotificationsClick = () => {
    toast.info('Notifications coming soon', {
      description: 'We will alert you when breaking stories and updates are available.',
    });
  };

  return (
    <header className="bg-background sticky top-0 z-40 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Main Segment */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="flex flex-col">
              <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-primary tracking-tight leading-none group-hover:opacity-90 transition-opacity">
                Drishyam
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground tracking-widest uppercase mt-0.5 ml-1">
                News & Analysis
              </p>
            </div>
          </Link>

          {/* Right Actions Segment */}
          <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end max-w-xl">
            <div className="hidden md:block w-full max-w-xs lg:max-w-sm">
              <SearchInput />
            </div>

            <button aria-label="Search" className="md:hidden text-foreground hover:text-primary transition-colors p-2">
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label="Notifications"
              onClick={handleNotificationsClick}
              className="text-foreground hover:text-primary transition-colors p-2 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
