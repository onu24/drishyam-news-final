'use client';

import dynamic from 'next/dynamic';
import { Article, Author, Category } from '@/lib/types';

const DynamicArticleForm = dynamic(
  () => import('@/components/admin/ArticleForm').then((mod) => mod.ArticleForm),
  {
    ssr: false,
    loading: () => (
      <div className="border border-border rounded-xl p-6 bg-background text-sm text-muted-foreground">
        Loading article editor...
      </div>
    ),
  }
);

interface ArticleFormClientProps {
  article?: Article;
  availableCategories: Category[];
  availableAuthors: Author[];
}

export function ArticleFormClient(props: ArticleFormClientProps) {
  return <DynamicArticleForm {...props} />;
}
