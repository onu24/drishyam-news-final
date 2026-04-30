'use client';

import { useEffect, useRef } from 'react';

interface AdContainerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
  client?: string;
}

export function AdContainer({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  client = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-3459415365195090' 
}: AdContainerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);
  
  useEffect(() => {
    if (initialized.current) return;

    const currentAdRef = adRef.current;
    if (!currentAdRef) return;

    const pushAd = () => {
      if (initialized.current) return;
      try {
        initialized.current = true;
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn("AdSense push delayed/failed:", error);
        initialized.current = false;
      }
    };

    // Use ResizeObserver to detect when the ad container actually has dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && !initialized.current) {
          // Give it a tiny bit more time to be safe
          setTimeout(pushAd, 50);
          resizeObserver.disconnect();
        }
      }
    });

    resizeObserver.observe(currentAdRef);

    return () => {
      resizeObserver.disconnect();
    };
  }, [slot]);

  return (
    <div className={`w-full flex items-center justify-center my-6 text-center ${className}`}>
      <div className="w-full relative bg-secondary/20 border border-border/40 p-1 md:p-2 rounded-sm overflow-hidden flex flex-col items-center justify-center min-h-[100px]">
        <span className="absolute top-0 right-1 text-[8px] sm:text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Advertisement
        </span>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minWidth: '250px' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}
