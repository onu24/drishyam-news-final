'use client';

import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNotificationsClick = () => {
    toast.info(t('notifications_coming_soon'), {
      description: t('notifications_desc'),
    });
  };

  return (
    <header 
      suppressHydrationWarning
      className={`sticky top-[36px] md:top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-white/5 border-b border-border/50' 
          : 'bg-background border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-22'
        }`}>
          
          {/* Logo Main Segment */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group py-2">
            <div className="flex flex-col items-center relative text-center">
               <h1 className={`font-serif text-4xl sm:text-5xl font-black text-primary tracking-tight leading-none group-hover:scale-[1.02] transition-transform duration-300 ${language === 'hi' ? 'font-hindi-serif' : ''}`}>
                Drishyam
              </h1>
              <div className="flex items-center gap-2 mt-1.5 w-full justify-center">
                {language !== 'hi' && <span className="h-[1px] w-4 sm:w-6 bg-border/60" />}
                <p className={`text-[9px] sm:text-[11px] font-bold text-muted-foreground tracking-[0.2em] sm:tracking-[0.25em] uppercase whitespace-nowrap ${language === 'hi' ? 'font-hindi tracking-normal text-[10px] sm:text-xs text-primary/80' : ''}`}>
                  {t('news_analysis')}
                </p>
                {language !== 'hi' && <span className="h-[1px] w-4 sm:w-6 bg-border/60" />}
              </div>
            </div>
          </Link>

          {/* Right Actions Segment */}
          <div className="flex items-center gap-3 lg:gap-6 flex-1 justify-end max-w-xl">
            <div className="hidden md:block w-full max-w-xs lg:max-w-md">
              <SearchInput />
            </div>

            <button 
              aria-label="Search" 
              suppressHydrationWarning
              className="md:hidden text-foreground/70 hover:text-primary transition-all p-2.5 bg-secondary/50 rounded-full active:scale-90"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label="Notifications"
              onClick={handleNotificationsClick}
              suppressHydrationWarning
              className="group/bell text-foreground/70 hover:text-primary transition-all p-2.5 bg-secondary/50 rounded-full relative active:scale-90"
            >
              <Bell className="h-5 w-5 group-hover/bell:animate-ring" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
