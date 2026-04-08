import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BriefcaseBusiness, HeartHandshake, Sparkles, Users } from 'lucide-react';

export const metadata = {
  title: 'Careers — Drishyam News',
  description: 'Join Drishyam News and build the future of independent journalism.',
};

const openings = [
  {
    title: 'Senior Political Reporter',
    location: 'New Delhi, India',
    type: 'Full-time',
  },
  {
    title: 'Video Producer (Digital News)',
    location: 'Noida, India',
    type: 'Full-time',
  },
  {
    title: 'Audience Growth Editor',
    location: 'Remote / Hybrid',
    type: 'Full-time',
  },
  {
    title: 'Copy Editor (English + Hindi)',
    location: 'New Delhi, India',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <main className="flex-1 bg-secondary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-10">
          <section className="border-b border-border pb-8">
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Careers at Drishyam News
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-3xl">
              We are building a newsroom for courageous, public-interest journalism. If you care about truth, impact,
              and storytelling, we would love to meet you.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
              <Users className="h-6 w-6 text-primary mb-3" />
              <h2 className="font-serif text-xl font-bold mb-2">People First</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We support a collaborative newsroom culture with learning, mentorship, and ownership.
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
              <Sparkles className="h-6 w-6 text-primary mb-3" />
              <h2 className="font-serif text-xl font-bold mb-2">High Standards</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We value accuracy, fairness, speed, and editorial integrity in every story we publish.
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
              <HeartHandshake className="h-6 w-6 text-primary mb-3" />
              <h2 className="font-serif text-xl font-bold mb-2">Real Impact</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your work will inform citizens, shape conversations, and hold power to account.
              </p>
            </div>
          </section>

          <section className="bg-background border border-border rounded-xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-2xl font-bold">Current Openings</h2>
            </div>

            <div className="space-y-4">
              {openings.map((opening) => (
                <div
                  key={opening.title}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-border rounded-lg p-4"
                >
                  <div>
                    <h3 className="font-bold text-foreground">{opening.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {opening.location} • {opening.type}
                    </p>
                  </div>
                  <a
                    href="mailto:careers@drishyamnews.in?subject=Application%20for%20Drishyam%20News"
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-sm hover:bg-black transition-colors"
                  >
                    Apply
                  </a>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Do not see a matching role? Send your resume and portfolio to{' '}
              <a href="mailto:careers@drishyamnews.in" className="text-primary hover:underline font-semibold">
                careers@drishyamnews.in
              </a>{' '}
              and tell us how you can contribute.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
