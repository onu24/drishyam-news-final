'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Share2, Volume2, VolumeX } from 'lucide-react';
import { VisualStory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StoryViewerProps {
  story: VisualStory;
}

export function StoryViewer({ story }: StoryViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const SLIDE_DURATION = 5000; // 5 seconds per slide

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Loop back or close? For now, stay on last
      setProgress(100);
    }
  }, [currentSlideIndex, story.slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.slides[currentSlideIndex].caption,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const currentSlide = story.slides[currentSlideIndex];
  const hasVideo = !!currentSlide.video;
  const backgroundImage = currentSlide.image || story.coverImage;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden touch-none select-none">
      {/* Background Image (blurred) */}
      <div className="absolute inset-0 opacity-40 blur-2xl scale-110">
         <Image 
          src={backgroundImage} 
          alt="" 
          fill 
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content Container */}
      <div className="relative w-full max-w-[500px] h-full sm:h-[90vh] sm:rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl flex flex-col">
        
        {/* Top Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4 flex gap-1.5 bg-gradient-to-b from-black/60 to-transparent">
          {story.slides.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full bg-white transition-all duration-100 ease-linear",
                  idx < currentSlideIndex ? "w-full" : idx === currentSlideIndex ? "" : "w-0"
                )}
                style={{ width: idx === currentSlideIndex ? `${progress}%` : undefined }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Actions */}
        <div className="absolute top-8 left-0 right-0 z-50 px-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">DN</span>
            </div>
            <span className="text-white text-xs font-bold drop-shadow-md">{story.category}</span>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => setIsMuted(!isMuted)}
              disabled={!hasVideo}
              className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button onClick={handleShare} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
              <Share2 size={18} />
            </button>
            <Link href="/visual-stories" className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
              <X size={18} />
            </Link>
          </div>
        </div>

        {/* Navigation Areas (Invisible overlay) */}
        <div className="absolute inset-x-0 inset-y-20 z-40 flex">
          <div 
            className="flex-1 cursor-pointer active:bg-white/5 transition-colors" 
            onClick={prevSlide}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />
          <div 
            className="flex-1 cursor-pointer active:bg-white/5 transition-colors" 
            onClick={nextSlide}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />
        </div>

        {/* Main Media */}
        <div className="relative flex-1">
          {hasVideo ? (
            <video
              key={currentSlide.id}
              src={currentSlide.video}
              poster={backgroundImage}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              playsInline
              muted={isMuted}
              preload="metadata"
            />
          ) : (
            <Image 
              src={backgroundImage} 
              alt={currentSlide.title} 
              fill 
              className="object-cover"
              priority
            />
          )}
          {/* Bottom Gradient for Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        {/* Caption Layer */}
        <div className="absolute bottom-0 left-0 right-0 z-50 p-6 pt-20">
          <div className="space-y-3">
            <h2 className="text-white text-2xl sm:text-3xl font-bold font-serif leading-tight drop-shadow-lg">
              {currentSlide.title}
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-3 drop-shadow">
              {currentSlide.caption}
            </p>
          </div>
          
          {/* Slide Indicator Text */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
             <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
               Slide {currentSlideIndex + 1} of {story.slides.length}
             </div>
             <Link href="/" className="text-[10px] text-white/70 hover:text-white uppercase tracking-widest font-bold transition-colors">
               Read Full Story
             </Link>
          </div>
        </div>

      </div>

      {/* Desktop Navigation Hints */}
      <button 
        onClick={prevSlide}
        disabled={currentSlideIndex === 0}
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 items-center justify-center rounded-full text-white transition-all disabled:opacity-20"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        disabled={currentSlideIndex === story.slides.length - 1}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 items-center justify-center rounded-full text-white transition-all disabled:opacity-20"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
