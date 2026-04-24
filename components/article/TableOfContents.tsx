'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface TableOfContentsProps {
  content: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const { language, t } = useLanguage();
  const [activeId, setActiveId] = useState<string>('');
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    // Extract headers from markdown content
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    const extracted: TOCItem[] = [];

    paragraphs.forEach((p) => {
      if (p.startsWith('#')) {
        const levelMatch = p.match(/^#+/);
        if (levelMatch) {
          const level = levelMatch[0].length;
          const text = p.replace(/^#+\s/, '');
          const id = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
          extracted.push({ id, text, level });
        }
      }
    });

    setItems(extracted);

    // Intersection Observer for scroll behavior
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    extracted.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  if (items.length === 0) return null;

  const scrollToId = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-zinc-50/50 border border-zinc-200/50 rounded-lg p-6 mb-10 overflow-hidden">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
        <span className="w-6 h-[2px] bg-primary" />
        {t('table_of_contents') || (language === 'hi' ? 'लेख का सारांश' : 'Contents')}
      </h3>
      <nav className="space-y-1">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={index}
              href={`#${item.id}`}
              onClick={(e) => scrollToId(e, item.id)}
              className={`block py-1.5 transition-all duration-300 relative ${
                item.level === 1 ? 'font-bold' : 'pl-4'
              } ${isActive ? 'text-primary translate-x-1' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-full transition-all duration-500" />
              )}
              <span className={`text-[13px] ${language === 'hi' ? 'font-hindi' : ''} ${isActive ? 'font-black' : 'font-medium'}`}>
                {item.text}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
