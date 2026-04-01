'use client';

import Link from 'next/link';

export function StatesRow() {
  const states = [
    'National', 'Delhi', 'Uttar Pradesh', 'Maharashtra', 'Bihar', 
    'Chhattisgarh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat'
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">
        Choose State:
      </span>
      {states.map((state) => (
        <Link
          key={state}
          href={`/category/states?state=${encodeURIComponent(state)}`}
          className="shrink-0 text-xs font-semibold px-4 py-2 border border-border rounded-full hover:border-primary hover:text-primary transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
        >
          {state}
        </Link>
      ))}
    </div>
  );
}
