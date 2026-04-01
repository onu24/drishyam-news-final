'use client';

import { useArticles } from '@/lib/hooks';
import { ArticleCard } from './ArticleCard';

export function NewsGrid() {
  const { articles, loading } = useArticles();

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded-sm mb-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return null;
  }

  // Skip the featured article if showing all articles
  const gridArticles = articles.slice(0, 9);

  return (
    <section className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-8 pb-4 border-b border-border">
          Latest News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}
