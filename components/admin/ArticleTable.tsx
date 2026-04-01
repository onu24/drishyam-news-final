'use client';

import { Article } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';
import { deleteArticle } from '@/lib/dashboard';
import { useRouter } from 'next/navigation';

export function ArticleTable({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this article? (Mock implementation)')) {
      setDeletingId(id);
      try {
        const success = await deleteArticle(id);
        if (success) {
          // Instantly filter out locally for UI responsiveness
          setArticles(prev => prev.filter(a => a.id !== id));
          router.refresh(); // Trigger server refetch in background
        }
      } catch (err) {
        alert('Failed to delete article mocked response.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (articles.length === 0) {
    return (
      <div className="bg-background border border-border rounded-lg p-12 text-center shadow-sm">
        <p className="text-muted-foreground mb-4">No articles exist yet.</p>
        <Link
          href="/admin/articles/new"
          className="text-primary hover:text-primary/80 font-medium hover:underline"
        >
          Create your first article
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-border bg-secondary/50">
          <tr>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Title</th>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Category</th>
            <th className="text-center py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Status</th>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Views</th>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Date</th>
            <th className="text-right py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {articles.map((article) => (
            <tr key={article.id} className={`hover:bg-secondary/20 transition-colors group ${deletingId === article.id ? 'opacity-50 animate-pulse' : ''}`}>
              <td className="py-4 px-6 text-foreground font-medium truncate max-w-sm">
                <div className="line-clamp-1 mb-1">{article.title}</div>
                <div className="text-xs font-normal text-muted-foreground">
                   {article.authorId}
                </div>
              </td>
              <td className="py-4 px-6">
                 <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium bg-secondary/50 px-2 py-1 rounded-sm">
                   {(article.categoryId || '').replace('cat_', '')}
                 </span>
              </td>
              <td className="py-4 px-6 text-center">
                {article.status === 'published' ? (
                   <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-sm">
                     Published
                   </span>
                 ) : article.status === 'review' ? (
                   <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-sm">
                     In Review
                   </span>
                 ) : (
                   <span className="inline-block px-2 py-1 bg-secondary text-muted-foreground text-xs font-bold rounded-sm border border-border">
                     Draft
                   </span>
                 )}
                 {article.featured && article.status === 'published' && (
                   <div className="text-[10px] text-red-500 font-bold uppercase mt-1">Featured</div>
                 )}
              </td>
              <td className="py-4 px-6 text-muted-foreground font-medium">
                {(article.views || 0).toLocaleString()}
              </td>
              <td className="py-4 px-6 text-muted-foreground whitespace-nowrap">
                {new Date((article.updatedAt || article.createdAt) as string).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </td>
              <td className="py-4 px-6 text-right space-x-4 whitespace-nowrap">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  Edit
                </Link>
                <button 
                  onClick={(e) => handleDelete(article.id, e)}
                  disabled={deletingId === article.id}
                  className="text-red-600/70 hover:text-red-700 font-medium text-sm transition-colors disabled:cursor-not-allowed"
                >
                  {deletingId === article.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
