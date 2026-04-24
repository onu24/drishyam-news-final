/**
 * lib/data-server.ts — Server-only data layer
 */

export {
  getLatestArticles,
  getFeaturedArticle,
  getArticlesByCategory,
  getArticlesByType,
  getBreakingNews,
  getTrendingArticles,
  getArticleBySlug,
  getAuthorById,
  getAllCategories,
  getCategoryBySlug,
  getVisualStories,
  getVisualStoryBySlug,
  getAboutPageContent,
  searchArticles,
  toArticle,
} from './data';

// Named aliases used by some pages
export { getLatestArticles as getLatestGlobalArticles } from './data';

import { getMongoDb } from './mongodb';
import { toArticle } from './data';
import { NewsArticle, Author } from './types';
import { cache } from 'react';

/**
 * getArticlesMetadataPool — cached pool for server components (SEO, metadata, etc.)
 */
export const getArticlesMetadataPool = cache(async (): Promise<NewsArticle[]> => {
  try {
    const db = await getMongoDb();
    const docs = await db
      .collection('articles')
      .find({}, { projection: { content: 0, content_hi: 0 } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    return docs.map((d) => toArticle(d._id.toString(), d));
  } catch (e) {
    console.error('[data-server] getArticlesMetadataPool error:', e);
    return [];
  }
});

export async function fetchAndFilterAdmin(
  filterFn: (data: any) => boolean,
  count: number
): Promise<NewsArticle[]> {
  const pool = await getArticlesMetadataPool();
  return pool.filter(filterFn).slice(0, count);
}

/**
 * getArticleMetadataBySlug — optimized for generateMetadata / SEO
 */
export const getArticleMetadataBySlug = cache(async (slug: string): Promise<NewsArticle | null> => {
  try {
    const db = await getMongoDb();
    const decodedSlug = decodeURIComponent(slug);
    const doc = await db
      .collection('articles')
      .findOne(
        { slug: decodedSlug },
        { projection: { content: 0, content_hi: 0 } }
      );
    if (doc) return toArticle(doc._id.toString(), doc);
  } catch (e) {
    console.error(`[data-server] getArticleMetadataBySlug(${slug}) error:`, e);
  }
  return null;
});

/**
 * getAuthorsPool — cached pool of all authors
 */
export const getAuthorsPool = cache(async (): Promise<Author[]> => {
  try {
    const db = await getMongoDb();
    const docs = await db.collection('authors').find().limit(100).toArray();
    return docs.map((doc) => {
      const { _id, ...rest } = doc;
      return { id: _id.toString(), ...rest } as Author;
    });
  } catch (e) {
    console.error('[data-server] getAuthorsPool error:', e);
    return [];
  }
});
