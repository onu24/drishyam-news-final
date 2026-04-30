'use client';

import { Article } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';
import { deleteArticleAction } from '@/lib/actions/dashboard-actions';
import { useRouter } from 'next/navigation';
import { Search, Edit2, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import { toast } from 'sonner';

export function ArticleTable({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to permanently delete this article?')) {
      setDeletingId(id);
      try {
        const success = await deleteArticleAction(id);
        if (success.success) {
          setArticles(prev => prev.filter(a => a.id !== id));
          toast.success('Article deleted successfully');
          router.refresh();
        } else {
          toast.error('Failed to delete article');
        }
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (articles.length === 0) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center shadow-sm">
        <p className="text-muted-foreground mb-4">No articles exist yet.</p>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all"
        >
          Create your first article
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search articles by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          suppressHydrationWarning
          className="w-full bg-background border border-border/60 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all shadow-sm"
        />
      </div>

      {/* Mobile Grid (Hidden on Desktop) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredArticles.map((article) => (
          <div key={article.id} className={`bg-background border border-border/60 rounded-xl p-5 shadow-sm space-y-4 ${deletingId === article.id ? 'opacity-50 grayscale' : ''}`}>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-widest rounded">
                  {article.category || 'General'}
                </span>
                <div className="flex gap-2">
                  {article.status === 'published' ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">Live</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded">Draft</span>
                  )}
                </div>
              </div>
              <h3 className="font-serif font-bold text-foreground line-clamp-2 leading-tight">
                {article.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{(article.views || 0).toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground justify-end">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">
                  {new Date((article.updatedAt || article.createdAt) as string).toLocaleDateString('en-IN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Link>
              <div className="w-4"></div>
              <button
                onClick={(e) => handleDelete(article.id, e)}
                disabled={deletingId === article.id}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deletingId === article.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (Hidden on Mobile) */}
      <div className="hidden lg:block bg-background border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Article Details</th>
              <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Category</th>
              <th className="text-center py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Status</th>
              <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Stats</th>
              <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Date</th>
              <th className="text-right py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredArticles.map((article) => (
              <tr key={article.id} className={`hover:bg-secondary/10 transition-colors group ${deletingId === article.id ? 'opacity-50' : ''}`}>
                <td className="py-5 px-6">
                  <div className="max-w-md">
                    <div className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1 leading-tight">
                      {article.title}
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                       ID: {article.id.slice(-8)}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                   <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-black bg-secondary/60 px-2.5 py-1 rounded-md">
                     {article.category || 'General'}
                   </span>
                </td>
                <td className="py-5 px-6 text-center">
                  {article.status === 'published' ? (
                     <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                       Published
                     </span>
                   ) : (
                     <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                       Draft
                     </span>
                   )}
                </td>
                <td className="py-5 px-6 font-medium text-muted-foreground text-xs">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3 w-3" />
                    {(article.views || 0).toLocaleString()}
                  </div>
                </td>
                <td className="py-5 px-6 text-muted-foreground text-xs font-medium whitespace-nowrap">
                  {new Date((article.updatedAt || article.createdAt) as string).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </td>
                <td className="py-5 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit Article"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={(e) => handleDelete(article.id, e)}
                      disabled={deletingId === article.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed border-border/60">
          No articles found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

