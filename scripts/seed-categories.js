#!/usr/bin/env node

/**
 * Seed only homepage/navigation categories into Firestore.
 *
 * Run:
 *   node --env-file=.env.local scripts/seed-categories.js
 */

const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!projectId || !clientEmail || !privateKey) {
  console.error('[seed-categories] Missing Firebase Admin env vars.');
  console.error('Required: FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID), FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

const categories = [
  { id: 'cat_india', name: 'India', slug: 'india', description: 'National news and major breaking stories.', order: 1 },
  { id: 'cat_states', name: 'States', slug: 'states', description: 'Regional news from across all Indian states.', order: 2 },
  { id: 'cat_politics', name: 'Politics', slug: 'politics', description: 'Elections, policies, and partisan shifts.', order: 3 },
  { id: 'cat_economy', name: 'Economy', slug: 'economy', description: 'Budgets, markets, Sensex, and corporate India.', order: 4 },
  { id: 'cat_tech', name: 'Technology', slug: 'technology', description: 'Bengaluru ecosystem, AI, and IT industry.', order: 5 },
  { id: 'cat_sports', name: 'Sports', slug: 'sports', description: 'Cricket, Olympics, and national sporting events.', order: 6 },
  { id: 'cat_ent', name: 'Entertainment', slug: 'entertainment', description: 'Bollywood, regional cinema, and pop culture.', order: 7 },
  { id: 'cat_jobs', name: 'Jobs', slug: 'jobs', description: 'Employment news and career opportunities.', order: 8 },
  { id: 'cat_exams', name: 'Exams', slug: 'exams', description: 'Competitive exams, results, and notifications.', order: 9 },
  { id: 'cat_explainers', name: 'Explainers', slug: 'explainers', description: 'Deep dives and analysis.', order: 10 },
  { id: 'cat_videos', name: 'Videos', slug: 'videos', description: 'Visual storytelling and shorts.', order: 11 },
];

async function main() {
  console.log('[seed-categories] Seeding categories...');
  const now = new Date().toISOString();

  for (const cat of categories) {
    const ref = db.collection('categories').doc(cat.id);
    await ref.set(
      {
        ...cat,
        updatedAt: now,
        metaTitle: `${cat.name} News | Drishyam`,
        metaDescription: `Latest ${cat.name.toLowerCase()} stories and updates on Drishyam News.`,
      },
      { merge: true }
    );
    console.log(`  - upserted: ${cat.name}`);
  }

  console.log('[seed-categories] Done.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed-categories] Failed:', err);
    process.exit(1);
  });
