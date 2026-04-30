'use client';

import Link from 'next/link';
import { NewsArticle } from '@/lib/types';
import { AdContainer } from '@/components/AdContainer';
import { Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { useLanguage } from '@/components/providers/LanguageProvider';

interface CategorySidebarProps {
  latestArticles: NewsArticle[];
  trendingArticles: NewsArticle[];
}

export function CategorySidebar({ latestArticles, trendingArticles }: CategorySidebarProps) {
  const { language, t } = useLanguage();

  const formatDate = (date: any) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <aside className="space-y-10 sticky top-6">
      {/* Latest Updates Rail */}
      <div className="bg-background border border-border/60 rounded-sm overflow-hidden shadow-sm">
        <div className="bg-primary px-4 py-2.5 flex items-center gap-2.5 relative overflow-hidden">
          {/* Animated Clock — Enhanced */}
          <div className="relative flex-shrink-0 w-5 h-5">
            {/* Ambient Glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white blur-[4px] rounded-full"
            />
            {/* Pulse ring */}
            <motion.span
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-white/40"
            />
            {/* Clock SVG */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 relative z-10 drop-shadow-sm"
            >
              {/* Clock face background */}
              <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1.5" />
              
              {/* Tick Marks */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                <line 
                  key={deg}
                  x1="12" y1="3" x2="12" y2="4.5" 
                  stroke="white" strokeWidth="0.8" strokeLinecap="round"
                  transform={`rotate(${deg} 12 12)`}
                  opacity="0.6"
                />
              ))}

              {/* Hour hand */}
              <motion.line
                x1="12" y1="12" x2="12" y2="7.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 3600, repeat: Infinity, ease: 'linear' }}
                style={{ originX: '12px', originY: '12px', transformBox: 'fill-box' }}
              />
              
              {/* Minute hand */}
              <motion.line
                x1="12" y1="12" x2="12" y2="5.5"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                style={{ originX: '12px', originY: '12px', transformBox: 'fill-box' }}
              />

              {/* Second hand (Red) */}
              <motion.line
                x1="12" y1="13.5" x2="12" y2="4.5"
                stroke="#ff4d4d"
                strokeWidth="0.6"
                strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ originX: '12px', originY: '12px', transformBox: 'fill-box' }}
              />

              {/* Center dot */}
              <circle cx="12" cy="12" r="1" fill="white" />
              <circle cx="12" cy="12" r="0.4" fill="#ff4d4d" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-xs uppercase tracking-widest pt-0.5">Latest Updates</h3>
        </div>
        <div className="divide-y divide-border/40">
          {latestArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/article/${article.slug}`}
              className="block p-4 hover:bg-secondary/20 transition-colors group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                  {formatDate(article.createdAt || Date.now())}
                </span>
                <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="p-0 border-t border-border/40">
           <Link 
             href="/latest" 
             className="group/btn flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 text-white transition-all text-[11px] font-black uppercase tracking-[0.2em]"
           >
              <span>{language === 'hi' ? 'सभी खबरें देखें' : 'View All News'}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
           </Link>
        </div>
      </div>

      {/* Ad Placement */}
      <div className="bg-secondary/20 rounded-sm p-4 border border-border/40 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-[9px] text-muted-foreground uppercase tracking-widest mb-4">Advertisement</span>
        <AdContainer slot="category_sidebar_fixed" format="rectangle" />
      </div>

      {/* Trending Block */}
      {trendingArticles.length > 0 && (
        <div className="space-y-6">
          {/* ── Trending Now Header with animated arrow ── */}
          <div className="flex items-center gap-2.5 border-b-2 border-foreground pb-3 relative">
            {/* Animated TrendingUp icon */}
            <div className="relative flex-shrink-0 w-6 h-6">
              {/* Ripple ring */}
              <motion.span
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-red-500/20"
              />
              <motion.div
                className="relative z-10 w-full h-full"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  {/* Graph Line Background */}
                  <path 
                    d="M3 18L9 12L13 16L21 8" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary/20" 
                  />
                  {/* Animated Graph Line */}
                  <motion.path
                    d="M3 18L9 12L13 16L21 8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                  {/* Trending Up Arrow Tip */}
                  <motion.path 
                    d="M17 8H21V12" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                  {/* Glowing Endpoint Dot */}
                  <motion.circle
                    cx="21" cy="8" r="2"
                    fill="#ef4444"
                    animate={{ r: [2, 3.5, 2], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </svg>
              </motion.div>
            </div>

            <h3 className="font-serif text-xl font-bold">Trending Now</h3>

            {/* Animated underline bar */}
            <motion.div
              animate={{ scaleX: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-[2px] left-0 h-[2px] w-20 bg-primary origin-left rounded-full"
            />
          </div>

          {/* Article list */}
          <div className="space-y-6">
            {trendingArticles.slice(0, 5).map((article, index) => (
              <Link 
                key={article.id} 
                href={`/article/${article.slug}`}
                className="group block"
              >
                <div className="flex gap-4">
                  <span className="text-3xl font-serif font-black text-border group-hover:text-primary transition-colors tabular-nums">
                    {index + 1}
                  </span>
                  <div className="pt-1">
                    <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 block">
                      {article.categoryId?.replace('cat_', '').toUpperCase() || 'NEWS'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
