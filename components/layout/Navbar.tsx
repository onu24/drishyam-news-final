'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Navbar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { t } = useLanguage();

  const categories = [
    { name: t('home'), slug: '/' },
    { name: t('latest'), slug: '/latest' },
    { name: t('india'), slug: '/category/india' },
    { name: t('states'), slug: '/category/states' },
    { name: t('politics'), slug: '/category/politics' },
    { name: t('economy'), slug: '/category/economy' },
    { name: t('technology'), slug: '/category/technology' },
    { name: t('sports'), slug: '/category/sports' },
    { name: t('entertainment'), slug: '/category/entertainment' },
    { name: t('explainers'), slug: '/category/explainers' },
    { name: t('videos'), slug: '/category/videos' },
  ];

  return (
    <nav className="border-b border-border bg-background sticky top-[80px] z-30 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center px-4 sm:px-6 lg:px-8 h-12">
          <div className="flex items-center gap-6 lg:gap-8">
            {categories.map((category) => {
              const isActive = pathname === category.slug;
              return (
                <Link
                  key={category.slug}
                  href={category.slug}
                  className={`text-[13px] font-bold uppercase tracking-wide whitespace-nowrap py-3.5 border-b-[3px] transition-colors ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-foreground hover:text-primary'
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation (Scrollable Chips) */}
        <div 
          ref={scrollRef}
          className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3"
        >
          {categories.map((category) => {
            const isActive = pathname === category.slug;
            return (
              <Link
                key={category.slug}
                href={category.slug}
                className={`text-xs font-semibold whitespace-nowrap px-4 py-2 rounded-full border transition-colors ${
                  isActive
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-secondary border-transparent text-foreground hover:border-border'
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
