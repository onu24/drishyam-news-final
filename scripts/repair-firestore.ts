import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  getFirestore 
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load directly from the project's .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

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

async function repair() {
  console.log('🚀 Starting Firestore Schema Repair...');
  
  const colRef = collection(db, 'articles');
  const snap = await getDocs(colRef);
  
  console.log(`Found ${snap.size} articles to inspect.`);
  
  for (const d of snap.docs) {
    const data = d.data();
    const updates: any = {};
    
    // 1. Title Fix (Title -> title)
    if (data.Title && !data.title) {
      updates.title = data.Title;
      console.log(`   [${d.id}]: Correcting Title -> title`);
    }

    // 2. Status Fix (Missing -> published)
    if (!data.status && !data.Status) {
      updates.status = 'published';
      console.log(`   [${d.id}]: Adding missing status: published`);
    } else if (data.Status) {
      updates.status = data.Status.toLowerCase();
      console.log(`   [${d.id}]: Mapping Status -> status`);
    }

    // 3. Image Fix (imageUrl -> coverImage)
    if (data.imageUrl && !data.coverImage) {
      updates.coverImage = data.imageUrl;
      console.log(`   [${d.id}]: Mapping imageUrl -> coverImage`);
    }

    // 4. Category Slug Fix
    if (!data.categorySlug) {
      const cat = data.category || data.Category || 'India';
      updates.categorySlug = cat.toLowerCase().replace(/\s+/g, '-');
      console.log(`   [${d.id}]: Deriving missing categorySlug: ${updates.categorySlug}`);
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, 'articles', d.id), updates);
      console.log(`   ✅ Repaired ${d.id}`);
    } else {
      console.log(`   ⚪ ${d.id} is already healthy.`);
    }
  }
  
  console.log('\n✨ Repair Complete! Articles should now be visible on the frontend.');
}

repair().catch(console.error);
