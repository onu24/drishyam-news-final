/**
 * lib/dashboard.ts — Admin data layer (Server-Side Hardening)
 *
 * This version of the dashboard uses the Firebase Admin SDK to ensure 
 * high-authority access to the database. All operations here bypass 
 * client-side Firestore security rules, resolving the 'empty selects' 
 * issue on the server.
 */

import { adminDb } from './firebase-admin';
import { Article, Category, Author, DashboardStats, ArticleStatus, VisualStory, AboutPageContent } from './types';
import { slugify, FALLBACK_IMAGE } from './utils';

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function toArticle(id: string, data: any): Article {
  const title = data.title || 'Untitled Story';
  const category = data.category || 'News';
  const categorySlug = data.categorySlug || slugify(category);

  return {
    id,
    title,
    slug: data.slug || slugify(title),
    excerpt: data.excerpt || '',
    content: data.content || '',
    categoryId: data.categoryId || '',
    category,
    categorySlug,
    coverImage: data.coverImage || FALLBACK_IMAGE,
    imageUrl: data.coverImage || FALLBACK_IMAGE,
    authorId: data.authorId || 'drishyam-editorial',
    status: (data.status || 'published') as ArticleStatus,
    featured: !!data.featured,
    tags: data.tags || [],
    articleType: data.articleType || 'standard',
    views: data.views || 0,
    readingTime: data.readingTime || 3,
    language: data.language || 'en',
    // Admin SDK timestamps use .toDate()
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt ?? new Date().toISOString(),
    keyPoints: data.keyPoints || [],
    metaTitle: data.metaTitle || title,
    metaDescription: data.metaDescription || data.excerpt || '',
    isBreaking: !!data.isBreaking,
    isLive: !!data.isLive,
    videoUrl: data.videoUrl || '',
  } as Article;
}

