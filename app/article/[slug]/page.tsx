import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleHeader } from '@/components/article/ArticleHeader';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';
import { ShareButtons } from '@/components/article/ShareButtons';
import { getArticleBySlug, getAuthorById, getArticlesByCategory, getLatestArticles } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | Drishyam News`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [author, relatedArticles, trendingArticles] = await Promise.all([
    getAuthorById(article.authorId || ''),
    getArticlesByCategory(article.category || article.categoryId || 'india', 4),
    getLatestArticles(5),
  ]);

  const filteredRelated = relatedArticles.filter(a => a.id !== article.id).slice(0, 3);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.coverImage || article.imageUrl || ''],
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: [
      {
        '@type': 'Person',
        name: author?.name || 'Drishyam Editorial',
        url: author ? `https://drishyam-news.com/author/${author.id}` : 'https://drishyam-news.com',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Drishyam News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://drishyam-news.com/logo.png',
      },
    },
    description: article.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://drishyam-news.com/article/${slug}`,
    },
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      <Navbar />

      <div className="flex-1 bg-white">
        <ArticleHeader article={article} author={author || undefined} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main Content Column */}
            <div className="lg:col-span-8">
              <ArticleContent
                content={article.content}
                keyPoints={article.keyPoints}
                articleType={article.articleType}
              />

              <ShareButtons title={article.title} url={`/article/${slug}`} />

              {/* Author Bio */}
              {author && (
                <div className="bg-secondary/20 p-8 rounded-sm my-12 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left border border-border/50">
                  <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden bg-muted">
                    {(author.avatar || author.avatarUrl) && (
                      <Image
                        src={author.avatar || author.avatarUrl || ''}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-serif mb-2">{author.name}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {author.bio || 'Author bio coming soon.'}
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

            {/* Sidebar */}
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
