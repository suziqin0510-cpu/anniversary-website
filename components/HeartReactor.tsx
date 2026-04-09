'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const MAX_COUNT = 30;

function getStageInfo(count: number) {
  if (count <= 10) {
    return { text: `收集落花 (${count}/10)`, progress: count / 10, color: '#E35D6A' };
  }
  if (count <= 20) {
    return { text: `捕捉晨光 (${count}/20)`, progress: (count - 10) / 10, color: '#F4A460' };
  }
  return { text: `点亮星辰 (${count}/30)`, progress: Math.min((count - 20) / 10, 1), color: '#FFD700' };
}

function triggerSakura(originX: number, originY: number) {
  const bursts = [
    { x: originX, y: originY, spread: 100 },
    { x: originX - 0.2, y: originY - 0.1, spread: 80 },
    { x: originX + 0.2, y: originY - 0.1, spread: 80 },
  ];
  bursts.forEach((b, i) => {
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: b.spread,
        origin: { x: Math.max(0, Math.min(1, b.x)), y: Math.max(0, Math.min(1, b.y)) },
        colors: ['#ffb7c5'],
        shapes: ['circle'],
        scalar: 1.5,
        gravity: 0.8,
        drift: 0.5,
        ticks: 250,
        disableForReducedMotion: true,
      });
    }, i * 200);
  });
}

function triggerHeartStorm(originX: number, originY: number) {
  const colors = ['#E35D6A', '#F4A460', '#FFD700', '#FF69B4', '#FFFFFF', '#60A5FA'];
  const bursts = 4;
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 360,
        origin: { x: originX, y: originY },
        colors,
        shapes: i % 2 === 0 ? ['circle'] : ['square'],
        scalar: 1.2 + i * 0.2,
        gravity: 0.9,
        drift: 0,
        ticks: 300,
        disableForReducedMotion: true,
      });
    }, i * 150);
  }
}

export default function HeartReactor() {
  const [clickCount, setClickCount] = useState(0);
  const [isUltimate, setIsUltimate] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const stage = getStageInfo(clickCount);
  const RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE * (1 - stage.progress);

  const handleClick = () => {
    if (isUltimate) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.8;

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount === 10) {
      triggerSakura(originX, originY);
    } else if (nextCount === 20) {
      triggerHeartStorm(originX, originY);
    } else if (nextCount >= MAX_COUNT) {
      triggerHeartStorm(originX, originY);
      setTimeout(() => triggerHeartStorm(originX, originY), 300);
      setIsUltimate(true);
      setShowOverlay(true);
      setTimeout(() => setShowText(true), 800);
      setTimeout(() => {
        setShowText(false);
        setTimeout(() => setShowPhoto(true), 600);
      }, 4000);
    }
  };

  const handleReset = () => {
    setIsUltimate(false);
    setShowOverlay(false);
    setShowText(false);
    setShowPhoto(false);
    setClickCount(0);
  };

  return (
    <>
      {/* 终极告白遮罩 */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <AnimatePresence mode="wait">
              {showText && (
                <motion.p
                  key="text"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="text-center text-2xl md:text-4xl font-medium text-white drop-shadow-[0_0_25px_rgba(227,93,106,0.9)] tracking-wide"
                >
                  你是万物之源，是我所有惊喜的终点。
                </motion.p>
              )}
              {!showText && showPhoto && (
                <motion.div
                  key="photo"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="relative max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="/images/9607ee30635b921d2b85d787a80249bd.jpg"
                    alt="专属回忆"
                    className="w-full rounded-2xl shadow-2xl border-4 border-white/20"
                  />
                  <p className="text-center text-white/70 text-sm mt-4">点击任意处关闭</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮球体 */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center">
        {/* 动态提示文案 */}
        <motion.div
          key={stage.text}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-xs font-medium text-white drop-shadow-md px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm"
        >
          {isUltimate ? '已满溢 ✨' : stage.text}
        </motion.div>

        <motion.button
          ref={buttonRef}
          onClick={handleClick}
          disabled={isUltimate}
          whileTap={isUltimate ? undefined : { scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
            isUltimate ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          {/* SVG 环形进度条 */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 88 88">
            <circle
              cx="44"
              cy="44"
              r={RADIUS}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="44"
              cy="44"
              r={RADIUS}
              stroke={stage.color}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
            />
          </svg>

          {/* 玻璃球体 */}
          <motion.div
            animate={
              isUltimate
                ? {
                    boxShadow: [
                      '0 0 20px 4px rgba(227, 93, 106, 0.5)',
                      '0 0 40px 12px rgba(227, 93, 106, 0.7)',
                      '0 0 20px 4px rgba(227, 93, 106, 0.5)',
                    ],
                    scale: [1, 1.05, 1],
                  }
                : {
                    boxShadow: [
                      '0 0 0 0 rgba(227, 93, 106, 0.3)',
                      '0 0 20px 4px rgba(227, 93, 106, 0.2)',
                      '0 0 0 0 rgba(227, 93, 106, 0.3)',
                    ],
                  }
            }
            transition={{ duration: isUltimate ? 1.2 : 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-16 h-16 rounded-full flex items-center justify-center border backdrop-blur-xl transition-colors ${
              isUltimate
                ? 'bg-[#E35D6A]/40 border-[#E35D6A]/70'
                : 'bg-white/30 border-white/60'
            }`}
          >
            <motion.span
              animate={isUltimate ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : { scale: [1, 1.15, 1] }}
              transition={{ duration: isUltimate ? 1 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl select-none"
            >
              {isUltimate ? '💖' : '❤️'}
            </motion.span>
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
