import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy — Drishyam News',
  description: 'Read how Drishyam News collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <main className="flex-1 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-8">
          <section className="border-b border-border pb-6">
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: April 6, 2026</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This Privacy Policy explains how Drishyam News collects, uses, and safeguards your information when you
              use our website and services.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may collect information such as your name, email address, cookie-based preferences, device and
              browser details, and usage analytics.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">How We Use Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use data to improve content recommendations, operate the website, communicate updates, maintain
              security, and analyze performance.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Cookies & Preferences</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and local storage to remember settings like language and feed preferences. You can clear
              cookies from your browser at any time.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell personal data. We may share limited data with trusted service providers for hosting,
              analytics, security, and communication support.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may request access, correction, or deletion of your personal information by contacting our team.
            </p>
          </section>

          <section className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy questions, email us at{' '}
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
