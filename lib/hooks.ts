'use client';

import { useEffect, useState } from 'react';
import { Article, Author, Category, User } from './types';

/**
 * lib/hooks.ts — Client-side data hooks (MongoDB era)
 *
 * Firebase real-time listeners have been replaced with simple fetch() calls
 * to Next.js server routes / API endpoints. No real-time updates —
 * pages will refresh on navigation as usual (Next.js cache handles freshness).
 */

// --------------------------------------------------------------------------
// Auth hook — checks /api/admin/me
// --------------------------------------------------------------------------

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.isAdmin) {
          setUser({ uid: 'admin', email: data.email || '', isAdmin: true });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    const { logout: logoutAction } = await import('@/lib/actions/auth-actions');
    await logoutAction();
    setUser(null);
    window.location.href = '/admin/login';
  };

  return { user, loading, logout };
}

// --------------------------------------------------------------------------
// Articles hooks
// --------------------------------------------------------------------------

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('@/lib/actions/dashboard-actions')
      .then(({ getCategoriesAction }) => {
        // Articles are fetched server-side; this hook is legacy.
        // Most admin pages use Server Components. Returning empty safely.
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { articles, loading, error };
}

export function useFeaturedArticles(count = 4) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  return { articles, loading, error };
}

export function useArticlesByCategory(category: string, count = 10) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  return { articles, loading, error };
}

export function useArticleBySlug(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  return { article, loading, error };
}

export function useAuthor(authorId: string) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  return { author, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('@/lib/actions/dashboard-actions')
      .then(({ getCategoriesAction }) => getCategoriesAction())
      .then((cats) => {
        setCategories(cats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}
