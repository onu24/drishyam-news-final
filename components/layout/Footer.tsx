'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Footer() {
  const { language, t } = useLanguage();

  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'India', slug: 'india' },
    { name: 'Politics', slug: 'politics' },
    { name: 'Economy', slug: 'economy' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Entertainment', slug: 'entertainment' },
    { name: 'Jobs', slug: 'jobs' },
    { name: 'Exams', slug: 'exams' },
  ];

  const network = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Editorial Ethics', href: '/ethics' },
  ];

  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t-8 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-black tracking-tighter">
              DRISHYAM<span className="text-primary italic">NEWS</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-serif italic border-l-2 border-primary/40 pl-4 py-1">
              Independent journalism for a modern India. Delivering facts, deep analysis, and breaking stories with integrity and precision.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <span className="text-xs">𝕏</span>
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <span className="text-xs">f</span>
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <span className="text-xs">ig</span>
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">
              Categories
            </h3>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="text-zinc-400 hover:text-white transition-all text-sm font-bold uppercase tracking-wider"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Drishyam Network */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">
              Drishyam Network
            </h3>
            <ul className="space-y-4">
              {network.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-zinc-400 hover:text-white transition-all text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">
              Daily Briefing
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed uppercase tracking-widest font-bold">
              The only newsletter you'll ever need to stay informed.
            </p>
            <div className="flex flex-col gap-3">
               <input 
                 type="email" 
                 placeholder="Your email address" 
                 className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm"
               />
               <button className="w-full bg-primary py-3 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                  Subscribe for Free
               </button>
            </div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">
               By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">
            © {currentYear} Drishyam News Network. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">
             <span>Made in India</span>
             <span className="w-1 h-1 bg-zinc-800 rounded-full" />
             <Link href="/rss" className="hover:text-primary transition-colors">RSS Feed</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
