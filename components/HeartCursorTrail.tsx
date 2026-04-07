'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export default function HeartCursorTrail() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [sparkleId, setSparkleId] = useState(0);

  const createSparkle = useCallback((x: number, y: number) => {
    const newSparkle: Sparkle = {
      id: sparkleId,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    };
    setSparkles((prev) => [...prev, newSparkle]);
    setSparkleId((prev) => prev + 1);

    // 瞬间消失
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 400);
  }, [sparkleId]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let throttle = false;

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      );

      // 距离超过15px且不在节流状态时才生成光点
      if (distance > 15 && !throttle) {
        createSparkle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;

        throttle = true;
        setTimeout(() => {
          throttle = false;
        }, 30);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createSparkle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{
              opacity: sparkle.opacity,
              scale: 1,
            }}
            animate={{
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
            className="absolute rounded-full"
            style={{
              left: sparkle.x - sparkle.size / 2,
              top: sparkle.y - sparkle.size / 2,
              width: sparkle.size,
              height: sparkle.size,
              background: 'radial-gradient(circle, rgba(255,215,140,0.9) 0%, rgba(255,180,100,0.4) 50%, transparent 100%)',
              boxShadow: '0 0 6px rgba(255,200,120,0.6)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
