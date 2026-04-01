'use client';

import Link from 'next/link';
import Image from 'next/image';

const MOCK_EXPLAINERS = [
  {
    id: 'exp1',
    title: 'What the new Data Protection Bill means for your privacy',
    topic: 'Tech Policy',
    tag: 'Explainer',
    slug: 'data-protection-bill-explainer',
    image: null
  },
  {
    id: 'exp2',
    title: 'Decoding the Interim Budget 2026: Key Takeaways',
    topic: 'Budget 2026',
    tag: 'Explainer',
    slug: 'interim-budget-2026-explained',
    image: null
  },
  {
    id: 'exp3',
    title: 'Understanding the changes in NEET PG 2026 Exam Pattern',
    topic: 'Education',
    tag: 'Explainer',
    slug: 'neet-pg-2026-changes',
    image: null
  }
];

export function ExplainerGrid() {
  return (
    <section className="bg-secondary/20 border-b border-border py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-foreground/10 relative">
          <h2 className="font-bold text-2xl tracking-tight text-foreground flex items-center">
            Samjho / Explained
          </h2>
          <Link
            href="/category/explainers"
            className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
          >
            All Explainers →
          </Link>
          <div className="absolute -bottom-[2px] left-0 w-12 border-b-2 border-primary"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_EXPLAINERS.map((item) => (
            <Link key={item.id} href={`/article/${item.slug}`} className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-muted relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                 <div className="absolute bottom-3 left-3 z-20">
                   <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                     {item.tag}
                   </span>
                 </div>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  {item.topic}
                </span>
                <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
