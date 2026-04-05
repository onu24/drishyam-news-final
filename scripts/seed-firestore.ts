import { 
  collection, 
  doc, 
  setDoc, 
  getFirestore 
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { mockArticles, mockAuthors, mockCategories } from '../lib/mock-data';
import { slugify } from '../lib/utils';

// This script uses the Client SDK so it works with the environment variables already in .env.local
// Run with: npx tsx scripts/seed-firestore.ts

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('🚀 Starting Production-Intant Firestore Seed...');
  const now = new Date().toISOString();

  // 1. Seed Categories
  console.log('📁 Seeding Categories...');
  for (const cat of mockCategories) {
    const standardizedCat = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug || slugify(cat.name),
      description: cat.description || '',
      order: cat.order || 0,
      updatedAt: now,
      metaTitle: `${cat.name} News | Drishyam`,
      metaDescription: `Read the latest ${cat.name} stories and analysis on Drishyam News.`,
    };
    await setDoc(doc(db, 'categories', cat.id), standardizedCat);
    console.log(`   ✅ ${cat.name}`);
  }

  // 2. Seed Authors
  console.log('👥 Seeding Authors...');
  for (const auth of mockAuthors) {
    const standardizedAuth = {
      id: auth.id,
      name: auth.name,
      bio: auth.bio,
      avatar: auth.avatar || auth.avatarUrl || '/images/placeholders/avatar-placeholder.jpg',
      role: auth.role || 'Contributor',
      updatedAt: now
    };
    await setDoc(doc(db, 'authors', auth.id), standardizedAuth);
    console.log(`   ✅ ${auth.name}`);
  }

  // 3. Seed Articles
  console.log('📰 Seeding Articles...');
  for (const art of mockArticles) {
    const cat = mockCategories.find(c => c.id === art.categoryId);
    const categoryName = cat?.name || 'News';
    const categorySlug = cat?.slug || slugify(categoryName);
    
    // Clean and consolidate
    const standardizedArt = {
      id: art.id,
      title: art.title || art.Headline || 'Untitled Story',
      slug: art.slug || slugify(art.title || art.Headline || 'untitled'),
      excerpt: art.excerpt || '',
      content: art.content || '',
      categoryId: art.categoryId || 'cat_india',
      category: categoryName,
      categorySlug: categorySlug,
      coverImage: art.coverImage || art.imageUrl || '/images/placeholders/news-placeholder.jpg',
      authorId: art.authorId || 'drishyam-editorial',
      status: 'published',
      featured: !!art.featured,
      articleType: art.articleType || 'standard',
      views: art.views || 0,
      tags: art.tags || [],
      language: art.language || 'en',
      createdAt: art.createdAt || now,
      updatedAt: now,
      metaTitle: art.title || art.Headline,
      metaDescription: art.excerpt || '',
      keyPoints: art.keyPoints || []
    };

    await setDoc(doc(db, 'articles', art.id), standardizedArt);
    console.log(`   ✅ ${standardizedArt.title}`);
  }

  console.log('\n✨ Production-Ready Seeding Complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
