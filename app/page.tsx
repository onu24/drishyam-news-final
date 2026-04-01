import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BreakingStrip } from '@/components/homepage/BreakingStrip';
import { HeroLatestSection } from '@/components/homepage/HeroLatestSection';
import { SectionBlock } from '@/components/homepage/Section';
import { StatesRow } from '@/components/homepage/StatesRow';
import { ExplainerGrid } from '@/components/homepage/ExplainerGrid';
import { OpinionRow } from '@/components/homepage/OpinionRow';
import { VideoCarousel } from '@/components/homepage/VideoCarousel';
import { VisualStories } from '@/components/homepage/VisualStories';
import { FeedPersonalization } from '@/components/homepage/FeedPersonalization';
import { AdContainer } from '@/components/AdContainer';

import { 
  getFeaturedArticle, 
  getLatestArticles, 
  getArticlesByCategory, 
} from '@/lib/data';
import { cookies } from 'next/headers';

// Exported ISR Revalidation
export const revalidate = 60;

export const metadata = {
  title: 'Drishyam News - Breaking News & Analysis',
  description: 'Latest news, breaking stories, and in-depth analysis on politics, business, technology, and more.',
};

export default async function Home() {
  const [
    featured,
    latest,
    indiaNews,
    stateNews,
    politicsNews,
    economyNews,
    techNews,
    sportsNews,
    entertainNews,
    jobsNews,
    examsNews
  ] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(8),
    getArticlesByCategory('india', 5),
    getArticlesByCategory('states', 5),
    getArticlesByCategory('politics', 5),
    getArticlesByCategory('economy', 5),
    getArticlesByCategory('technology', 5),
    getArticlesByCategory('sports', 5),
    getArticlesByCategory('entertainment', 5),
    getArticlesByCategory('jobs', 5),
    getArticlesByCategory('exams', 5),
  ]);

  // Read preferences from cookie
  const cookieStore = await cookies();
  const prefsCookie = cookieStore.get('drishyam_user_prefs');
  let selectedSlugs: string[] = [];
  
  if (prefsCookie) {
    try {
      selectedSlugs = JSON.parse(decodeURIComponent(prefsCookie.value));
    } catch (e) {
      console.error("Error parsing prefs cookie", e);
    }
  }

  const hasPrefs = selectedSlugs.length > 0;

  const leadArticle = featured || latest[0];
  const safeLatest = latest.filter(a => a.id !== leadArticle?.id).slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />
      <BreakingStrip articles={latest.slice(0, 5)} />
      
      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <AdContainer slot="homepage_top" format="auto" />
      </div>

      <main className="flex-1 w-full bg-secondary/10">
        {leadArticle && (
          <HeroLatestSection 
            leadArticle={leadArticle!} 
            latestArticles={safeLatest} 
          />
        )}
        
        {(!hasPrefs || selectedSlugs.includes('india')) && (
          <SectionBlock titleKey="national_news" category="india" articles={indiaNews} />
        )}
        
        {(!hasPrefs || selectedSlugs.includes('states')) && (
          <SectionBlock titleKey="state_news" category="states" articles={stateNews}>
            <StatesRow />
          </SectionBlock>
        )}

        {/* In-Feed Mid Ad */}
        <div className="max-w-7xl mx-auto px-4 w-full py-4">
          <AdContainer slot="homepage_mid" format="fluid" />
        </div>
        
        {(!hasPrefs || selectedSlugs.includes('politics')) && (
          <SectionBlock titleKey="politics_news" category="politics" articles={politicsNews} />
        )}
        
        {(!hasPrefs || selectedSlugs.includes('economy')) && (
          <SectionBlock titleKey="economy_news" category="economy" articles={economyNews} />
        )}
        
        {(!hasPrefs || selectedSlugs.includes('technology')) && (
          <SectionBlock titleKey="tech_news" category="technology" articles={techNews} />
        )}

        {(!hasPrefs || selectedSlugs.includes('jobs')) && (
          <SectionBlock titleKey="jobs_news" category="jobs" articles={jobsNews} /> 
        )}

        {(!hasPrefs || selectedSlugs.includes('exams')) && (
          <SectionBlock titleKey="exams_news" category="exams" articles={examsNews} />
        )}
        
        {(!hasPrefs || selectedSlugs.includes('sports')) && (
          <SectionBlock titleKey="sports_news" category="sports" articles={sportsNews} />
        )}
        
        {(!hasPrefs || selectedSlugs.includes('entertainment')) && (
          <SectionBlock titleKey="entertainment_news" category="entertainment" articles={entertainNews} />
        )}
        
        <ExplainerGrid />
        
        <OpinionRow />
        <VideoCarousel />
        <VisualStories />
        <FeedPersonalization />
      </main>

      <Footer />
    </div>
  );
}


