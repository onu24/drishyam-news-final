import { NewsArticle } from '@/lib/types';
import { getArticlesByCategory, getLatestArticles } from '@/lib/data-server';
import { ArticleCard } from '@/components/homepage/ArticleCard';
import { RecentlyViewed } from '@/components/article/RecentlyViewed';

interface RelatedEngagementProps {
  currentArticle: NewsArticle;
}

export async function RelatedEngagement({ currentArticle }: RelatedEngagementProps) {
  const category = currentArticle.categorySlug || 'news';
  
  // Parallel fetch: Related (in same category) and Globally Latest
  const [relatedArticles, latestArticles] = await Promise.all([
    getArticlesByCategory(category, 7),
    getLatestArticles(10)
  ]);

  const moreOnTopic = relatedArticles
    .filter(a => a.id !== currentArticle.id)
    .slice(0, 3);

  const continueReading = latestArticles
    .filter(a => a.id !== currentArticle.id)
    .slice(0, 4);

  return (
    <div className="mt-16 space-y-16">
      {/* More on this topic */}
      {moreOnTopic.length > 0 && (
        <div className="pt-10 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
              <span className="w-6 h-[2px] bg-primary" />
              More on this topic
            </h3>
            <div className="h-[1px] flex-1 bg-zinc-100 ml-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {moreOnTopic.map(article => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      <RecentlyViewed currentArticle={currentArticle} />

      {/* Bottom Feed: Continue Reading */}
      <div className="pt-10 border-t border-zinc-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
            <span className="w-6 h-[2px] bg-primary" />
            Continue Reading
          </h3>
          <div className="h-[1px] flex-1 bg-zinc-100 ml-6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {continueReading.map(article => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}
