/**
 * lib/data.ts — Public data layer
 *
 * Uses Firebase Client SDK (works in both browser and Node.js/Server Components).
 *
 * IMPORTANT: To avoid "Missing Index" errors in Firestore, we use "Lazy Filtering":
 * We fetch the latest articles sorted by date (auto-indexed) and filter by status/type 
 * in-memory. This guarantees that your Admin-saved content appears immediately 
 * without needing manual index configuration in the Firebase Console.
 */

import {
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { NewsArticle, VisualStory, Author, Category, AboutPageContent } from './types';
import { slugify, FALLBACK_IMAGE } from './utils';

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** Normalise a Firestore document into NewsArticle shape */
function toArticle(id: string, data: Record<string, any>): NewsArticle {
  const title = data.title || 'Untitled Story';
  const category = data.category || 'News';
  const categorySlug = data.categorySlug || slugify(category);
  
  return {
    id,
    title,
    slug: data.slug || slugify(title),
    excerpt: data.excerpt || '',
    content: data.content || '',
    category,
    categoryId: data.categoryId || '',
    categorySlug,
    coverImage: data.coverImage || FALLBACK_IMAGE,
    imageUrl: data.coverImage || FALLBACK_IMAGE, 
    authorId: data.authorId || 'drishyam-editorial',
    status: data.status || 'published',
    featured: !!data.featured,
    tags: data.tags || [],
    articleType: data.articleType || 'standard',
    views: data.views || 0,
    readingTime: data.readingTime || 3,
    language: data.language || 'en',
    
    // Robust date handling
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt ?? new Date().toISOString(),
    
    // SEO & Engagement
    metaTitle: data.metaTitle || title,
    metaDescription: data.metaDescription || data.excerpt || '',
    isBreaking: !!data.isBreaking,
    isLive: !!data.isLive,
    keyPoints: data.keyPoints || [],
    videoUrl: data.videoUrl || '',
  } as NewsArticle;
}

/** Normalise a Firestore document into VisualStory shape */
function toVisualStory(id: string, data: Record<string, any>): VisualStory {
  const title = data.title || 'Untitled Story';

  return {
    id,
    title,
    slug: data.slug || slugify(title),
    coverImage: data.coverImage || FALLBACK_IMAGE,
    category: data.category || 'General',
    slides: Array.isArray(data.slides)
      ? data.slides.map((slide: any, idx: number) => ({
          id: slide?.id || `slide_${idx + 1}`,
          title: slide?.title || `Slide ${idx + 1}`,
          caption: slide?.caption || '',
          image: slide?.image || FALLBACK_IMAGE,
          video: slide?.video || '',
        }))
      : [],
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? new Date().toISOString(),
  } as VisualStory;
}

function toAboutContent(id: string, data: Record<string, any>): AboutPageContent {
  return {
    id,
    heroTitle: data.heroTitle || 'About Drishyam News',
    heroSubtitle:
      data.heroSubtitle ||
      'Independent journalism for a modern India. We deliver facts, context, and clarity.',
    intro:
      data.intro ||
      'Drishyam News is a digital newsroom focused on truth-first reporting and in-depth public-interest journalism.',
    story:
      data.story ||
      'From breaking headlines to explainers, our editorial process prioritizes verification, fairness, and accountability.',
    mission:
      data.mission ||
      'To make credible journalism accessible, fast, and meaningful for every reader.',
    vision:
      data.vision ||
      'To become India’s most trusted digital-first news platform for informed citizens.',
    values: Array.isArray(data.values) && data.values.length > 0
      ? data.values.map((v: any) => String(v))
      : ['Accuracy', 'Independence', 'Accountability', 'Public Interest'],
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt ?? new Date().toISOString(),
  } as AboutPageContent;
}

/** 
 * Safe fetcher that avoids Composite Index requirements by filtering in memory.
 * Fetches the latest 200 articles by default.
 */
async function fetchAndFilter(
  filterFn: (data: any) => boolean, 
  count: number
): Promise<NewsArticle[]> {
  try {
    if (!db) {
       return [];
    }
    
    // Sort only by createdAt (Single Field Index - automatic)
    const q = query(
      collection(db, 'articles'),
      orderBy('createdAt', 'desc'),
      limit(200) // Fetch large enough buffer to filter in memory
    );
    
    const snap = await getDocs(q);
    
    // Fallback to mock data if Firestore is empty
    if (snap.empty) {
      return [];
    }

    return snap.docs
      .map(d => toArticle(d.id, d.data()))
      .filter(filterFn)
      .slice(0, count);
  } catch (e) {
    console.error('[data] fetchAndFilter error:', e);
    return [];
  }
}

// --------------------------------------------------------------------------
// Featured article
// --------------------------------------------------------------------------
export async function getFeaturedArticle(): Promise<NewsArticle | null> {
  const articles = await fetchAndFilter(a => a.featured && a.status === 'published', 1);
  return articles.length > 0 ? articles[0] : null;
}

// --------------------------------------------------------------------------
// Latest articles
// --------------------------------------------------------------------------
export async function getLatestArticles(count = 8): Promise<NewsArticle[]> {
  return fetchAndFilter(a => a.status === 'published', count);
}

// --------------------------------------------------------------------------
// Articles by category slug
// --------------------------------------------------------------------------
export async function getArticlesByCategory(
  categorySlug: string,
  count = 10
): Promise<NewsArticle[]> {
  return fetchAndFilter(
    a => a.status === 'published' && a.categorySlug === categorySlug, 
    count
  );
}

// --------------------------------------------------------------------------
// Articles by type
// --------------------------------------------------------------------------
export async function getArticlesByType(
  type: 'explainer' | 'opinion' | 'video' | 'standard',
  count = 5
): Promise<NewsArticle[]> {
  return fetchAndFilter(
    a => a.status === 'published' && a.articleType === type, 
    count
  );
}

// --------------------------------------------------------------------------
// Single article by slug
// --------------------------------------------------------------------------
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    if (!db) return null;
    const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return toArticle(snap.docs[0].id, snap.docs[0].data());
  } catch (e) {
    console.error(`[data] getArticleBySlug(${slug}) error:`, e);
  }
  return null;
}

