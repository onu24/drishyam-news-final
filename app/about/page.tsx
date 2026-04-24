import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getAboutPageContent } from '@/lib/data';
import { AboutPageClient } from '@/components/pages/AboutPageClient';

export const revalidate = 300;

export const metadata = {
  title: 'About Us — Drishyam News',
  description: 'Learn about Drishyam News, our mission, vision, and editorial values.',
};

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <AboutPageClient content={content} />

      <Footer />
    </div>
  );
}
