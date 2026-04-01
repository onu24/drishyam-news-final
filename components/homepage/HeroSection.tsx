'use client';

import { useFeaturedArticles } from '@/lib/hooks';
import { ArticleCard } from './ArticleCard';

export function HeroSection() {
  const { articles, loading } = useFeaturedArticles(4);

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-muted rounded-sm" />
          <div className="grid grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return null;
  }

  const featured = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <section className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article - Large */}
          <div className="lg:col-span-2">
            <ArticleCard article={featured} variant="featured" />
          </div>

          {/* Side Articles */}
          <div className="space-y-8">
            {sideArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
