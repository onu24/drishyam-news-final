'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { AboutPageContent } from '@/lib/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AboutPageClientProps {
  content: AboutPageContent;
}

export function AboutPageClient({ content }: AboutPageClientProps) {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHindi = language === 'hi';
  const profileImage = content.profileImage || '/placeholder-user.jpg';

  // Content Selection Logic
  const heroTitle = (isHindi && mounted && content.heroTitle_hi) ? content.heroTitle_hi : content.heroTitle;
  const heroSubtitle = (isHindi && mounted && content.heroSubtitle_hi) ? content.heroSubtitle_hi : content.heroSubtitle;
  const intro = (isHindi && mounted && content.intro_hi) ? content.intro_hi : content.intro;
  const story = (isHindi && mounted && content.story_hi) ? content.story_hi : content.story;
  const mission = (isHindi && mounted && content.mission_hi) ? content.mission_hi : content.mission;
  const vision = (isHindi && mounted && content.vision_hi) ? content.vision_hi : content.vision;
  const values = (isHindi && mounted && content.values_hi) ? content.values_hi : content.values;

  return (
    <main className="flex-1 bg-secondary/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-10">
        <section className="border-b border-border pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 border-background shadow-lg bg-secondary/30">
              <Image src={profileImage} alt="About page profile image" fill sizes="112px" className="object-cover" />
            </div>
            <div>
              <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground ${isHindi ? 'font-hindi-serif' : 'font-serif'}`}>
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className={`mt-4 text-lg text-muted-foreground leading-relaxed max-w-3xl ${isHindi ? 'font-hindi' : ''}`}>
                  {heroSubtitle}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-background border border-border rounded-xl p-8 shadow-sm">
          <h2 className={`text-2xl font-bold mb-4 ${isHindi ? 'font-hindi-serif' : 'font-serif'}`}>
            {t('who_we_are')}
          </h2>
          <p className={`text-muted-foreground leading-relaxed mb-4 ${isHindi ? 'font-hindi text-base' : ''}`}>
            {intro}
          </p>
          <p className={`text-muted-foreground leading-relaxed ${isHindi ? 'font-hindi text-base' : ''}`}>
            {story}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
            <h3 className={`text-xl font-bold mb-3 ${isHindi ? 'font-hindi-serif' : 'font-serif'}`}>
              {t('mission')}
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${isHindi ? 'font-hindi text-base' : ''}`}>
              {mission}
            </p>
          </div>
          <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
            <h3 className={`text-xl font-bold mb-3 ${isHindi ? 'font-hindi-serif' : 'font-serif'}`}>
              {t('vision')}
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${isHindi ? 'font-hindi text-base' : ''}`}>
              {vision}
            </p>
          </div>
        </section>

        <section className="bg-background border border-border rounded-xl p-8 shadow-sm">
          <h2 className={`text-2xl font-bold mb-4 ${isHindi ? 'font-hindi-serif' : 'font-serif'}`}>
            {t('core_values')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {values.map((value, idx) => (
              <li key={`${value}-${idx}`} className={`px-4 py-3 rounded-lg bg-secondary/40 text-foreground font-medium ${isHindi ? 'font-hindi text-sm' : ''}`}>
                {value}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
