import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata = {
  title: 'Contact Us — Drishyam News',
  description: 'Get in touch with the Drishyam News editorial and business team.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <Navbar />

      <main className="flex-1 w-full bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

          {/* Page heading */}
          <div className="mb-10 border-b-2 border-foreground/10 pb-6 relative">
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Contact Us
            </h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Have a tip, a correction, or a business inquiry? We'd love to hear from you.
            </p>
            <div className="absolute -bottom-[2px] left-0 w-16 border-b-2 border-primary"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Contact details */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">
                    editorial@drishyamnews.in<br />
                    business@drishyamnews.in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">+91 11 XXXX XXXX</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Office</h3>
                  <p className="text-muted-foreground text-sm">
                    New Delhi, India
                  </p>
                </div>
              </div>
            </div>

            {/* Simple contact form */}
            <form className="space-y-5 bg-background border border-border rounded-lg p-6 shadow-sm">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider mb-1.5">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-secondary placeholder:text-muted-foreground text-foreground px-4 py-2.5 rounded-sm text-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider mb-1.5">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-secondary placeholder:text-muted-foreground text-foreground px-4 py-2.5 rounded-sm text-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Your message…"
                  className="w-full bg-secondary placeholder:text-muted-foreground text-foreground px-4 py-2.5 rounded-sm text-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="button"
                className="w-full bg-foreground text-background font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Send Message
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                Form submissions are not yet active. Please email us directly for now.
              </p>
            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
