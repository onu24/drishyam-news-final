import { getAuthors, getAllArticles } from '@/lib/dashboard';
import { AuthorManager } from '@/components/admin/AuthorManager';

export const revalidate = 0;

export default async function AuthorsPage() {
  const authors = await getAuthors();
  const allArticles = await getAllArticles();

  // Create map of author contributions
  const authorCounts = allArticles.reduce((acc, article) => {
    acc[article.authorId] = (acc[article.authorId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return <AuthorManager initialAuthors={authors} authorCounts={authorCounts} />;
}
