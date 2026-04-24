'use server';

import { cookies } from 'next/headers';
import {
  signAdminJwt,
  verifyAdminCredentials,
  COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from '../auth';

/**
 * auth-actions.ts — Server-side Auth logic
 *
 * Validates admin credentials against ADMIN_EMAIL + ADMIN_PASSWORD env vars.
 * On success, issues a signed JWT stored as an HTTP-only cookie.
 */

export async function createSession(email: string, password: string) {
  try {
    const valid = verifyAdminCredentials(email, password);
    if (!valid) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = await signAdminJwt({ email, role: 'admin' });
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
      maxAge: SESSION_DURATION_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return { success: true };
  } catch (error) {
    console.error('[Auth Action] Session creation failed:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}
