// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { adminAuth } from '@/lib/firebase-admin';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * AdminLayout.tsx — Auth-Bypassed Shell
 *
 * Current state: AUTH DEACTIVATED for direct development access.
 * To re-enable, un-comment the redirect logic and cryptographic verification below.
 */

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();
  // const session = cookieStore.get('drishyam_admin_session')?.value;

  // // 1. Initial redirect if cookie is missing
  // if (!session) {
  //   redirect('/admin/login');
  // }

  // try {
  //   // 2. CRYPTOGRAPHIC VERIFICATION
  //   // This ensures someone hasn't just manually set a fake cookie.
  //   const decodedClaims = await adminAuth().verifySessionCookie(session, true);
    
  //   // Optional: Log the admin access
  //   // console.log(`[Admin Access] ${decodedClaims.email} on ${new Date().toISOString()}`);

  // } catch (error) {
  //   console.error('[Admin Layout] Session verification failed:', error);
  //   // 3. Clear the invalid cookie and redirect
  //   redirect('/admin/login');
  // }

  return (
    <div className="flex h-screen bg-secondary/20 md:overflow-auto text-foreground">
      <AdminSidebar />
      <main className="flex-1 w-full relative z-0 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-4 md:p-8 lg:p-12 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
