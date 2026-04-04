'use client';

import { motion } from 'framer-motion';

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Fluid Orb 1 - Top Right - 落日橘 Muted Sunset */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.4) 0%, rgba(212, 165, 116, 0.08) 70%)',
          filter: 'blur(100px)',
          top: '-100px',
          right: '-100px',
        }}
        animate={{
          x: [0, 100, 50, -30, 0],
          y: [0, -50, 50, 30, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
          opacity: [0.5, 0.35, 0.45, 0.4, 0.5],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fluid Orb 2 - Bottom Left - 奶咖色 Warm Taupe */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200, 180, 160, 0.35) 0%, rgba(200, 180, 160, 0.06) 70%)',
          filter: 'blur(100px)',
          bottom: '-50px',
          left: '-100px',
        }}
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.15, 0.9, 1],
          opacity: [0.45, 0.3, 0.5, 0.45],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fluid Orb 3 - Center Left - 香槟金 Champagne */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232, 213, 196, 0.35) 0%, rgba(232, 213, 196, 0.04) 70%)',
          filter: 'blur(100px)',
          top: '40%',
          left: '30%',
        }}
        animate={{
          x: [0, 70, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.25, 0.4],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fluid Orb 4 - Bottom Right - 焦糖琥珀 Amber */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(184, 145, 111, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
          bottom: '20%',
          right: '20%',
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, -30, 60, 0],
          scale: [1, 0.85, 1.1, 1],
          opacity: [0.35, 0.45, 0.3, 0.35],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
