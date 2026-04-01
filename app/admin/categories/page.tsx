import { getCategories, getAllArticles } from '@/lib/dashboard';

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await getCategories();
  const allArticles = await getAllArticles();

  // Create a fast map calculating article counts per category
  const categoryCounts = allArticles.reduce((acc, article) => {
    acc[article.categoryId] = (acc[article.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage editorial structure and coverage areas.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors shadow-sm">
          + Add Category
        </button>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="py-4 px-6 font-semibold">Category Name</th>
              <th className="py-4 px-6 font-semibold">Description</th>
              <th className="py-4 px-6 font-semibold text-center">Article Count</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-secondary/20 transition-colors group">
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{cat.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">/{cat.slug}</div>
                </td>
                <td className="py-4 px-6 text-muted-foreground max-w-sm truncate">
                  {cat.description}
                </td>
                <td className="py-4 px-6 text-center">
                   <span className="inline-flex items-center justify-center px-2 py-1 bg-secondary text-foreground font-bold rounded-sm text-xs min-w-[2rem] border border-border">
                     {categoryCounts[cat.id] || 0}
                   </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-primary hover:text-primary/80 font-medium transition-colors text-sm px-2">Edit</button>
                  <button className="text-red-500 hover:text-red-600 font-medium transition-colors text-sm px-2 opacity-50 cursor-not-allowed hidden md:inline-block" title="Disabled in mock mode">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
