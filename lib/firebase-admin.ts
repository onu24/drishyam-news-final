import * as admin from 'firebase-admin';

/**
 * lib/firebase-admin.ts — Server-side Firebase SDK
 *
 * This SDK is only for server environments (Server Components, API Routes, Middleware).
 * It is used for verifying session cookies and managing data with elevated privileges.
 */

function cleanEnv(value?: string | null) {
  if (!value) return undefined;
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function normalizeBucketName(value?: string | null) {
  const cleaned = cleanEnv(value);
  if (!cleaned) return undefined;

  return cleaned
    .replace(/^gs:\/\//, '')
    .replace(/^https?:\/\/storage\.googleapis\.com\//, '')
    .replace(/\/+$/, '');
}

const projectId = cleanEnv(process.env.FIREBASE_PROJECT_ID) || cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
const clientEmail = cleanEnv(process.env.FIREBASE_CLIENT_EMAIL);
const privateKey = cleanEnv(process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n');
const configuredStorageBucket =
  normalizeBucketName(process.env.FIREBASE_STORAGE_BUCKET) ||
  normalizeBucketName(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
const fallbackFirebaseStorageBucket = projectId ? `${projectId}.firebasestorage.app` : undefined;
const fallbackAppspotBucket = projectId ? `${projectId}.appspot.com` : undefined;
const storageBucket = configuredStorageBucket || fallbackFirebaseStorageBucket || fallbackAppspotBucket;

export function getAdminApp() {
  if (!admin.apps.length) {
    // If we have no credentials, we crash gracefully in Dev but warn for Production
    if (!privateKey || !clientEmail) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('[Firebase Admin] Missing service account credentials in environment.');
      }
      console.warn('[Firebase Admin] Missing credentials. Initializing dummy app for mock mode.');
      return admin.initializeApp({ projectId: 'demo-drishyam' });
    }

    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        ...(storageBucket ? { storageBucket } : {}),
      });
    } catch (error) {
      console.error('[Firebase Admin] Initialization error (falling back to mock mode):', error);
      return admin.initializeApp({ projectId: 'demo-drishyam' });
    }
  }
  return admin.app();
}

export const adminAuth = () => getAdminApp().auth();
export const adminDb = () => getAdminApp().firestore();
export const adminStorage = () => getAdminApp().storage();
export const getAdminStorageBucketName = () => storageBucket;
export const getAdminStorageBucketCandidates = () =>
  Array.from(
    new Set([configuredStorageBucket, fallbackFirebaseStorageBucket, fallbackAppspotBucket].filter(Boolean))
  ) as string[];
