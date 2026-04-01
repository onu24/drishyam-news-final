'use client';

import { PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const MOCK_VIDEOS = [
  { id: 'v1', title: 'Why is the stock market rallying before elections?', duration: '5:42', category: 'Economy', slug: 'stock-market-rally' },
  { id: 'v2', title: 'Full Interview: PM on future of tech in India', duration: '45:10', category: 'Politics', slug: 'pm-interview-tech' },
  { id: 'v3', title: 'Ground Report: Drought strikes Maharashtra villages', duration: '12:05', category: 'India', slug: 'maharashtra-drought-report' },
  { id: 'v4', title: 'Startups: The funding winter is finally ending', duration: '8:30', category: 'Tech', slug: 'funding-winter-ends' },
  { id: 'v5', title: 'Highlights: India vs Australia 3rd Test', duration: '14:20', category: 'Sports', slug: 'ind-vs-aus-highlights' },
];

export function VideoCarousel() {
  return (
    <section className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-white/20 relative">
          <h2 className="font-bold text-2xl tracking-tight flex items-center">
            <PlayCircle className="mr-2 h-6 w-6 text-primary" />
            Videos
          </h2>
          <Link
            href="/category/videos"
            className="text-xs font-bold text-primary hover:text-white uppercase tracking-widest transition-colors"
          >
            All Videos →
          </Link>
          <div className="absolute -bottom-[2px] left-0 w-12 border-b-2 border-primary"></div>
        </div>

        {/* Native Horizontal Scroll Container */}
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {MOCK_VIDEOS.map((video) => (
            <Link 
              key={video.id} 
              href={`/article/${video.slug}`}
              className="group shrink-0 w-[280px] sm:w-[320px] snap-center sm:snap-start block"
            >
              <div className="relative aspect-video bg-zinc-800 rounded-sm overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity z-20">
                  <PlayCircle className="text-white h-12 w-12 drop-shadow-lg" />
                </div>
                {/* Simulated Thumbnail */}
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 group-hover:scale-105 transition-transform duration-500"></div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-20 shadow-sm">
                  {video.duration}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                  {video.category}
                </span>
                <h3 className="font-serif text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
