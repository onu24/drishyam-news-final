'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '../firebase-admin';

/**
 * auth-actions.ts — Server-side Auth logic for Next.js 15+
 *
 * This file contains server actions for creating and destroying 
 * secure admin sessions.
 */

export async function createSession(idToken: string) {
  const cookieStore = await cookies();
  
  try {
    // 1. Verify the ID token using the Admin SDK
    const decodedToken = await adminAuth().verifyIdToken(idToken);
    
    if (decodedToken) {
      // 2. Clear previous session
      cookieStore.delete('drishyam_admin_session');
      
      // 3. Create a Firebase session cookie (valid for 5 days)
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });
      
      // 4. Set the HTTP-only, secure cookie
      cookieStore.set('drishyam_admin_session', sessionCookie, {
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
      
      return { success: true };
    }
  } catch (error) {
    console.error('[Auth Action] Session creation failed:', error);
    return { success: false, error: 'Failed to create session' };
  }
  
  return { success: false, error: 'Invalid token' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('drishyam_admin_session');
  return { success: true };
}
