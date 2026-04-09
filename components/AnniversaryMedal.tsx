'use client';

import { motion } from 'framer-motion';

export default function AnniversaryMedal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed bottom-24 right-6 z-50"
    >
      <div className="group relative">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border transition-transform hover:scale-110"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            borderColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 0 0 rgba(227, 93, 106, 0.5)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        >
          🏅
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="px-3 py-1.5 rounded-full text-xs font-medium text-white bg-[#7C444F]/90 backdrop-blur-sm shadow-md">
            一周年纪念勋章
          </div>
        </div>
      </div>
    </motion.div>
  );
}
