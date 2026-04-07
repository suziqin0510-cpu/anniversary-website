'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CinemaModal({ isOpen, onClose }: CinemaModalProps) {
  // ESC键关闭
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* 关闭按钮 */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all z-10 group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </motion.button>

          {/* 内容容器 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-5xl mx-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 播放器容器 */}
            <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(227,93,106,0.25)]">
              <iframe
                src="https://player.bilibili.com/player.html?bvid=BV1M9SZBKE8m&page=1&high_quality=1&danmaku=0&autoplay=1"
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                style={{ border: 'none' }}
                className="w-full aspect-video bg-black"
              ></iframe>
            </div>

            {/* 情感文案 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-rose-100/80 text-sm md:text-base mt-6 tracking-wider font-light text-center"
            >
              有些记忆会随着时间模糊，但镜头里的我们永远热恋。🎬
            </motion.p>

            {/* 底部提示 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/40 text-xs text-center mt-8"
            >
              按 ESC 或点击背景关闭
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
