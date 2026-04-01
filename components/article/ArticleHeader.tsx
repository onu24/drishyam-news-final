import { Article, Author } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, Calendar } from 'lucide-react';

interface ArticleHeaderProps {
  article: Article;
  author?: Author;
}

export function ArticleHeader({ article, author }: ArticleHeaderProps) {
  const formatDate = (timestamp: number | string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const readingTime = article.readingTime || Math.ceil((article.content?.split(' ').length || 0) / 200);
  const isOpinion = article.articleType === 'opinion';
  const displayCategory = article.category || (article.categoryId ? article.categoryId.replace('cat_', '').toUpperCase() : 'NEWS');

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="opacity-30">/</span>
        <Link href={`/category/${article.categoryId?.replace('cat_', '') || 'news'}`} className="hover:text-primary transition-colors">
          {displayCategory}
        </Link>
      </div>

      <div className="space-y-6">
        {/* Category Badge */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-tighter rounded-sm">
            {displayCategory}
          </span>
          {isOpinion && (
            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-tighter rounded-sm">
              Opinion
            </span>
          )}
          {article.articleType === 'explainer' && (
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-tighter rounded-sm">
              Explainer
            </span>
          )}
        </div>

        {/* Headline */}
        <h1 className={`font-serif leading-[1.1] font-bold text-foreground mb-6 ${isOpinion ? 'text-4xl sm:text-6xl italic text-center py-4 border-y border-border/50' : 'text-4xl sm:text-5xl md:text-6xl'}`}>
          {article.title || article.headline}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl sm:text-2xl text-muted-foreground font-serif leading-relaxed italic border-l-4 border-primary/20 pl-6 my-8">
            {article.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-border mt-10">
          {author && (
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-muted border-2 border-primary/10">
                 { (author.avatar || author.avatarUrl) && (
                    <Image
                      src={author.avatar || author.avatarUrl || ''}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                 )}
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base text-foreground leading-none mb-1">{author.name}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                  {author.role || 'Staff Writer'}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time>{formatDate(article.createdAt || article.date || Date.now())}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} min read</span>
            </div>
            {article.views !== undefined && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {(article.imageUrl || article.coverImage) && (
        <div className="mt-10 mb-4 group">
          <div className="relative w-full aspect-video overflow-hidden rounded-sm shadow-lg">
            <Image
              src={article.imageUrl || article.coverImage || ''}
              alt={article.title || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 italic text-right uppercase tracking-widest">
            Representative Image / Drishyam News Archive
          </p>
        </div>
      )}
    </article>
  );
}
