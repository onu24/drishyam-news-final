'use client';

import { Settings2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/components/providers/LanguageProvider';

const TOPICS = [
  { label: 'india', slug: 'india' },
  { label: 'states', slug: 'states' },
  { label: 'politics', slug: 'politics' },
  { label: 'economy', slug: 'economy' },
  { label: 'jobs', slug: 'jobs' },
  { label: 'exams', slug: 'exams' },
  { label: 'sports', slug: 'sports' },
  { label: 'entertainment', slug: 'entertainment' },
];

export function FeedPersonalization() {
  const { t } = useLanguage();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  // Load initial preferences from cookie
  useEffect(() => {
    const prefs = document.cookie
      .split('; ')
      .find(row => row.startsWith('drishyam_user_prefs='))
      ?.split('=')[1];
    
    if (prefs) {
      try {
        setSelectedSlugs(JSON.parse(decodeURIComponent(prefs)));
      } catch (e) {
        console.error("Failed to parse prefs", e);
      }
    }
  }, []);

  const toggleTopic = (slug: string) => {
    setIsSaved(false);
    setSelectedSlugs(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug) 
        : [...prev, slug]
    );
  };

  const savePreferences = () => {
    if (selectedSlugs.length === 0) {
      toast.info('No topics selected', {
        description: 'Choose at least one topic before saving your feed preferences.',
      });
      return;
    }

    // Save to cookie (valid for 30 days)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    
    document.cookie = `drishyam_user_prefs=${encodeURIComponent(JSON.stringify(selectedSlugs))}; path=/; expires=${expiry.toUTCString()}; SameSite=Lax`;
    
    setIsSaved(true);

    toast.success('Preferences saved', {
      description: `Your feed is updated for ${selectedSlugs.length} selected topic${selectedSlugs.length > 1 ? 's' : ''}.`,
    });
    
    // Refresh the page data (Server Components will pick up the new cookie)
    router.refresh();

    // Reset saved state after a few seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/40 py-16 border-b border-border/40 selection:bg-primary/10" id="filter-feed">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border/40 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border/40 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-zinc-950 rounded-full shadow-xl mb-6 ring-1 ring-border/50">
          <Settings2 className="h-6 w-6 text-primary animate-[spin_4s_linear_infinite]" />
        </div>
        
        <h2 className={`text-2xl sm:text-4xl font-black tracking-tight text-foreground mb-3 ${useLanguage().language === 'hi' ? 'font-hindi-serif' : 'font-serif'}`}>
          {t('customize_feed')}
        </h2>
        
        <p className={`text-sm sm:text-base text-muted-foreground/80 max-w-lg mx-auto mb-10 leading-relaxed ${useLanguage().language === 'hi' ? 'font-hindi font-medium' : ''}`}>
          {t('newsletter_intro')}
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {TOPICS.map((topic) => {
            const isActive = selectedSlugs.includes(topic.slug);
            const isHindi = useLanguage().language === 'hi';
            return (
              <button
                key={topic.slug}
                onClick={() => toggleTopic(topic.slug)}
                suppressHydrationWarning
                className={`group relative px-4 sm:px-5 py-2 rounded-full transition-all duration-300 transform active:scale-90 border shadow-sm ${
                  isHindi ? 'font-hindi font-bold text-sm pt-2' : 'font-sans text-[10px] uppercase font-black tracking-widest'
                } ${
                  isActive
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105 ring-4 ring-primary/10'
                    : 'bg-white dark:bg-zinc-900 border-border/60 dark:border-zinc-800 text-foreground/60 hover:border-primary/40 hover:text-primary hover:bg-white dark:hover:bg-zinc-800 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isActive && <Check className="h-3 w-3 animate-in zoom-in-50 duration-300" />}
                  {t(topic.label)}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4">
          <button 
            onClick={savePreferences}
            disabled={isSaved}
            suppressHydrationWarning
            className={`group/btn min-w-[260px] relative font-bold px-10 py-4 rounded-sm transition-all duration-500 overflow-hidden shadow-2xl ${
              useLanguage().language === 'hi' ? 'font-hindi text-lg pt-3' : 'font-sans text-xs uppercase tracking-[0.25em]'
            } ${
              isSaved 
                ? 'bg-green-600 text-white cursor-default scale-95 opacity-90' 
                : 'bg-foreground text-background hover:bg-primary hover:text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-primary dark:hover:text-white'
            }`}
          >
            {/* Hover Glaze Effect */}
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-center">
              {isSaved ? (
                <>
                  <Check className="mr-3 h-5 w-5" />
                  {t('subscribed_success')}
                </>
              ) : (
                <>
                  <span>{t('customize_feed')}</span>
                  {!isSaved && <span className="ml-3 group-hover/btn:translate-x-1 transition-transform">→</span>}
                </>
              )}
            </div>
          </button>

          {selectedSlugs.length > 0 && (
            <button
              onClick={() => {
                setSelectedSlugs([]);
                document.cookie = 'drishyam_user_prefs=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                setIsSaved(false);
                toast.success(t('reset_prefs'), {
                  description: 'You are back to the default homepage feed.',
                });
                router.refresh();
              }}
              className="group/reset text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-all duration-300 flex items-center gap-2 pt-2"
            >
              <span className="h-px w-4 bg-muted-foreground/30 group-hover/reset:w-8 group-hover/reset:bg-primary transition-all" />
              {t('reset_prefs')}
              <span className="h-px w-4 bg-muted-foreground/30 group-hover/reset:w-8 group-hover/reset:bg-primary transition-all" />
            </button>
          )}
        </div>
        
        {selectedSlugs.length > 0 && !isSaved && (
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-primary/70 font-black uppercase tracking-[0.2em] animate-pulse">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Click save to apply {selectedSlugs.length} topics
            <span className="h-1 w-1 rounded-full bg-primary" />
          </div>
        )}
      </div>
    </section>
  );
}
