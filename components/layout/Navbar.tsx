'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  const { language, t } = useLanguage();

  const [categories, setCategories] = useState([
    { name: t('home'), slug: '/' },
    { name: t('latest'), slug: '/latest' },
    { name: t('india'), slug: '/category/india' },
    { name: t('states'), slug: '/category/states' },
    { name: t('politics'), slug: '/category/politics' },
    { name: t('economy'), slug: '/category/economy' },
    { name: t('technology'), slug: '/category/technology' },
    { name: t('sports'), slug: '/category/sports' },
    { name: t('entertainment'), slug: '/category/entertainment' },
    { name: t('jobs'), slug: '/category/jobs' },
    { name: t('exams'), slug: '/category/exams' },
    { name: t('explainers'), slug: '/category/explainers' },
    { name: t('videos'), slug: '/category/videos' },
  ]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then((cats) => {
        if (cats && cats.length > 0) {
          const dynamicCategories = cats.map((c: any) => {
            const dbName = language === 'hi' ? (c.name_hi || c.name) : (c.name_en || c.name);
            let finalName = dbName;
            const isEnglishFallback = /^[A-Z][A-Z\s&]*$/.test(dbName);
            if (isEnglishFallback && t(c.slug) !== c.slug) {
              finalName = t(c.slug);
            }

            return {
              name: finalName,
              slug: `/category/${c.slug}`
            };
          });
          
          setCategories([
            { name: t('home'), slug: '/' },
            { name: t('latest'), slug: '/latest' },
            ...dynamicCategories,
            { name: t('visual_stories'), slug: '/visual-stories' }
          ]);
        }
      })
      .catch(console.error);
  }, [t, language]);

  return (
    <nav className="border-b border-border bg-background overflow-hidden relative md:sticky md:top-16 z-30 md:backdrop-blur-md shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="max-w-7xl mx-auto relative">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center px-4 sm:px-6 lg:px-8 h-12">
          <LayoutGroup id="nav-indicator">
            <div className="flex items-center gap-0.5 h-full" onMouseLeave={() => setHoveredPath(null)}>
               {categories.map((category) => {
                const isActive = pathname === category.slug;
                const isHovered = hoveredPath === category.slug;
                const isHindi = language === 'hi';
                
                return (
                  <Link
                    key={category.slug}
                    href={category.slug}
                    onMouseEnter={() => setHoveredPath(category.slug)}
                    className={`relative px-4 h-full flex items-center ${isHindi ? 'text-[15px] font-medium font-hindi' : 'text-[11px] font-bold uppercase tracking-widest font-sans'} transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <span className="relative z-10">{category.name}</span>
                    
                    {/* Active Indicator (Underline) */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-primary z-10 rounded-t-full shadow-[0_-2px_8px_rgba(212,31,22,0.3)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Hover Indicator (Glass Pill) */}
                    <AnimatePresence>
                      {isHovered && !isActive && (
                        <motion.div
                          layoutId="hover-pill"
                          className="absolute inset-x-1 inset-y-1.5 bg-secondary/80 backdrop-blur-sm rounded-lg -z-0"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Mobile Navigation (Scrollable Chips with Mask) */}
        <div className="relative md:hidden">
          {/* Edge Fades */}
          <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar px-6 py-3.5"
          >
            {categories.map((category) => {
              const isActive = pathname === category.slug;
              const isHindi = language === 'hi';
              return (
                <Link
                  key={category.slug}
                  href={category.slug}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full border transition-all duration-300 active:scale-95 ${
                    isHindi ? 'text-sm font-medium font-hindi' : 'text-[10px] font-bold uppercase tracking-wider font-sans'
                  } ${
                    isActive
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-secondary/50 border-transparent text-foreground/80 hover:bg-secondary hover:text-primary active:bg-secondary/80'
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
