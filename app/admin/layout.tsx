'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-secondary/20 md:overflow-hidden text-foreground">
      <AdminSidebar />
      <main className="flex-1 w-full relative z-0 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-4 md:p-8 lg:p-12 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
