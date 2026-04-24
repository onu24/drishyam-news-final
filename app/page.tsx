import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BreakingStrip } from '@/components/homepage/BreakingStrip';
import { HeroLatestSection } from '@/components/homepage/HeroLatestSection';
import { SectionBlock } from '@/components/homepage/Section';
import { ExplainerGrid } from '@/components/homepage/ExplainerGrid';
import { OpinionRow } from '@/components/homepage/OpinionRow';
import { VideoCarousel } from '@/components/homepage/VideoCarousel';
import { VisualStories } from '@/components/homepage/VisualStories';
import { FeedPersonalization } from '@/components/homepage/FeedPersonalization';
import { AdContainer } from '@/components/AdContainer';
import { Reveal } from '@/components/animations/Reveal';
import { SportsScoreboard } from '@/components/sports/SportsScoreboard';
import { getLiveCricketScores } from '@/lib/cricket';

import { 
  getFeaturedArticle, 
  getLatestArticles, 
  getArticlesByCategory,
  getArticlesByType,
  getVisualStories,
} from '@/lib/data-server';

// Exported ISR Revalidation
export const revalidate = 60;

export const metadata = {
  title: 'Drishyam News - Breaking News & Analysis',
  description: 'Latest news, breaking stories, and in-depth analysis on politics, business, technology, and more.',
};

