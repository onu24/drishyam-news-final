'use client';

import { motion } from 'framer-motion';

/**
 * Premium Animated Bell Icon
 */
export function AnimatedBell({ className = "w-5 h-5", active = false }: { className?: string, active?: boolean }) {
  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={active ? {
          rotate: [0, -15, 15, -10, 10, -5, 5, 0],
        } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full h-full"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <motion.path 
          d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
          animate={active ? { x: [-1, 1, -1, 0] } : {}}
          transition={{ duration: 0.3, repeat: 2 }}
        />
      </motion.svg>
      {/* Sound Waves when active */}
      {active && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.5, 0], scale: [1, 2, 2.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
        </>
      )}
    </div>
  );
}

/**
 * Premium Animated Search Icon
 */
export function AnimatedSearch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <motion.div 
      whileHover="hover"
      className={`relative ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <motion.circle 
          cx="11" cy="11" r="8"
          variants={{
            hover: { scale: 1.1, strokeWidth: 3 }
          }}
        />
        <motion.line 
          x1="21" y1="21" x2="16.65" y2="16.65"
          variants={{
            hover: { x: 2, y: 2 }
          }}
        />
        {/* Reflection shimmer in the lens */}
        <motion.path
          d="M8 8C8 8 9 7 11 7"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.5"
          animate={{ opacity: [0.2, 0.8, 0.2], x: [-1, 1, -1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

/**
 * Premium Animated Bolt Icon (for Breaking News)
 */
export function AnimatedBolt({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full text-white"
        animate={{
          filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 8px #fff)", "drop-shadow(0 0 0px #fff)"],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
      </motion.svg>
    </div>
  );
}

/**
 * Premium Animated Rocket Arrow (for BackToTop)
 */
export function AnimatedRocketArrow({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
        animate={{ y: [2, -2, 2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
        {/* Thrust flames/lines */}
        <motion.line 
          x1="10" y1="21" x2="10" y2="23" 
          animate={{ opacity: [0, 1, 0], y: [0, 4] }} 
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.line 
          x1="12" y1="22" x2="12" y2="25" 
          animate={{ opacity: [0, 1, 0], y: [0, 6] }} 
          transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
        />
        <motion.line 
          x1="14" y1="21" x2="14" y2="23" 
          animate={{ opacity: [0, 1, 0], y: [0, 4] }} 
          transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
        />
      </motion.svg>
    </div>
  );
}

/**
 * Premium Animated Live/Broadcast Icon
 */
export function AnimatedLive({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
        {/* Radar Waves */}
        <motion.circle
          cx="12" cy="12" r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          animate={{ opacity: [0, 0.6, 0], scale: [1, 2.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle
          cx="12" cy="12" r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          animate={{ opacity: [0, 0.4, 0], scale: [1, 3.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
        />
        {/* Core Point */}
        <motion.circle 
          cx="12" cy="12" r="4" 
          className="fill-primary" 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
