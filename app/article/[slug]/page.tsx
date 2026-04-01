import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleHeader } from '@/components/article/ArticleHeader';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';
import { ShareButtons } from '@/components/article/ShareButtons';
import { getVisualStoryBySlug, getAuthorById, searchArticles, getArticlesByCategory, getLatestArticles } from '@/lib/data';
import { mockArticles } from '@/lib/mock-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = mockArticles.find(a => a.slug === slug);
  if (!article) return { title: 'Article Not Found' };
  
  return {
    title: `${article.title} | Drishyam News`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = mockArticles.find(a => a.slug === slug);
  
  if (!article) {
    notFound();
  }

  const [author, relatedArticles, trendingArticles] = await Promise.all([
    getAuthorById(article.authorId || ''),
    getArticlesByCategory(article.categoryId || 'india', 4),
    getLatestArticles(5)
  ]);

  // Filter out current article from related
  const filteredRelated = relatedArticles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Header />
      <Navbar />
      
      <div className="flex-1 bg-white">
        <ArticleHeader 
          article={article} 
          author={author || undefined} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8">
              <ArticleContent 
                content={article.content} 
                keyPoints={article.keyPoints} 
                articleType={article.articleType}
              />
              
              <ShareButtons 
                title={article.title} 
                url={`/article/${slug}`} 
              />

              {/* Author Bio Card (Mobile/Bottom) */}
              {author && (
                <div className="bg-secondary/20 p-8 rounded-sm my-12 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left border border-border/50">
                  <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden bg-muted">
                    { (author.avatar || author.avatarUrl) && (
                      <img
                        src={author.avatar || author.avatarUrl || ''}
                        alt={author.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-serif mb-2">{author.name}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {author.bio || 'Author bio coming soon. Follow our experts for more updates.'}
                    </p>
                    <Link 
                      href={`/author/${author.id}`}
                      className="text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                    >
                      More from this author →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
               <ArticleSidebar 
                relatedArticles={filteredRelated} 
                trendingArticles={trendingArticles} 
               />
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
