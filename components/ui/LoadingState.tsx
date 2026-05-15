'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingState({ message = 'Loading latest updates...', fullPage = true }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'min-h-[70vh] w-full' : 'p-12 w-full'} bg-background`}>
      <div className="relative flex items-center justify-center">
        {/* Animated Background Pulse */}
        <div className="absolute h-24 w-24 rounded-full bg-primary/10 animate-ping" />
        <div className="absolute h-16 w-16 rounded-full bg-primary/20 animate-pulse" />
        
        {/* Rotating Spinner */}
        <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
      </div>
      
      {/* Branding */}
      <div className="mt-8 text-center space-y-2">
        <h2 className="text-xl font-serif font-black tracking-tighter text-foreground uppercase">
          Drishyam <span className="text-primary">News</span>
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}

export function SkeletonArticleCard() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-[16/9] w-full bg-secondary/50 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3 w-24 bg-secondary rounded" />
        <div className="h-6 w-full bg-secondary rounded" />
        <div className="h-6 w-3/4 bg-secondary rounded" />
      </div>
    </div>
  );
}

export function SkeletonArticleDetail() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse pt-12">
      <div className="space-y-4">
        <div className="h-4 w-32 bg-secondary rounded" />
        <div className="h-12 w-full bg-secondary rounded" />
        <div className="h-12 w-2/3 bg-secondary rounded" />
      </div>
      <div className="flex items-center gap-4 py-6 border-y border-border">
        <div className="h-10 w-10 rounded-full bg-secondary" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-secondary" />
          <div className="h-3 w-16 bg-secondary" />
        </div>
      </div>
      <div className="aspect-video w-full bg-secondary rounded-2xl" />
      <div className="space-y-4 pt-8">
        <div className="h-4 w-full bg-secondary" />
        <div className="h-4 w-full bg-secondary" />
        <div className="h-4 w-3/4 bg-secondary" />
        <div className="h-4 w-full bg-secondary" />
      </div>
    </div>
  );
}

export function SkeletonStoryCard() {
  return (
    <div className="relative aspect-[9/16] w-full bg-secondary/50 rounded-2xl overflow-hidden animate-pulse">
      <div className="absolute inset-x-0 bottom-0 p-6 space-y-3">
        <div className="h-3 w-16 bg-secondary rounded" />
        <div className="h-5 w-full bg-secondary rounded" />
        <div className="h-5 w-2/3 bg-secondary rounded" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-20 w-32 bg-secondary rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-secondary rounded" />
            <div className="h-4 w-3/4 bg-secondary rounded" />
            <div className="h-3 w-24 bg-secondary rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
