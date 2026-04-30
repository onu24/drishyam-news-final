'use client';

/**
 * Premium SVG Background Patterns
 * Used to give the site a textured, high-end feel.
 */
export function SubtleGridPattern() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}

export function DecorativeWaves() {
  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-[-1] opacity-10">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-[calc(100%+1.3px)] h-[150px] rotate-180"
        fill="currentColor"
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
      </svg>
    </div>
  );
}
