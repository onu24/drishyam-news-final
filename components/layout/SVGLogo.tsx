'use client';

import { motion } from 'framer-motion';

export function SVGLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated Focus Rings */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 border-2 border-primary/20 rounded-full"
      />
      
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Outer Lens Frame */}
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2.5" className="text-primary/20" />
        
        {/* Stylized Eye/Lens Shape */}
        <path
          d="M15 50C15 50 30 25 50 25C70 25 85 50 85 50C85 50 70 75 50 75C30 75 15 50 15 50Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Inner Lens / Iris */}
        <motion.circle
          cx="50"
          cy="50"
          r="12"
          fill="currentColor"
          className="text-primary"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Reflection Highlight */}
        <circle cx="45" cy="45" r="3" fill="white" fillOpacity="0.8" />
        
        {/* Scanning Beam Animation */}
        <motion.rect
          x="20"
          y="48"
          width="60"
          height="4"
          rx="2"
          fill="currentColor"
          className="text-red-500/40 blur-[1px]"
          animate={{ y: [25, 75, 25] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Focus Corners */}
        <g className="text-primary/40" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 30V20H30" />
          <path d="M70 20H80V30" />
          <path d="M80 70V80H70" />
          <path d="M30 80H20V70" />
        </g>
      </svg>
      
      {/* Live Indicator Pulse */}
      <div className="absolute top-0 right-0">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2.5 h-2.5 bg-red-600 rounded-full border border-white shadow-sm"
        />
      </div>
    </div>
  );
}
