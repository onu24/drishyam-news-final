import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getContactPageContent } from '@/lib/dashboard';
import { ContactPageClient } from '@/components/pages/ContactPageClient';

export const revalidate = 3600;

export async function generateMetadata() {
  const content = await getContactPageContent();
  return {
    title: `${content.heroTitle} — Drishyam News`,
    description: content.heroSubtitle,
  };
}

export default async function ContactPage() {
  const content = await getContactPageContent();

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <ContactPageClient content={content} />

      <Footer />
    </div>
  );
}
