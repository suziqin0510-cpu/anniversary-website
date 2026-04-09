'use client';

import { motion } from 'framer-motion';

export default function AnniversaryMedal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative"
    >
      <div className="group relative">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border transition-transform hover:scale-110"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 0 0 rgba(227, 93, 106, 0.5)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        >
          🏅
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="px-3 py-1.5 rounded-full text-xs font-medium text-white bg-[#7C444F]/90 backdrop-blur-sm shadow-md">
            一周年纪念勋章
          </div>
        </div>
      </div>
    </motion.div>
  );
}
