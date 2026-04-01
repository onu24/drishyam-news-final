'use client';

import Link from 'next/link';

const MOCK_OPINIONS = [
  {
    id: 'op1',
    author: 'Rajesh Kumar',
    title: 'The rural economy needs a structural overhaul, not just subsidies.',
    slug: 'rural-economy-overhaul'
  },
  {
    id: 'op2',
    author: 'Dr. Neeta Singh',
    title: 'Why AI regulation in India must balance innovation with ethics.',
    slug: 'ai-regulation-india'
  },
  {
    id: 'op3',
    author: 'Vikram Sethi',
    title: 'A golden age for Indian sports is finally dawning.',
    slug: 'indian-sports-golden-age'
  },
  {
    id: 'op4',
    author: 'Priya Verma',
    title: 'The shifting dynamics of coalition politics ahead of 2029.',
    slug: 'coalition-politics-2029'
  }
];

export function OpinionRow() {
  return (
    <section className="bg-background border-b border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-bold text-lg uppercase tracking-wider text-foreground mb-6 flex items-center">
          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
          Opinion & Editorial
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_OPINIONS.map((opinion) => (
            <Link key={opinion.id} href={`/article/${opinion.slug}`} className="group block">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary shrink-0 overflow-hidden border border-border">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                    {opinion.author.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-serif text-[15px] font-bold leading-snug group-hover:text-primary transition-colors line-clamp-3">
                    {opinion.title}
                  </h4>
                  <p className="text-xs font-semibold text-muted-foreground mt-2 uppercase tracking-wide">
                    {opinion.author}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
