import Link from 'next/link';
import { NewsArticle } from '@/lib/types';
import { AdContainer } from '@/components/AdContainer';
import { Clock, TrendingUp } from 'lucide-react';

interface CategorySidebarProps {
  latestArticles: NewsArticle[];
  trendingArticles: NewsArticle[];
}

export function CategorySidebar({ latestArticles, trendingArticles }: CategorySidebarProps) {
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
        <div className="bg-primary px-4 py-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-white" />
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
                  {formatDate(article.createdAt || article.date || Date.now())}
                </span>
                <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="bg-secondary/10 p-3 text-center border-t border-border/40">
           <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              View All News →
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
          <div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-serif text-xl font-bold">Trending Now</h3>
          </div>
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
