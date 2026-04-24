'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(+(currentProgress / scrollHeight).toFixed(3) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);
    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 bg-transparent z-[100] transition-opacity duration-300 pointer-events-none">
      <div 
        className="h-full bg-primary relative transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
      >
        <div className="absolute right-0 top-0 h-full w-4 bg-primary blur-sm shadow-[0_0_10px_#d41f16]" />
      </div>
    </div>
  );
}