function toVisualStory(id: string, data: any): VisualStory {
  return {
    id,
    title: data.title || 'Untitled Story',
    slug: data.slug || slugify(data.title || 'story'),
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

function toAboutContent(id: string, data: any): AboutPageContent {
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

// --------------------------------------------------------------------------
// Articles (Admin High-Auth)
// --------------------------------------------------------------------------

export async function getAllArticles(): Promise<Article[]> {
  try {
    const snap = await adminDb().collection('articles').orderBy('createdAt', 'desc').limit(500).get();
    return snap.docs.map(d => toArticle(d.id, d.data()));
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch articles:', err);
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const snap = await adminDb().collection('articles').doc(id).get();
    return snap.exists ? toArticle(snap.id, snap.data()) : null;
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch article:', err);
    return null;
  }
}

export async function createArticle(
  data: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'>
): Promise<Article> {
  const db = adminDb();
  
  const payload = {
    ...data,
    views: 0,
    createdAt: new Date(), // Firebase Admin supports native Dates as timestamps
    updatedAt: new Date(),
  };

  const ref = await db.collection('articles').add(payload);
  return { id: ref.id, ...payload } as unknown as Article;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article> {
  const db = adminDb();
  const updates: Record<string, any> = { ...data, updatedAt: new Date() };

  await db.collection('articles').doc(id).update(updates);
  const updated = await db.collection('articles').doc(id).get();
  return toArticle(updated.id, updated.data()!);
}

export async function deleteArticle(id: string): Promise<boolean> {
  await adminDb().collection('articles').doc(id).delete();
  return true;
}

export async function getRecentArticles(n = 5): Promise<Article[]> {
  try {
    const snap = await adminDb().collection('articles').orderBy('createdAt', 'desc').limit(n).get();
    
    if (snap.empty) {
      return [];
    }
    
    return snap.docs.map(d => toArticle(d.id, d.data()));
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch recent articles:', err);
    return [];
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const snap = await adminDb().collection('articles').where('featured', '==', true).limit(50).get();
    
    if (snap.empty) {
      return [];
    }

    return snap.docs.map(d => toArticle(d.id, d.data())).filter(a => a.status === 'published');
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch featured articles:', err);
    return [];
  }
}

export async function getAllVisualStories(limitCount = 200): Promise<VisualStory[]> {
  try {
    const snap = await adminDb().collection('visual-stories').limit(limitCount).get();

    if (snap.empty) {
      return [];
    }

    return snap.docs
      .map((d) => toVisualStory(d.id, d.data()))
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch visual stories:', err);
    return [];
  }
}

export async function getVisualStoryById(id: string): Promise<VisualStory | null> {
  try {
    const snap = await adminDb().collection('visual-stories').doc(id).get();
    return snap.exists ? toVisualStory(snap.id, snap.data()) : null;
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch visual story:', err);
    return null;
  }
}

export async function createVisualStory(
  data: Omit<VisualStory, 'id' | 'createdAt'>
): Promise<VisualStory> {
  const db = adminDb();
  const payload = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ref = await db.collection('visual-stories').add(payload);
  return toVisualStory(ref.id, payload);
}

export async function updateVisualStory(id: string, data: Partial<VisualStory>): Promise<VisualStory> {
  const db = adminDb();
  const updates: Record<string, any> = {
    ...data,
    updatedAt: new Date(),
  };

  await db.collection('visual-stories').doc(id).update(updates);
  const updated = await db.collection('visual-stories').doc(id).get();
  return toVisualStory(updated.id, updated.data()!);
}

export async function deleteVisualStory(id: string): Promise<boolean> {
  await adminDb().collection('visual-stories').doc(id).delete();
  return true;
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const ref = adminDb().collection('site-content').doc('about-us');
    const snap = await ref.get();

    if (!snap.exists) {
      return toAboutContent('about-us', {});
    }

    return toAboutContent(snap.id, snap.data());
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch about page content:', err);
    return toAboutContent('about-us', {});
  }
}

export async function upsertAboutPageContent(data: Partial<AboutPageContent>): Promise<AboutPageContent> {
  const db = adminDb();
  const ref = db.collection('site-content').doc('about-us');
  const payload = {
    ...data,
    updatedAt: new Date(),
  };

  await ref.set(payload, { merge: true });
  const updated = await ref.get();
  return toAboutContent(updated.id, updated.data() || payload);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const db = adminDb();
    const articlesCol = db.collection('articles');

    const [totalSnap, publishedSnap, draftSnap, reviewSnap, featuredSnap] = await Promise.all([
      articlesCol.get(),
      articlesCol.where('status', '==', 'published').get(),
      articlesCol.where('status', '==', 'draft').get(),
      articlesCol.where('status', '==', 'review').get(),
      articlesCol.where('featured', '==', true).get(),
    ]);

    if (totalSnap.empty) {
      return {
        totalArticles: 0,
        publishedCount: 0,
        draftCount: 0,
        reviewCount: 0,
        featuredArticles: 0,
        totalViews: 0,
        totalCategories: 0,
        totalAuthors: 0,
      };
    }

    const publishedDocs = publishedSnap.docs;
    const totalViews = publishedDocs.reduce((s, d) => s + ((d.data().views ?? 0) as number), 0);

    const catSnap = await db.collection('categories').get();
    const authSnap = await db.collection('authors').get();

    return {
      totalArticles: totalSnap.size,
      publishedCount: publishedSnap.size,
      draftCount: draftSnap.size,
      reviewCount: reviewSnap.size,
      featuredArticles: featuredSnap.size,
      totalViews,
      totalCategories: catSnap.size,
      totalAuthors: authSnap.size,
    };
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch statistics:', err);
    return {
      totalArticles: 0,
      publishedCount: 0,
      draftCount: 0,
      reviewCount: 0,
      featuredArticles: 0,
      totalViews: 0,
      totalCategories: 0,
      totalAuthors: 0,
    };
  }
}

// --------------------------------------------------------------------------
// Categories & Authors
// --------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await adminDb().collection('categories').orderBy('order', 'asc').get();
    
    if (snap.empty) return [];

    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Category);
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch categories:', err);
    return [];
  }
}

export async function getAuthors(): Promise<Author[]> {
  try {
    const snap = await adminDb().collection('authors').get();
    
    if (snap.empty) return [];

    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Author);
  } catch (err) {
    console.error('[Dashboard/Admin] Failed to fetch authors:', err);
    return [];
  }
}

export async function createAuthor(data: Omit<Author, 'id'>): Promise<Author> {
  const db = adminDb();
  const ref = await db.collection('authors').add(data);
  return { id: ref.id, ...data } as Author;
}

export async function updateAuthor(id: string, data: Partial<Author>): Promise<Author> {
  const db = adminDb();
  await db.collection('authors').doc(id).update(data);
  const updated = await db.collection('authors').doc(id).get();
  return { id: updated.id, ...updated.data() } as Author;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await adminDb().collection('categories').doc(id).delete();
  return true;
}

export async function createCategory(
  data: Omit<Category, 'id' | 'order'> & { order: number }
): Promise<Category> {
  const db = adminDb();
  const ref = await db.collection('categories').add(data);
  return { id: ref.id, ...data } as Category;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const db = adminDb();
  await db.collection('categories').doc(id).update(data);
  const updated = await db.collection('categories').doc(id).get();
  return { id: updated.id, ...updated.data() } as Category;
}

export async function deleteAuthor(id: string): Promise<boolean> {
  await adminDb().collection('authors').doc(id).delete();
  return true;
}

export { getAllArticles as getArticlesByCategory };
