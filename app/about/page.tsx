import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getAboutPageContent } from '@/lib/data';
import Image from 'next/image';

export const revalidate = 300;

export const metadata = {
  title: 'About Us — Drishyam News',
  description: 'Learn about Drishyam News, our mission, vision, and editorial values.',
};

export default async function AboutPage() {
  const content = await getAboutPageContent();
  const profileImage = content.profileImage || '/placeholder-user.jpg';

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <main className="flex-1 bg-secondary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-10">
          <section className="border-b border-border pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 border-background shadow-lg bg-secondary/30">
                <Image src={profileImage} alt="About page profile image" fill sizes="112px" className="object-cover" />
              </div>
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                  {content.heroTitle}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {content.heroSubtitle}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-background border border-border rounded-xl p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{content.intro}</p>
            <p className="text-muted-foreground leading-relaxed">{content.story}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-3">Mission</h3>
              <p className="text-muted-foreground leading-relaxed">{content.mission}</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-3">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">{content.vision}</p>
            </div>
          </section>

          <section className="bg-background border border-border rounded-xl p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-4">Our Core Values</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.values.map((value, idx) => (
                <li key={`${value}-${idx}`} className="px-4 py-3 rounded-lg bg-secondary/40 text-foreground font-medium">
                  {value}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
