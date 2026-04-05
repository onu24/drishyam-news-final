import { MetadataRoute } from 'next'
import { getLatestArticles, getAllCategories } from '@/lib/data'

/**
 * sitemap.ts — Automated Search Indexing
 *
 * This file dynamically generates sitemap.xml. It fetches the latest 
 * categories and articles from Firestore so search engines (Google/Bing)
 * are always aware of your new content immediately after publishing.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://drishyam-news.com'; // Placeholder, update to your actual domain
  
  // 1. Fetch live data for the sitemap
  const [articles, categories] = await Promise.all([
    getLatestArticles(500), // Index the latest 500 articles
    getAllCategories(),
  ]);

  // 2. Static Routes
  const staticRoutes = [
    '',
    '/latest',
    '/breaking',
    '/visual-stories',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 3. Category Routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  // 4. Article Routes
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
