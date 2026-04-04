'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiItem {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export default function JiumiRain() {
  const [clickCount, setClickCount] = useState(0);
  const [isRaining, setIsRaining] = useState(false);
  const [emojis, setEmojis] = useState<EmojiItem[]>([]);
  const [showHint, setShowHint] = useState(true);

  const emojisList = ['🐶', '🐱', '💖', '🐕', '🐈', '💕', '❤️', '😻', '🐾'];

  const startRain = useCallback(() => {
    if (isRaining) return;

    setIsRaining(true);
    setClickCount(0);
    setShowHint(false);

    const newEmojis: EmojiItem[] = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojisList[Math.floor(Math.random() * emojisList.length)],
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      size: 20 + Math.random() * 20,
    }));

    setEmojis(newEmojis);

    setTimeout(() => {
      setIsRaining(false);
      setEmojis([]);
      setShowHint(true);
    }, 6000);
  }, [isRaining]);

  const handleBubbleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      startRain();
    }
  };

  return (
    <>
      {/* 啾米雨特效 */}
      <AnimatePresence>
        {isRaining && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
          >
            {emojis.map((item) => (
              <motion.div
                key={item.id}
                initial={{ y: -50, x: `${item.x}vw`, opacity: 1, rotate: 0 }}
                animate={{
                  y: '110vh',
                  rotate: 360,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  ease: 'linear',
                }}
                className="absolute text-2xl"
                style={{ fontSize: item.size, left: 0 }}
              >
                {item.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮气泡提示 */}
      <AnimatePresence>
        {showHint && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={handleBubbleClick}
            className="fixed bottom-8 right-8 z-50 group"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 0 0 rgba(227, 93, 106, 0.3)',
                  '0 0 25px 8px rgba(227, 93, 106, 0.2)',
                  '0 0 0 0 rgba(227, 93, 106, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative bg-white/60 backdrop-blur-xl rounded-full px-5 py-3 border border-white/70 shadow-xl"
            >
              {/* 点击进度指示器 */}
              <div className="absolute -top-1 -left-1 flex space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < clickCount ? 'bg-red-500 scale-110' : 'bg-rose-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl"
                >
                  ❤️
                </motion.span>
                <span className="text-sm font-medium text-rose-600">
                  点我 5 次，有惊喜降落 ✨
                </span>
              </div>

              {/* 点击反馈效果 */}
              {clickCount > 0 && clickCount < 5 && (
                <motion.div
                  key={clickCount}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full bg-rose-400/30"
                />
              )}
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