export default async function Home() {
  // 1. Fetch data in parallel with generous buffers to allow for deduplication
  const [
    featured,
    latestRaw,
    indiaRaw,
    politicsRaw,
    economyRaw,
    techRaw,
    sportsRaw,
    entertainRaw,
    jobsRaw,
    examsRaw,
    explainerRaw,
    opinionRaw,
    videoRaw,
    visualStories,
    liveMatches,
  ] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(25),
    getArticlesByCategory('india', 20),
    getArticlesByCategory('politics', 20),
    getArticlesByCategory('economy', 20),
    getArticlesByCategory('technology', 20),
    getArticlesByCategory('sports', 20),
    getArticlesByCategory('entertainment', 20),
    getArticlesByCategory('jobs', 15),
    getArticlesByCategory('exams', 15),
    getArticlesByType('explainer', 15),
    getArticlesByType('opinion', 15),
    getArticlesByType('video', 15),
    getVisualStories(),
    getLiveCricketScores(),
  ]);

  // 2. Deduplication logic using a Set to track seen IDs
  const usedIds = new Set<string>();

  // Helper to pick unique articles from a pool
  const pickUnique = (pool: any[], count: number) => {
    const selected = pool.filter(a => !usedIds.has(a.id)).slice(0, count);
    selected.forEach(a => usedIds.add(a.id));
    return selected;
  };

  // 3. Sequentially allocate articles to sections
  // Priority 1: Lead Hierarchy
  const leadArticle = (featured && !usedIds.has(featured.id)) ? featured : latestRaw[0];
  if (leadArticle) usedIds.add(leadArticle.id);

  const sidebarLatest = pickUnique(latestRaw, 5);
  const tickerArticles = latestRaw.slice(0, 5); // Ticker can duplicate for high-priority exposure, or we can pick fresh ones
  
  // Priority 2: Main Editorial Sections
  const indiaNews = pickUnique(indiaRaw, 5);
  const politicsNews = pickUnique(politicsRaw, 5);
  const economyNews = pickUnique(economyRaw, 5);
  const techNews = pickUnique(techRaw, 5);
  const sportsNews = pickUnique(sportsRaw, 6);
  const entertainNews = pickUnique(entertainRaw, 6);
  
  // Priority 3: Specialized Content
  const explainerArticles = pickUnique(explainerRaw, 3);
  const opinionArticles = pickUnique(opinionRaw, 4);
  const videoArticles = pickUnique(videoRaw, 5);
  const jobsNews = pickUnique(jobsRaw, 4);
  const examsNews = pickUnique(examsRaw, 4);

  const visuals = visualStories || [];
  const hasIndiaNews = indiaNews.length > 0;
  const hasEconomyNews = economyNews.length > 0;
  const hasPoliticsNews = politicsNews.length > 0;
  const hasTechNews = techNews.length > 0;
  const hasSportsNews = sportsNews.length > 0;
  const hasEntertainmentNews = entertainNews.length > 0;
  const hasJobsNews = jobsNews.length > 0;
  const hasExamsNews = examsNews.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar />
      <Header />
      
      {/* Real-time IPL Updates */}
      {liveMatches.some((m: any) => (m.status === 'LIVE' || m.status === 'UPCOMING') && m.isIPL) && (
        <SportsScoreboard initialMatches={liveMatches} />
      )}
      
      <Navbar />
      <BreakingStrip articles={tickerArticles} />
      
      <main className="flex-1 w-full space-y-4">
        {/* Above the Fold: Lead Hierarchy */}
        {leadArticle && (
          <Reveal>
            <HeroLatestSection 
              leadArticle={leadArticle} 
              latestArticles={sidebarLatest} 
            />
          </Reveal>
        )}

        {/* Lead Ad Banner */}
        <div className="max-w-7xl mx-auto px-4 py-2">
          <AdContainer slot="home_top_banner" format="auto" className="bg-secondary/20 min-h-[100px]" />
        </div>
        
        {/* India News: Editorial Feature */}
        {hasIndiaNews && (
          <Reveal delay={0.2}>
            <SectionBlock
              category="india"
              articles={indiaNews}
              variant="feature"
            />
          </Reveal>
        )}
        
        {/* Economy & Tech: Grid Layout */}
        {hasEconomyNews && (
          <Reveal delay={0.1}>
            <div className="bg-zinc-50 border-y border-border/40 py-4">
              <SectionBlock
                category="economy"
                articles={economyNews}
                variant="grid"
              />
            </div>
          </Reveal>
        )}

        {/* Opinion Section (Full Width Editorial) */}
        <OpinionRow articles={opinionArticles} />
        
        {/* Politics: Dynamic Side-by-Side */}
        {hasPoliticsNews && (
          <Reveal delay={0.2}>
            <SectionBlock
              category="politics"
              articles={politicsNews}
              variant="side-by-side"
            />
          </Reveal>
        )}

        {/* Visual Content Layer */}
        <Reveal delay={0.3}>
          <VisualStories stories={visuals} />
          <VideoCarousel articles={videoArticles} />
        </Reveal>

        {/* Tech: Grid Layout */}
        {hasTechNews && (
          <Reveal delay={0.1}>
            <SectionBlock
              category="technology"
              articles={techNews}
              variant="grid"
            />
          </Reveal>
        )}

        {/* Explainers: High Value Content */}
        <Reveal delay={0.2}>
          <ExplainerGrid articles={explainerArticles} />
        </Reveal>

        {/* Middle Ad Banner */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <AdContainer slot="home_mid_banner" format="auto" className="bg-secondary/20 min-h-[100px]" />
        </div>

        {/* Sports & Entertainment: Light Grid */}
        {(hasSportsNews || hasEntertainmentNews) && (
          <Reveal delay={0.1}>
            <div className="bg-zinc-50 border-y border-border/40 py-4">
              {hasSportsNews && (
                <SectionBlock
                  category="sports"
                  articles={sportsNews}
                  variant="grid"
                />
              )}
              {hasEntertainmentNews && (
                <SectionBlock
                  category="entertainment"
                  articles={entertainNews}
                  variant="grid"
                />
              )}
            </div>
          </Reveal>
        )}

        {/* Jobs & Exams: List View */}
        {(hasJobsNews || hasExamsNews) && (
          <Reveal delay={0.3}>
            <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto px-4 gap-12 py-10">
              {hasJobsNews && (
                <SectionBlock
                  category="jobs"
                  articles={jobsNews}
                  variant="minimal-list"
                />
              )}
              {hasExamsNews && (
                <SectionBlock
                  category="exams"
                  articles={examsNews}
                  variant="minimal-list"
                />
              )}
            </div>
          </Reveal>
        )}

        <FeedPersonalization />
      </main>

      <Footer />
    </div>
  );
}
