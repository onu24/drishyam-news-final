'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface ArticleCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { language, t } = useLanguage();

  const formatDate = (timestamp: number | string) => {
    return new Date(timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const title = article.headline || article.title;
  const description = article.excerpt;
  const imageUrl = article.imageUrl || article.coverImage;
  const categoryKey = article.categoryId ? article.categoryId.replace('cat_', '') : 'news';
  const displayCategory = t(categoryKey) || categoryKey.toUpperCase();

  if (variant === 'featured') {
    return (
      <Link href={`/article/${article.slug}`} className="group cursor-pointer block">
        <div className="relative mb-4 overflow-hidden bg-muted h-96 w-full rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {displayCategory}
          </p>
          <h2 className="font-serif text-3xl leading-tight text-foreground group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{formatDate(article.date || Date.now())}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="group cursor-pointer">
        <div className="relative mb-3 overflow-hidden bg-muted h-32 w-full rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          {displayCategory}
        </p>
        <h3 className="font-serif text-base leading-snug text-foreground group-hover:text-primary transition-colors mb-1">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{formatDate(article.date || Date.now())}</p>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group cursor-pointer block">
      <div className="relative mb-4 overflow-hidden bg-muted h-48 w-full rounded-sm">
        {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title || ''}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {displayCategory}
        </p>
        <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest pt-1">{formatDate(article.date || Date.now())}</p>
      </div>
    </Link>
  );
}

