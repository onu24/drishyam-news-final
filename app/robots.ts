import { MetadataRoute } from 'next'

/**
 * robots.ts — Path Protection & Crawling Instructions
 *
 * This file tells search engine bots which pages they can index. 
 * We specifically disallow /admin to protect the CMS while allowing 
 * public news content to be crawled.
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://drishyam-news.com'; // Placeholder, update to your actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/', // Protect your server-only routes
        '/_next/', // Standard NextJS build artifacts
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
