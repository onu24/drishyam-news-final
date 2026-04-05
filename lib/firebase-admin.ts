import * as admin from 'firebase-admin';

/**
 * lib/firebase-admin.ts — Server-side Firebase SDK
 *
 * This SDK is only for server environments (Server Components, API Routes, Middleware).
 * It is used for verifying session cookies and managing data with elevated privileges.
 */

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export function getAdminApp() {
  if (!admin.apps.length) {
    // If we have no credentials, we crash gracefully in Dev but warn for Production
    if (!firebaseAdminConfig.privateKey || !firebaseAdminConfig.clientEmail) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('[Firebase Admin] Missing service account credentials in environment.');
      }
      console.warn('[Firebase Admin] Missing credentials. Initializing dummy app for mock mode.');
      return admin.initializeApp({ projectId: 'demo-drishyam' });
    }

    try {
      return admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig as any),
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
