#!/usr/bin/env node

/**
 * Seed script for Drishyam News
 * This script creates sample data in Firebase Firestore
 * 
 * Usage: node scripts/seed-data.js
 * 
 * Note: Requires FIREBASE_PROJECT_ID and other Firebase env vars to be set
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
  console.log('Note: FIREBASE_SERVICE_ACCOUNT_PATH not set. Using default credentials.');
}

try {
  const serviceAccount = serviceAccountPath
    ? require(path.resolve(serviceAccountPath))
    : undefined;

  admin.initializeApp({
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'drishyam-news',
  });
} catch (error) {
  console.error('Firebase initialization error. Make sure credentials are set up.');
  process.exit(1);
}

const db = admin.firestore();

const sampleCategories = [
  { name: 'Politics', slug: 'politics', order: 1 },
  { name: 'Business', slug: 'business', order: 2 },
  { name: 'Technology', slug: 'technology', order: 3 },
  { name: 'Sports', slug: 'sports', order: 4 },
];

const sampleAuthors = [
  {
    name: 'Rajesh Kumar',
    bio: 'Senior Political Correspondent',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
  },
  {
    name: 'Priya Sharma',
    bio: 'Business & Economics Editor',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
  },
  {
    name: 'Amit Patel',
    bio: 'Technology Correspondent',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
  },
  {
    name: 'Sara Khan',
    bio: 'Sports Journalist',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
  },
];

const sampleArticles = [
  {
    title: 'New Policy Reforms Shape Economic Landscape',
    headline: 'Government Announces Major Policy Reforms to Boost Economic Growth',
    category: 'Politics',
    excerpt:
      'A comprehensive set of policy reforms announced today aims to streamline regulations and encourage business growth across all sectors.',
    content: `The government has announced a sweeping package of policy reforms designed to modernize the economy and create new opportunities for businesses and workers.

## Key Changes

The reforms include significant changes to labor laws, tax regulations, and foreign investment policies. Officials hope these changes will attract more international companies and create thousands of new jobs.

The initiative comes as the economy faces headwinds from global market volatility. Experts believe the reforms could help stabilize growth and improve competitiveness on the world stage.

Key initiatives include:
- Streamlined business registration process
- Reduced corporate tax rates for small businesses
- New incentives for green energy projects
- Simplified import/export procedures

Industry leaders have largely praised the announcements, with several major corporations already announcing expansion plans. The government expects the reforms to take full effect within six months.`,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    views: 15420,
    date: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
  {
    title: 'Tech Giants Compete for AI Supremacy',
    headline: 'Artificial Intelligence Race Intensifies Among Major Tech Companies',
    category: 'Technology',
    excerpt:
      'Major technology companies are investing billions in artificial intelligence development, with each company competing to create the most advanced AI systems.',
    content: `The artificial intelligence industry is experiencing unprecedented growth as major tech companies compete to develop the most advanced and capable AI systems.

## Investment Surge

Companies are pouring billions of dollars into AI research and development. New startups are also emerging, many backed by venture capital firms eager to capitalize on the AI boom.

The competition is driving rapid innovation across multiple fields including natural language processing, computer vision, and robotics.

## Applications

AI is being applied in increasingly diverse ways:
- Healthcare diagnostics
- Autonomous vehicles
- Language translation
- Scientific research
- Creative content generation

Experts predict that AI will become integrated into nearly every aspect of business and daily life within the next decade. However, concerns about job displacement and ethical implications remain significant issues for policymakers and technologists alike.`,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1677442d019aaf72e1a8dfb5db3ff149?w=1200&h=600&fit=crop',
    views: 8932,
    date: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
  },
  {
    title: 'Stock Markets Reach New Highs',
    headline: 'Global Markets Experience Strong Rally Amid Economic Optimism',
    category: 'Business',
    excerpt:
      'Major stock indices around the world have reached new record highs as investors show growing confidence in the economic outlook.',
    content: `Global stock markets are celebrating strong gains following a week of positive economic data and corporate earnings reports.

## Market Performance

The S&P 500 index closed at its highest level ever, while European and Asian markets also posted significant gains. Investors are particularly optimistic about the technology sector, which led the rally.

Consumer confidence data released yesterday showed stronger than expected readings, suggesting that businesses and households remain relatively upbeat about economic prospects.

## Sector Leaders

Various sectors drove the rally:
- Technology companies benefited from AI momentum
- Energy stocks rose on higher oil prices
- Financial services gained on rising interest rates
- Healthcare showed steady growth

Analysts remain cautiously optimistic but warn that geopolitical tensions and inflation could derail the positive momentum. Investors are advised to maintain diversified portfolios and avoid overexposure to any single sector.`,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1611974519253-7c3f3fced6e8?w=1200&h=600&fit=crop',
    views: 12104,
    date: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
  },
  {
    title: 'Championship Team Defeats Rivals in Thrilling Match',
    headline: 'Underdog Victory Stuns Opponents in Intense Sports Championship',
    category: 'Sports',
    excerpt:
      'In a stunning display of skill and determination, the underdog team defeated the heavily favored champions in a thrilling match that went into overtime.',
    content: `In one of the most dramatic sports moments of the season, an underdog team pulled off a stunning upset victory against the heavily favored champions.

## Match Highlights

The game remained competitive throughout, with both teams trading leads multiple times. The turning point came in the final minutes when a crucial defensive play changed the momentum.

The winning goal came in overtime, thrilling the home crowd and sending supporters into celebration.

## Player Performances

Several key players delivered exceptional performances:
- The goalkeeper made several critical saves
- The striker showed tremendous composure under pressure  
- The midfield dominated possession in crucial moments
- The defense held strong against repeated attacks

This victory propels the underdog team toward playoff contention and demonstrates that anything is possible in professional sports. Coach praised the team's resilience and mental toughness after the match.`,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1518611505868-d2b4a0e26fe5?w=1200&h=600&fit=crop',
    views: 9876,
    date: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Seed categories
    console.log('📁 Adding categories...');
    const categoriesRef = db.collection('categories');
    for (const category of sampleCategories) {
      const docRef = categoriesRef.doc();
      await docRef.set(category);
      console.log(`  ✓ Added: ${category.name}`);
    }

    // Seed authors
    console.log('\n👥 Adding authors...');
    const authorsRef = db.collection('authors');
    const authorIds = [];
    for (const author of sampleAuthors) {
      const docRef = authorsRef.doc();
      await docRef.set(author);
      authorIds.push(docRef.id);
      console.log(`  ✓ Added: ${author.name}`);
    }

    // Seed articles with author references
    console.log('\n📰 Adding articles...');
    const articlesRef = db.collection('articles');
    for (let i = 0; i < sampleArticles.length; i++) {
      const article = sampleArticles[i];
      const authorId = authorIds[i % authorIds.length];
      const slug = article.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const docRef = articlesRef.doc();
      await docRef.set({
        ...article,
        authorId,
        slug,
        createdAt: article.date,
        updatedAt: article.date,
      });
      console.log(`  ✓ Added: ${article.title}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Go to http://localhost:3000/admin/login');
    console.log('  2. Create an admin account');
    console.log('  3. Start creating and managing articles');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
