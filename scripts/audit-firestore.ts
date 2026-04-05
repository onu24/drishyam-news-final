import { 
  collection, 
  getDocs, 
  getFirestore, 
  query, 
  limit, 
  orderBy 
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

async function audit() {
  console.log('--- FIRESTORE AUDIT ---');
  console.log('Project:', firebaseConfig.projectId);
  
  const col = collection(db, 'articles');
  const q = query(col, orderBy('createdAt', 'desc'), limit(10));
  
  try {
    const snap = await getDocs(q);
    console.log(`Found ${snap.size} articles.`);
    
    snap.docs.forEach((d, i) => {
      const data = d.data();
      console.log(`[${i}] ID: ${d.id}`);
      console.log('--- RAW DATA ---');
      console.log(JSON.stringify(data, null, 2));
      console.log('-----------------------');
    });
  } catch (err) {
    console.error('Audit failed:', err);
  }
}

audit();
