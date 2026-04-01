'use client';

import Link from 'next/link';
import { ArticleCard } from './ArticleCard';
import { NewsArticle } from '@/lib/types';
import { TranslationKey } from '@/lib/i18n';

interface SectionProps {
  title?: string;
  titleKey?: TranslationKey;
  category: string;
  slug?: string;
  articles: NewsArticle[];
  children?: React.ReactNode;
}

import { useLanguage } from '@/components/providers/LanguageProvider';

export function SectionBlock({ title, titleKey, category, slug, articles, children }: SectionProps) {
  const { t, language } = useLanguage();

  const displayTitle = titleKey ? t(titleKey) : title;

  if (!articles || !articles.length) {
    return null;
  }

  const mainArticle = articles[0];
  const listArticles = articles.slice(1);
  const sectionSlug = slug || category;

  return (
    <section className="bg-background border-b border-border py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-foreground/10 relative">
          <h2 className="font-bold text-2xl tracking-tight text-foreground flex items-center">
            {displayTitle || title}
          </h2>
          <Link
            href={`/category/${sectionSlug}`}
            className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
          >
            {language === 'hi' ? 'सभी देखें →' : 'View All →'}
          </Link>
          <div className="absolute -bottom-[2px] left-0 w-12 border-b-2 border-primary"></div>
        </div>

        {/* Optional Sub-Injection (like StatesRow) */}
        {children && <div className="mb-6">{children}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Desktop: 1 Card + List */}
          <div className="md:col-span-1">
            <ArticleCard article={mainArticle} variant="default" />
          </div>
          
          <div className="md:col-span-2 flex flex-col divide-y divide-border">
            {listArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/article/${article.slug}`} 
                className="group py-4 first:pt-0 flex flex-col min-h-[44px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {new Date(article.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="font-serif text-lg sm:text-xl font-semibold leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
