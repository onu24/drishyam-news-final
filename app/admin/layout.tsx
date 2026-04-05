import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drishyam Admin',
  description: 'Editorial Newsroom Hub',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      {children}
    </div>
  );
}
