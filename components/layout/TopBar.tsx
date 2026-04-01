'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-secondary/50 border-b border-border py-1.5 px-4 text-xs font-medium text-muted-foreground w-full z-50 relative hidden sm:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Date */}
        <div className="tracking-wide">
          {dateStr}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage('en')}
              className={`hover:text-foreground transition-colors ${language === 'en' ? 'text-foreground font-bold underline decoration-primary underline-offset-4' : ''}`}
            >
              EN
            </button>
            <span className="text-border">|</span>
            <button 
              onClick={() => setLanguage('hi')}
              className={`font-hindi hover:text-foreground transition-colors ${language === 'hi' ? 'text-foreground font-bold underline decoration-primary underline-offset-4' : 'font-medium'}`}
            >
              हिंदी
            </button>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
