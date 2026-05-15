import Link from 'next/link';
import { Plus } from 'lucide-react';
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
          <p className="text-muted-foreground">Manage and publish your news articles.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="group flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>New Article</span>
        </Link>
      </div>

      <ArticleTable initialArticles={articles} />
    </div>
  );
}
