'use client';

import Link from 'next/link';
import { Search, X, ChevronLeft } from 'lucide-react';
import { AnimatedSearch } from './AnimatedIcons';
import { SearchInput } from './SearchInput';
import { NotificationBell } from './NotificationBell';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { SVGLogo } from './SVGLogo';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { language, t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      // Auto-close search on scroll
      if (isMobileSearchOpen) {
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileSearchOpen]);

  // Close search on window resize or click outside
  useEffect(() => {
    if (isMobileSearchOpen) {
      const handleResize = () => {
        if (window.innerWidth >= 768) setIsMobileSearchOpen(false);
      };

      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
          setIsMobileSearchOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('touchstart', handleClickOutside);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isMobileSearchOpen]);

  return (
    <header
      ref={headerRef}
      suppressHydrationWarning
      className={`sticky ${scrolled ? 'top-0' : 'top-[36px]'} md:top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled
          ? 'bg-background shadow-lg shadow-black/5 dark:shadow-white/5 border-b border-border/50'
          : 'bg-background border-b border-border'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? 'h-16 sm:h-24' : 'h-20 sm:h-32'
          }`}>

          <AnimatePresence mode="wait">
            {!isMobileSearchOpen ? (
              <motion.div 
                key="logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center flex-1"
              >
                {/* Logo Main Segment */}
                <Link href="/" className="flex-shrink-0 flex items-center gap-3 group py-2">
                  <SVGLogo className="w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-500 group-hover:rotate-[5deg]" />
                  <div className="flex flex-col items-start relative">
                    <h1 className={`font-serif text-3xl sm:text-5xl font-black text-primary tracking-tight leading-none group-hover:text-foreground transition-colors duration-300 ${language === 'hi' ? 'font-hindi-serif' : ''}`}>
                      Drishyam
                    </h1>
                    <div className={`flex items-center gap-2 w-full justify-start transition-all duration-300 ${language === 'hi' ? 'mt-0' : 'mt-1'}`}>
                      <p className={`text-[10px] sm:text-[11px] font-bold text-muted-foreground tracking-[0.2em] sm:tracking-[0.25em] uppercase whitespace-nowrap leading-none ${language === 'hi' ? 'font-hindi tracking-normal text-xs sm:text-sm text-primary font-black' : ''}`}>
                        {t('news_analysis')}
                      </p>
                      <div className="h-[2px] w-8 bg-primary/20 rounded-full group-hover:w-12 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                key="search-mobile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 w-full pr-2"
              >
                <button 
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex-1">
                  <SearchInput isMobileMode onNavigate={() => setIsMobileSearchOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Actions Segment */}
          {!isMobileSearchOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 lg:gap-6 justify-end"
            >
              <div className="hidden md:block w-full max-w-xs lg:max-w-md">
                <SearchInput />
              </div>

              <button
                aria-label="Search"
                onClick={() => setIsMobileSearchOpen(true)}
                suppressHydrationWarning
                className="md:hidden text-foreground/70 hover:text-primary transition-all p-2.5 bg-secondary/50 rounded-full active:scale-90 flex items-center justify-center"
              >
                <AnimatedSearch className="h-5 w-5" />
              </button>

              <NotificationBell />
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
