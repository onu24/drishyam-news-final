import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Service — Drishyam News',
  description: 'Read the terms and conditions for using Drishyam News.',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <main className="flex-1 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-8">
          <section className="border-b border-border pb-6">
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: April 6, 2026</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              These Terms of Service govern your use of Drishyam News website and related services.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using this site, you agree to these terms and applicable laws.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Content Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content is protected by applicable intellectual property laws. You may not reproduce or republish
              content without permission unless explicitly allowed.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to misuse the website, disrupt services, attempt unauthorized access, or use the platform
              for illegal activities.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may include links to third-party services. We are not responsible for third-party content or
              practices.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Disclaimer & Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We provide content on an “as is” basis. While we aim for accuracy, we do not guarantee uninterrupted
              service or complete absence of errors.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may revise these terms from time to time. Continued use of the site after changes implies acceptance
              of the updated terms.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For terms-related queries, contact us at{' '}
              <a href="mailto:editorial@drishyamnews.in" className="text-primary hover:underline">
                editorial@drishyamnews.in
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
