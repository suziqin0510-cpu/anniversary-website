'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
}

interface HeartBurstProps {
  trigger: boolean;
  originX: number;
  originY: number;
  onComplete?: () => void;
}

export default function HeartBurst({ trigger, originX, originY, onComplete }: HeartBurstProps) {
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  const generateParticles = useCallback(() => {
    const newParticles: HeartParticle[] = [];
    const count = 30; // 爱心粒子数量

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 100 + Math.random() * 150;
      newParticles.push({
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0.5 + Math.random() * 0.8,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.3,
      });
    }

    setParticles(newParticles);

    // 2秒后清除粒子
    setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 2000);
  }, [onComplete]);

  // 当 trigger 为 true 时触发
  if (trigger && particles.length === 0) {
    generateParticles();
  }

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: originX,
            y: originY,
            scale: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: originX + particle.x,
            y: originY + particle.y,
            scale: particle.scale,
            opacity: 0,
            rotate: particle.rotation,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.5,
            delay: particle.delay,
            ease: 'easeOut',
          }}
          className="fixed pointer-events-none z-[9999]"
          style={{ left: 0, top: 0 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(227, 93, 106, 0.4))' }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#E35D6A"
              fillOpacity={0.8}
            />
          </svg>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
