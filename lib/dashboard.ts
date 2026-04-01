import { Article, Category, Author, DashboardStats, ArticleStatus } from './types';
import { mockArticles, mockCategories, mockAuthors } from './mock-data';

// Simulate a brief network delay (e.g. 300ms) to emulate a real database call
const delay = (ms: number = 300) => new Promise(res => setTimeout(res, ms));

export async function getAllArticles(): Promise<Article[]> {
  await delay();
  return [...mockArticles].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

export async function getArticleById(id: string): Promise<Article | null> {
  await delay();
  const article = mockArticles.find(a => a.id === id);
  return article || null;
}

export async function getCategories(): Promise<Category[]> {
  await delay();
  return [...mockCategories];
}

export async function getAuthors(): Promise<Author[]> {
  await delay();
  return [...mockAuthors];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  const publishedCount = mockArticles.filter(a => a.status === 'published').length;
  const draftCount = mockArticles.filter(a => a.status === 'draft').length;
  const reviewCount = mockArticles.filter(a => a.status === 'review').length;
  
  const totalViews = mockArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const featuredArticles = mockArticles.filter(a => a.featured).length;

  return {
    totalArticles: mockArticles.length,
    featuredArticles,
    totalViews,
    totalCategories: mockCategories.length,
    totalAuthors: mockAuthors.length,
    publishedCount,
    draftCount,
    reviewCount
  };
}

export async function getRecentArticles(limit: number = 5): Promise<Article[]> {
  const articles = await getAllArticles(); // Already sorted by date
  return articles.slice(0, limit);
}

export async function getFeaturedArticles(): Promise<Article[]> {
  await delay();
  return mockArticles.filter(a => a.featured && a.status === 'published');
}

export async function getArticlesByStatus(status: ArticleStatus): Promise<Article[]> {
  await delay();
  return mockArticles.filter(a => a.status === status);
}

export async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  await delay();
  return mockArticles.filter(a => a.categoryId === categoryId);
}

export async function getArticlesByAuthor(authorId: string): Promise<Article[]> {
  await delay();
  return mockArticles.filter(a => a.authorId === authorId);
}

export async function deleteArticle(id: string): Promise<boolean> {
  await delay(400); // Simulate delete latency
  const index = mockArticles.findIndex(a => a.id === id);
  if (index !== -1) {
    mockArticles.splice(index, 1);
    return true;
  }
  return false;
}

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Article> {
  await delay(500); // Simulate slightly longer write time
  
  const newArticle: Article = {
    ...data,
    id: `art_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  };
  
  // Push to the in-memory array
  mockArticles.unshift(newArticle);
  return newArticle;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article> {
  await delay(500); // Simulate slightly longer write time
  
  const index = mockArticles.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Article not found');
  }

  const updatedArticle: Article = {
    ...mockArticles[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockArticles[index] = updatedArticle;
  return updatedArticle;
}

export async function getTopPerformingArticles(limit: number = 3): Promise<Article[]> {
  await delay();
  const articles = [...mockArticles].filter(a => a.status === 'published');
  return articles.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit);
}

export async function deleteCategory(id: string): Promise<boolean> {
  await delay(400); 
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories.splice(index, 1);
    return true;
  }
  return false;
}

export async function deleteAuthor(id: string): Promise<boolean> {
  await delay(400);
  const index = mockAuthors.findIndex(a => a.id === id);
  if (index !== -1) {
    mockAuthors.splice(index, 1);
    return true;
  }
  return false;
}
