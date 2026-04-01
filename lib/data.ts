import { collection, query, where, orderBy, limit, getDocs, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { NewsArticle, VisualStory, Author } from './types';
import { mockVisualStories, mockArticles, mockAuthors, mockCategories } from './mock-data';

// Use Next.js 14+ specific caching if needed, but since Firestore over REST is external,
// we just use standard promises. Next.js will cache these heavily by default if we don't opt-out.

// Ensure db exists before querying
const articleCollection = db ? collection(db, 'articles') : null;

export async function getFeaturedArticle(): Promise<NewsArticle | null> {
  if (!articleCollection) return null;
  try {
    const q = query(
      articleCollection,
      where('featured', '==', true),
      orderBy('date', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as NewsArticle;
    }
    return null;
  } catch (error) {
    console.error("Error fetching featured article:", error);
    return null;
  }
}

export async function getLatestArticles(count = 8): Promise<NewsArticle[]> {
  if (!articleCollection) return [];
  try {
    const q = query(
      articleCollection,
      orderBy('date', 'desc'),
      limit(count + 1) // +1 in case we need to filter out the featured lead
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }) as NewsArticle);
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

export async function getArticlesByCategory(category: string, count = 5): Promise<NewsArticle[]> {
  if (!articleCollection) return [];
  try {
    const q = query(
      articleCollection,
      where('category', '==', category),
      orderBy('date', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NewsArticle);
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return [];
  }
}

export async function getBreakingNews(count = 5): Promise<NewsArticle[]> {
  if (!articleCollection) return [];
  try {
    const q = query(
      articleCollection,
      where('isBreaking', '==', true),
      orderBy('date', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NewsArticle);
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return [];
  }
}

export async function getVisualStories(): Promise<VisualStory[]> {
  // Currently using mock data
  return mockVisualStories;
}

export async function getVisualStoryBySlug(slug: string): Promise<VisualStory | null> {
  // Currently using mock data
  return mockVisualStories.find(s => s.slug === slug) || null;
}

export async function searchArticles(query: string): Promise<NewsArticle[]> {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  return mockArticles.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(searchTerm);
    const excerptMatch = article.excerpt?.toLowerCase().includes(searchTerm);
    const tagMatch = article.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
    
    // Category match
    const category = mockCategories.find(c => c.id === article.categoryId);
    const categoryMatch = category?.name.toLowerCase().includes(searchTerm);
    
    // Author match
    const author = mockAuthors.find(a => a.id === article.authorId);
    const authorMatch = author?.name.toLowerCase().includes(searchTerm);

    return titleMatch || excerptMatch || tagMatch || categoryMatch || authorMatch;
  });
}

export async function getTrendingArticles(count = 5): Promise<NewsArticle[]> {
  // Use views to determine trending if available, otherwise just latest
  if (!articleCollection) {
    return (mockArticles as unknown as NewsArticle[])
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, count);
  }
  try {
    const q = query(
      articleCollection,
      orderBy('views', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle));
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return [];
  }
}

export async function getLatestGlobalArticles(count = 5): Promise<NewsArticle[]> {
  if (!articleCollection) {
    return (mockArticles as unknown as NewsArticle[])
      .sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime())
      .slice(0, count);
  }
  try {
    const q = query(
      articleCollection,
      orderBy('date', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle));
  } catch (error) {
    console.error("Error fetching latest global articles:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<any | null> {
  return mockCategories.find(c => c.slug === slug) || null;
}

export async function getAuthorById(id: string): Promise<Author | null> {
  return mockAuthors.find(a => a.id === id) || null;
}
