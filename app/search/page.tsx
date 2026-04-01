import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/homepage/ArticleCard';
import { searchArticles } from '@/lib/data';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  return {
    title: query ? `Search Results for "${query}" | Drishyam News` : 'Search | Drishyam News',
    description: `Search results for ${query} on Drishyam News.`,
  };
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const results = await searchArticles(query);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <main className="flex-1 bg-secondary/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                Search Results
              </h1>
              <p className="text-muted-foreground mt-2">
                {results.length > 0 
                  ? `Showing ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"` 
                  : query 
                    ? `No results found for "${query}"`
                    : 'Enter a search term above to find articles.'
                }
              </p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : query ? (
            <div className="bg-background border border-border rounded-xl p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
               <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
               </div>
               <h2 className="text-2xl font-serif font-bold mb-3">No Results Found</h2>
               <p className="text-muted-foreground mb-8">
                  We couldn't find any articles matching your search. Try checking your spelling or using more general keywords.
               </p>
               <div className="flex flex-wrap justify-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground w-full mb-2">Try common topics:</span>
                  {['Budget', 'ISRO', 'Cricket', 'Elections', 'iPhone'].map(topic => (
                    <a 
                      key={topic}
                      href={`/search?q=${topic}`}
                      className="px-4 py-2 bg-secondary hover:bg-primary/10 hover:text-primary rounded-full text-sm font-semibold transition-colors"
                    >
                      {topic}
                    </a>
                  ))}
               </div>
            </div>
          ) : (
             <div className="py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground italic">Use the search bar in the header to find stories...</p>
             </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
