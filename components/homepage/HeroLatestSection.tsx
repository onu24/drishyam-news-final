import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import { slugify } from '@/lib/utils';

export interface HeroLatestSectionProps {
  leadArticle: Article;
  latestArticles: Article[];
}

export function HeroLatestSection({ leadArticle, latestArticles }: HeroLatestSectionProps) {
  const formatDate = (dateStr: string) => {
     try {
       return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
     } catch (e) {
       return 'Recently';
     }
  };

  return (
    <section className="bg-white border-b-4 border-black/5 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          
          {/* Main Editorial Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Lead Story: Dominant & Authoritative */}
            <div className="lg:col-span-8 flex flex-col group">
              <Link href={`/article/${leadArticle.slug}`} className="cursor-pointer block space-y-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-zinc-100 shadow-sm border border-zinc-200">
                  {leadArticle.coverImage ? (
                      <Image
                        src={leadArticle.coverImage}
                        alt={leadArticle.title}
                        fill
                        className="object-cover group-hover:scale-[1.01] transition-transform duration-1000"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
                      />
                  ) : (
                    <div className="w-full h-full bg-zinc-200" />
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-sm shadow-2xl">
                      {leadArticle.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.8rem] font-bold leading-[0.95] tracking-tight text-foreground group-hover:text-primary transition-colors [text-wrap:balance]">
                    {leadArticle.title}
                  </h1>
                  <p className="text-xl sm:text-2xl text-muted-foreground font-serif leading-relaxed italic border-l-4 border-primary/20 pl-8 my-6">
                    {leadArticle.excerpt || "Editorial analysis of today's developing story. Comprehensive coverage on Drishyam News."}
                  </p>
                  <div className="flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] pt-2">
                    <span className="text-black">Drishyam Newsroom</span>
                    <span className="mx-3 text-zinc-300">•</span>
                    <span>{formatDate(leadArticle.createdAt)}</span>
                    <span className="mx-3 text-zinc-300">•</span>
                    <span className="text-primary/80">{leadArticle.categorySlug?.toUpperCase() || 'TOP STORY'}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Sidebar: Latest & Curated News */}
            <div className="lg:col-span-4 flex flex-col h-full border-t lg:border-t-0 lg:border-l border-zinc-200 pt-8 lg:pt-0 lg:pl-12">
              <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-black">
                <h3 className="font-bold text-xl uppercase tracking-tighter text-foreground flex items-center">
                  <span className="w-2.5 h-2.5 bg-primary mr-2 transform rotate-45" />
                  Top Feeds
                </h3>
                <Link href="/latest" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                  LIVE →
                </Link>
              </div>
              
              <div className="flex flex-col gap-6 divide-y divide-zinc-100">
                {latestArticles.slice(0, 5).map((article) => (
                  <Link 
                    key={article.id} 
                    href={`/article/${article.slug}`} 
                    className="group pt-6 first:pt-0 block"
                  >
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-extrabold text-primary/80 uppercase tracking-widest">
                          {article.category}
                       </span>
                       <h4 className="font-serif text-[1.2rem] font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">
                        {formatDate(article.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link 
                href="/latest" 
                className="mt-12 w-full py-4 bg-zinc-50 border border-zinc-200 rounded-sm text-center text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-300"
              >
                Explore Full Coverage
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
