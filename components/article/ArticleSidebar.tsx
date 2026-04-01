import { Article } from '@/lib/types';
import { ArticleCard } from '@/components/homepage/ArticleCard';
import { AdContainer } from '@/components/AdContainer';

interface ArticleSidebarProps {
  relatedArticles: Article[];
  trendingArticles: Article[];
}

export function ArticleSidebar({ relatedArticles, trendingArticles }: ArticleSidebarProps) {
  return (
    <aside className="space-y-12">
      {/* Related Stories */}
      {relatedArticles.length > 0 && (
        <div className="border-t-2 border-primary pt-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-6 underline decoration-primary/30 underline-offset-8">
            Related Stories
          </h3>
          <div className="space-y-8">
            {relatedArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}

      {/* Ad Slot */}
      <div className="bg-secondary/30 rounded-sm p-4 flex flex-col items-center justify-center min-h-[250px] border border-border/50">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Advertisement</span>
        <AdContainer slot="article_sidebar" format="rectangle" />
      </div>

      {/* Trending / Top Stories */}
      {trendingArticles.length > 0 && (
        <div className="bg-foreground text-background p-6 rounded-sm">
          <h3 className="font-serif text-xl font-bold mb-6 border-b border-background/20 pb-2">
            Trending Now
          </h3>
          <div className="space-y-6">
            {trendingArticles.slice(0, 5).map((article, index) => (
              <a 
                key={article.id} 
                href={`/article/${article.slug}`}
                className="group block"
              >
                <div className="flex gap-4">
                  <span className="text-2xl font-serif font-bold text-primary italic opacity-50 group-hover:opacity-100 transition-opacity">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
