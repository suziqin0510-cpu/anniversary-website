'use client';

import { motion } from 'framer-motion';

export default function AmbientBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient Blob 1 - Top Right - 落日橘 */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(244, 164, 96, 0.35) 0%, rgba(244, 164, 96, 0.05) 70%)',
          filter: 'blur(80px)',
          top: '-100px',
          right: '-100px',
        }}
        animate={{
          x: [0, 60, 30, -20, 0],
          y: [0, -40, 30, 20, 0],
          scale: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.4, 0.3, 0.45, 0.35, 0.4],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ambient Blob 2 - Bottom Left - 玫瑰粉 */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(227, 93, 106, 0.3) 0%, rgba(227, 93, 106, 0.04) 70%)',
          filter: 'blur(80px)',
          bottom: '-50px',
          left: '-100px',
        }}
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.35, 0.25, 0.4, 0.35],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ambient Blob 3 - Center - 嫩粉色 */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 205, 181, 0.35) 0%, rgba(255, 205, 181, 0.04) 70%)',
          filter: 'blur(80px)',
          top: '40%',
          left: '30%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 60, 0],
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ambient Blob 4 - Bottom Right - 暖橘粉 */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 180, 150, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '15%',
          right: '15%',
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, -20, 40, 0],
          scale: [1, 0.85, 1.15, 1],
          opacity: [0.3, 0.4, 0.25, 0.3],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
