import { ArticleFormClient } from '@/components/admin/ArticleFormClient';
import Link from 'next/link';
import { getArticleById, getAuthors, getCategories } from '@/lib/dashboard';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  const categories = await getCategories();
  const authors = await getAuthors();

  if (!article) {
    return (
      <div>
        <Link
          href="/admin/articles"
          className="text-primary hover:text-primary/80 font-medium text-sm mb-4 inline-block"
        >
          ← Back to Articles
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm">
          Article not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="text-primary hover:text-primary/80 font-medium text-sm mb-4 inline-block"
        >
          ← Back to Articles
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Edit Article</h1>
        <p className="text-muted-foreground">Update the article details below</p>
      </div>

      <ArticleFormClient article={article} availableCategories={categories} availableAuthors={authors} />
    </div>
  );
}
