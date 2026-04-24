import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminJwt, COOKIE_NAME } from '@/lib/auth';

/**
 * GET /api/admin/me
 * Returns { isAdmin: true } if the session cookie is valid, else { isAdmin: false }.
 * Used by client-side hooks to check auth state without Firebase.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ isAdmin: false });
    }

    const payload = await verifyAdminJwt(token);
    if (!payload) {
      return NextResponse.json({ isAdmin: false });
    }

    return NextResponse.json({ isAdmin: true, email: payload.email });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
