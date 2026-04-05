import { getCategories, getAllArticles } from '@/lib/dashboard';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await getCategories();
  const allArticles = await getAllArticles();

  // Create a map for category counts
  const categoryCounts = allArticles.reduce((acc, article) => {
    acc[article.categoryId] = (acc[article.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="animate-in fade-in duration-500">
      <CategoryManager 
        initialCategories={categories} 
        categoryCounts={categoryCounts} 
      />
    </div>
  );
}
