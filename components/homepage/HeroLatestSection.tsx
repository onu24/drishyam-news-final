import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/lib/types';

export interface HeroLatestSectionProps {
  leadArticle: NewsArticle;
  latestArticles: NewsArticle[];
}

export function HeroLatestSection({ leadArticle, latestArticles }: HeroLatestSectionProps) {
  const formatTime = (ts: number | string) => {
    // mock relative time
    return '2 hrs ago';
  };

  return (
    <section className="bg-background border-b border-border py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left: Lead Story */}
          <div className="lg:col-span-2">
            <Link href={`/article/${leadArticle.slug}`} className="group cursor-pointer block">
              <div className="relative aspect-video mb-4 overflow-hidden rounded-sm bg-muted w-full">
                {leadArticle.imageUrl ? (
                  <Image
                    src={leadArticle.imageUrl}
                    alt={leadArticle.headline || leadArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary" />
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 uppercase tracking-wider rounded-sm shadow-md">
                    {leadArticle.category}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {leadArticle.headline || leadArticle.title}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground line-clamp-2 leading-relaxed font-hindi">
                  {leadArticle.excerpt || leadArticle.summary || "यह एक डमी टेक्स्ट है जो यह दिखाएगा कि हिंदी फॉन्ट कैसा दिखता है। समाचार का संक्षिप्त विवरण यहाँ होगा।"}
                </p>
                <div className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <span>{formatTime(leadArticle.date)}</span>
                  <span className="mx-2 text-border">•</span>
                  <span className="text-foreground">{leadArticle.state || 'New Delhi'}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Latest News List */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-foreground">
              <h3 className="font-bold text-lg uppercase tracking-wider text-foreground flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Latest News
              </h3>
            </div>
            <div className="flex flex-col flex-1 divide-y divide-border">
              {latestArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/article/${article.slug}`} 
                  className="group py-3.5 first:pt-1 flex flex-col min-h-[44px]"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {formatTime(article.date)}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
              ))}
            </div>
            <Link href="/latest" className="mt-4 text-sm font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center">
              View All Latest <span className="ml-1">→</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
