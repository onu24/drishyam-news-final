'use client';

import { useState } from 'react';
import { Article, Category, Author, ArticleStatus } from '@/lib/types';
import { createArticle, updateArticle } from '@/lib/dashboard';
import { ImageUpload } from './ImageUpload';
import { useRouter } from 'next/navigation';

interface ArticleFormProps {
  article?: Article;
  availableCategories: Category[];
  availableAuthors: Author[];
}

export function ArticleForm({ article, availableCategories, availableAuthors }: ArticleFormProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState(article?.coverImage || '');

  const [formData, setFormData] = useState({
    title: article?.title || '',
    categoryId: article?.categoryId || '',
    authorId: article?.authorId || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    status: (article?.status || 'draft') as ArticleStatus,
    featured: article?.featured || false,
    tags: article?.tags?.join(', ') || '',
  });

  // Derived auto-slug preview 
  const slugPreview = formData.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean tags into an array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const submitData = {
        title: formData.title,
        slug: slugPreview,
        excerpt: formData.excerpt,
        content: formData.content,
        categoryId: formData.categoryId,
        authorId: formData.authorId,
        status: formData.status,
        featured: formData.featured,
        tags: tagsArray,
        coverImage: imageUrl,
      };

      if (article) {
        await updateArticle(article.id, submitData);
      } else {
        // Mock Article creation
        await createArticle(submitData);
      }

      setSuccess(true);
      
      // Allow user to see success message before redirect
      setTimeout(() => {
        router.push('/admin/articles');
        router.refresh();
      }, 1000);

    } catch (err) {
      setError(`Failed to save article: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-20">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm font-medium">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-sm text-sm font-medium flex items-center">
          Article saved successfully! Redirecting...
        </div>
      )}

      {/* Image Upload */}
      <div className="bg-card p-6 border border-border rounded-lg shadow-sm">
        <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
          Cover Image
        </label>
        <ImageUpload onImageUpload={setImageUrl} currentImage={imageUrl} />
      </div>

      <div className="space-y-6 bg-card p-6 border border-border rounded-lg shadow-sm">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
            Headline
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary text-lg font-serif"
            placeholder="Write a compelling headline..."
          />
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Slug: /{slugPreview || 'auto-generated-slug'}
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
            Summary / Excerpt
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            required
            className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground"
            placeholder="Brief summary appearing on homepage cards..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card p-6 border border-border rounded-lg shadow-sm">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
            Category
          </label>
          <select
            id="category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
            className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Category...</option>
            {availableCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
            Author
          </label>
          <select
            id="author"
            value={formData.authorId}
            onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
            required
            className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Author...</option>
            {availableAuthors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ArticleStatus })}
            required
            className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          >
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="bg-card p-6 border border-border rounded-lg shadow-sm space-y-6">
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
            Tags (Comma Separated)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Budget, Finance, Election"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider flex justify-between">
            <span>Body Content</span>
            <span className="text-muted-foreground font-normal normal-case text-xs">Markdown supported structure</span>
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            required
            className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-relaxed text-foreground bg-secondary/10"
            placeholder="Write the full report here..."
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3 p-4 bg-secondary/30 border border-border/50 rounded-sm">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-5 h-5 border border-border rounded focus:ring-2 focus:ring-primary text-primary"
          />
          <div>
            <label htmlFor="featured" className="text-sm font-bold text-foreground leading-none">
              Mark as Featured Story
            </label>
            <p className="text-xs text-muted-foreground mt-1">This will pin the article to the top of the homepage carousel.</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 sticky bottom-0 bg-background/80 backdrop-blur-md p-4 border-t border-border -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:p-0">
        <button
          type="submit"
          disabled={loading || success}
          className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? 'Saving...' : success ? 'Saved!' : 'Save Article'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading || success}
          className="px-6 py-3 border border-border text-foreground font-medium rounded-sm hover:bg-secondary disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
