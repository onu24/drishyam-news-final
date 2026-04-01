import Link from 'next/link';
import { getAllArticles } from '@/lib/dashboard';
import { ArticleTable } from '@/components/admin/ArticleTable';

export const revalidate = 0; // Force dynamic for now so in-memory pushes show immediately

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Articles</h1>
          <p className="text-muted-foreground">Manage your news articles (Mock Data)</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          + New Article
        </Link>
      </div>

      <ArticleTable initialArticles={articles} />
    </div>
  );
}
