'use client';

import { useArticlesByCategory } from '@/lib/hooks';
import { ArticleCard } from '@/components/homepage/ArticleCard';
import { Article } from '@/lib/types';

interface RelatedArticlesProps {
  category: string;
  currentArticleId: string;
}

export function RelatedArticles({ category, currentArticleId }: RelatedArticlesProps) {
  const { articles, loading } = useArticlesByCategory(category, 5);

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  const relatedArticles = articles
    .filter((article: Article) => article.id !== currentArticleId)
    .slice(0, 3);

  if (!relatedArticles.length) {
    return null;
  }

  return (
    <aside className="space-y-8">
      <div className="border-t-2 border-primary pt-6">
        <h3 className="font-serif text-xl font-bold text-foreground mb-6">Related Articles</h3>
        <div className="space-y-8">
          {relatedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