// --------------------------------------------------------------------------
// Breaking / Trending / Tags
// --------------------------------------------------------------------------
export async function getBreakingNews(count = 5): Promise<NewsArticle[]> {
  return fetchAndFilter(a => a.isBreaking && a.status === 'published', count);
}

export async function getTrendingArticles(count = 5): Promise<NewsArticle[]> {
  return fetchAndFilter(a => a.status === 'published', count); // In memory sort by views if needed
}

export async function getLatestGlobalArticles(count = 5): Promise<NewsArticle[]> {
  return getLatestArticles(count);
}

// --------------------------------------------------------------------------
// Categories & Authors & Stories
// --------------------------------------------------------------------------
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    if (!db) return null;
    const q = query(collection(db, 'categories'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0].data();
      return { id: snap.docs[0].id, name: d.name, slug: d.slug, description: d.description } as Category;
    }
  } catch (e) {
    console.error(`[data] getCategoryBySlug error:`, e);
  }
  return null;
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    
    if (snap.empty) return [];

    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch (e) {
    console.error('[data] getAllCategories error:', e);
    return [];
  }
}

export async function getAuthorById(id: string): Promise<Author | null> {
  try {
    if (!db) return null;
    const snap = await getDocs(query(collection(db, 'authors'), limit(100))); // Small collection
    const doc = snap.docs.find(d => d.id === id);
    if (doc) return { id: doc.id, ...doc.data() } as Author;
  } catch (e) {
    console.error(`[data] getAuthorById error:`, e);
  }
  return null;
}

export async function getVisualStories(): Promise<VisualStory[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, 'visual-stories'), limit(50));
    const snap = await getDocs(q);
    
    if (snap.empty) return [];

    return snap.docs
      .map(d => toVisualStory(d.id, d.data()))
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 10);
  } catch (e) {
    console.error('[data] getVisualStories error:', e);
    return [];
  }
}

export async function getVisualStoryBySlug(slug: string): Promise<VisualStory | null> {
  try {
    if (!db) return null;
    const q = query(collection(db, 'visual-stories'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return toVisualStory(snap.docs[0].id, snap.docs[0].data());
  } catch (e) {
    console.error(`[data] getVisualStoryBySlug(${slug}) error:`, e);
  }
  return null;
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    if (!db) return toAboutContent('about-us', {});
    const ref = doc(db, 'site-content', 'about-us');
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return toAboutContent('about-us', {});
    }

    return toAboutContent(snap.id, snap.data() || {});
  } catch (e) {
    console.error('[data] getAboutPageContent error:', e);
    return toAboutContent('about-us', {});
  }
}

export async function searchArticles(queryStr: string): Promise<NewsArticle[]> {
  const term = queryStr.toLowerCase().trim();
  if (!term) return [];
  // For search, we always use memory-based search on the buffer
  const pool = await fetchAndFilter(a => true, 200);

  return pool.filter(a => 
    a.title?.toLowerCase().includes(term) || 
    a.excerpt?.toLowerCase().includes(term) ||
    a.tags?.some(t => t.toLowerCase().includes(term))
  );
}
