import { ArticleForm } from '@/components/admin/ArticleForm';
import Link from 'next/link';
import { getAuthors, getCategories } from '@/lib/dashboard';

export default async function NewArticlePage() {
  const categories = await getCategories();
  const authors = await getAuthors();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="text-primary hover:text-primary/80 font-medium text-sm mb-4 inline-block"
        >
          ← Back to Articles
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Create New Article</h1>
        <p className="text-muted-foreground">Draft and publish a new story.</p>
      </div>

      <ArticleForm availableCategories={categories} availableAuthors={authors} />
    </div>
  );
}
