'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface OrganicRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function OrganicReveal({ children, className = '', delay = 0 }: OrganicRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'polygon(48% 48%, 52% 48%, 52% 52%, 48% 52%)', opacity: 0.8 }}
      animate={
        isInView
          ? { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', opacity: 1 }
          : { clipPath: 'polygon(48% 48%, 52% 48%, 52% 52%, 48% 52%)', opacity: 0.8 }
      }
      transition={{
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
