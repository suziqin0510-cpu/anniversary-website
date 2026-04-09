'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ChapterToast } from '@/lib/hooks/useGrandChapterCelebration';

export default function GrandChapterToast({ toast }: { toast: ChapterToast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_rgba(227,93,106,0.35)] rounded-3xl px-10 py-8 text-center">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
              className="text-5xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#E35D6A] drop-shadow-sm mb-2">
              {toast.title}
            </h2>
            <p className="text-sm md:text-base text-[#7C444F] font-medium">
              {toast.subtitle}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
