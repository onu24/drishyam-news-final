'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactPageContent } from '@/lib/types';
import { useEffect, useState } from 'react';

interface ContactPageClientProps {
  content: ContactPageContent;
}

export function ContactPageClient({ content }: ContactPageClientProps) {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHindi = language === 'hi';

  // Content Selection Logic
  const heroTitle = (isHindi && mounted && content.heroTitle_hi) ? content.heroTitle_hi : content.heroTitle;
  const heroSubtitle = (isHindi && mounted && content.heroSubtitle_hi) ? content.heroSubtitle_hi : content.heroSubtitle;
  const address = (isHindi && mounted && content.address_hi) ? content.address_hi : content.address;
  const extraInfo = (isHindi && mounted && content.extraInfo_hi) ? content.extraInfo_hi : content.extraInfo;

  // Split multi-line fields into individual lines
  const emailLines = content.email.split('\n').map((l) => l.trim()).filter(Boolean);

  return (
    <main className="flex-1 w-full bg-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        {/* Page heading */}
        <div className="mb-10 border-b-2 border-foreground/10 pb-6 relative">
          <h1 className={`text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight ${isHindi ? 'font-hindi-serif' : 'font-serif'}`}>
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className={`mt-3 text-lg text-muted-foreground leading-relaxed max-w-2xl ${isHindi ? 'font-hindi' : ''}`}>
              {heroSubtitle}
            </p>
          )}
          <div className="absolute -bottom-[2px] left-0 w-16 border-b-2 border-primary"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact details */}
          <div className="space-y-8">

            {/* Email */}
            {emailLines.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${isHindi ? 'font-hindi-label' : ''}`}>
                    {t('email')}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {emailLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < emailLines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}

            {/* Phone */}
            {content.phone && (
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${isHindi ? 'font-hindi-label' : ''}`}>
                    {t('phone')}
                  </h3>
                  <p className="text-muted-foreground text-sm">{content.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {address && (
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${isHindi ? 'font-hindi-label' : ''}`}>
                    {t('office')}
                  </h3>
                  <p className={`text-muted-foreground text-sm whitespace-pre-line ${isHindi ? 'font-hindi' : ''}`}>
                    {address}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contact form */}
          <form className="space-y-5 bg-background border border-border rounded-lg p-6 shadow-sm">
            <div>
              <label htmlFor="contact-name" className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isHindi ? 'font-hindi-label' : ''}`}>
                {t('name')}
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder={t('name_placeholder')}
                className={`w-full bg-secondary placeholder:text-muted-foreground text-foreground px-4 py-2.5 rounded-sm text-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all ${isHindi ? 'font-hindi' : ''}`}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isHindi ? 'font-hindi-label' : ''}`}>
                {t('email')}
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                className={`w-full bg-secondary placeholder:text-muted-foreground text-foreground px-4 py-2.5 rounded-sm text-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all ${isHindi ? 'font-hindi' : ''}`}
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isHindi ? 'font-hindi-label' : ''}`}>
                {t('subject')}
              </label>
              <input
                id="contact-subject"
                type="text"
                placeholder={t('subject_placeholder')}
                className={`w-full bg-secondary placeholder:text-muted-foreground text-foreground px-4 py-2.5 rounded-sm text-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all ${isHindi ? 'font-hindi' : ''}`}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isHindi ? 'font-hindi-label' : ''}`}>
                {t('message')}
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder={t('message_placeholder')}
                className={`w-full bg-secondary placeholder:text-muted-foreground text-foreground px-4 py-2.5 rounded-sm text-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none ${isHindi ? 'font-hindi' : ''}`}
              />
            </div>

            <button
              type="button"
              className={`w-full bg-foreground text-background font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-sm hover:-translate-y-0.5 hover:shadow-lg transition-all ${isHindi ? 'font-hindi-serif text-sm py-2' : ''}`}
            >
              {t('send_message')}
            </button>

            {content.extraInfo ? (
              <p className={`text-[11px] text-muted-foreground text-center whitespace-pre-line ${isHindi ? 'font-hindi text-xs' : ''}`}>
                {content.extraInfo}
              </p>
            ) : (
              <p className={`text-[11px] text-muted-foreground text-center ${isHindi ? 'font-hindi text-xs' : ''}`}>
                {isHindi ? 'फॉर्म सबमिशन अभी सक्रिय नहीं हैं। कृपया अभी हमें सीधे ईमेल करें।' : 'Form submissions are not yet active. Please email us directly for now.'}
              </p>
            )}
          </form>

        </div>
      </div>
    </main>
  );
}
