'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

/* ------------------------------------------------------------------ */
/*  Disabled link component — polished "coming soon" state            */
/* ------------------------------------------------------------------ */
function DisabledLink({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { t } = useLanguage();
  return (
    <span
      className={`cursor-not-allowed opacity-40 select-none ${className}`}
      title={t('coming_soon')}
      aria-disabled="true"
    >
      {children}
    </span>
  );
}

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-zinc-950 text-zinc-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* About */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-white">
              Drishyam <span className="text-primary block text-sm tracking-widest uppercase font-sans mt-1">News &amp; Analysis</span>
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-hindi">
              {t('about_drishyam')}
            </p>
          </div>

          {/* Categories — all resolve via /category/[slug] */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white border-l-2 border-primary pl-3">{t('sections')}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/category/india" className="hover:text-primary transition-colors">{t('india')}</Link>
              <Link href="/category/states" className="hover:text-primary transition-colors">{t('states')}</Link>
              <Link href="/category/politics" className="hover:text-primary transition-colors">{t('politics')}</Link>
              <Link href="/category/economy" className="hover:text-primary transition-colors">{t('economy')}</Link>
              <Link href="/category/technology" className="hover:text-primary transition-colors">{t('technology')}</Link>
              <Link href="/category/sports" className="hover:text-primary transition-colors">{t('sports')}</Link>
              <Link href="/category/entertainment" className="hover:text-primary transition-colors">{t('entertainment')}</Link>
              <Link href="/category/explainers" className="hover:text-primary transition-colors">{t('explainers')}</Link>
            </div>
          </div>

          {/* Company — pages that don't exist yet get disabled state */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white border-l-2 border-primary pl-3">{t('company')}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><DisabledLink className="hover:text-primary transition-colors">{t('about_us')}</DisabledLink></li>
              <li><DisabledLink className="hover:text-primary transition-colors">{t('careers')}</DisabledLink></li>
              <li><DisabledLink className="hover:text-primary transition-colors">{t('advertise')}</DisabledLink></li>
              <li><DisabledLink className="hover:text-primary transition-colors">{t('fact_check')}</DisabledLink></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Connect — social links get disabled state since destinations aren't set */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white border-l-2 border-primary pl-3">{t('connect')}</h4>
            <div className="flex gap-4 mb-6">
              <span className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center cursor-not-allowed opacity-40" title={t('coming_soon')} aria-disabled="true">
                <span className="text-xs font-bold">X</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center cursor-not-allowed opacity-40" title={t('coming_soon')} aria-disabled="true">
                <span className="text-xs font-bold">IG</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center cursor-not-allowed opacity-40" title={t('coming_soon')} aria-disabled="true">
                <span className="text-xs font-bold">YT</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center cursor-not-allowed opacity-40" title={t('coming_soon')} aria-disabled="true">
                <span className="text-xs font-bold">WA</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 tracking-wider">
          <p className="font-semibold uppercase">
             {t('made_for_india')}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <DisabledLink className="transition-colors">{t('privacy')}</DisabledLink>
            <DisabledLink className="transition-colors">{t('terms')}</DisabledLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
