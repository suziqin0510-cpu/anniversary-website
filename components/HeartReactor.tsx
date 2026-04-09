'use client';

import { useRef, useState } from 'react';
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

function triggerScreenShake() {
  if (typeof document === 'undefined') return;
  const body = document.body;
  body.style.transition = 'transform 0.05s';
  const shakes = [
    'translate(2px, 2px)',
    'translate(-2px, -2px)',
    'translate(2px, -2px)',
    'translate(-2px, 2px)',
    'translate(1px, 1px)',
    'translate(0, 0)',
  ];
  let i = 0;
  const interval = setInterval(() => {
    body.style.transform = shakes[i] || 'translate(0, 0)';
    i++;
    if (i >= shakes.length) {
      clearInterval(interval);
      body.style.transition = '';
      body.style.transform = '';
    }
  }, 60);
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
  triggerScreenShake();

  // 径向涟漪
  const rippleContainer = document.createElement('div');
  rippleContainer.className = 'fixed inset-0 pointer-events-none z-[150]';
  document.body.appendChild(rippleContainer);

  const originLeft = originX * 100;
  const originTop = originY * 100;

  [0, 1, 2].forEach((i) => {
    const ripple = document.createElement('div');
    ripple.className = 'absolute rounded-full border-2 border-[#E35D6A]/40';
    ripple.style.left = `${originLeft}%`;
    ripple.style.top = `${originTop}%`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.opacity = '0.6';
    rippleContainer.appendChild(ripple);

    setTimeout(() => {
      const anim = ripple.animate(
        [
          { width: '0px', height: '0px', opacity: 0.6, borderWidth: '4px' },
          { width: '600px', height: '600px', opacity: 0, borderWidth: '0px' },
        ],
        { duration: 1200, easing: 'ease-out' }
      );
      anim.onfinish = () => ripple.remove();
    }, i * 200);
  });

  setTimeout(() => rippleContainer.remove(), 2000);

  // 高密度 confetti（混合爱心、星星、发光碎片）
  const colors = ['#E35D6A', '#F4A460', '#FFD700', '#FF69B4', '#FFFFFF', '#60A5FA', '#FFB7C5'];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 360,
        origin: { x: originX, y: originY },
        colors,
        shapes: i % 3 === 0 ? ['square'] : i % 3 === 1 ? ['circle'] : undefined,
        scalar: 1.4 + i * 0.15,
        gravity: 0.8,
        drift: 0,
        ticks: 400,
        startVelocity: 55,
        disableForReducedMotion: true,
      });
    }, i * 120);
  }
}

function triggerUltimate(originX: number, originY: number, onStart: () => void, onText: () => void, onPhoto: () => void) {
  // 0.5s 全屏白光闪烁
  const flash = document.createElement('div');
  flash.className = 'fixed inset-0 bg-white z-[300] pointer-events-none';
  document.body.appendChild(flash);

  flash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: 'ease-out' }).onfinish = () => {
    flash.remove();
    onStart();
    onText();
    setTimeout(() => {
      onPhoto();
    }, 3000);
  };

  // 伴随终极 confetti
  const colors = ['#E35D6A', '#FFD700', '#FFFFFF', '#FF69B4', '#F4A460'];
  [0, 300, 600, 900].forEach((delay) => {
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 360,
        origin: { x: originX, y: originY },
        colors,
        scalar: 2,
        gravity: 0.7,
        ticks: 500,
        startVelocity: 70,
        disableForReducedMotion: true,
      });
    }, delay);
  });
}

export default function HeartReactor() {
  const [clickCount, setClickCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUltimate, setIsUltimate] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const stage = getStageInfo(clickCount);
  const RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE * (1 - stage.progress);

  const releaseLock = (ms: number) => {
    setTimeout(() => setIsAnimating(false), ms);
  };

  const handleClick = () => {
    if (isUltimate || isAnimating) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.8;

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount === 10) {
      setIsAnimating(true);
      triggerSakura(originX, originY);
      releaseLock(3500); // 动画 2.5s + 缓冲 1s
    } else if (nextCount === 20) {
      setIsAnimating(true);
      triggerHeartStorm(originX, originY);
      releaseLock(4000); // 震动+涟漪+confetti 约 2.5s + 缓冲 1.5s
    } else if (nextCount >= MAX_COUNT) {
      setIsAnimating(true);
      setIsUltimate(true);
      triggerUltimate(
        originX,
        originY,
        () => setShowOverlay(true),
        () => setShowText(true),
        () => {
          setShowText(false);
          setTimeout(() => setShowPhoto(true), 400);
        }
      );
      // 终极状态不会自动释放 lock，必须由关闭按钮释放
    }
  };

  const handleReset = () => {
    setIsUltimate(false);
    setIsAnimating(false);
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
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {showText && (
                <motion.p
                  key="text"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    textShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(255,0,0,0.6), 0 0 60px rgba(255,0,0,0.4)',
                  }}
                  className="text-center text-3xl md:text-4xl font-bold text-white tracking-wide px-4"
                >
                  你是万物之源，是我所有惊喜的终点。
                </motion.p>
              )}
              {!showText && showPhoto && (
                <motion.div
                  key="photo"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="relative flex flex-col items-center max-w-md w-full z-[110]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white p-2 pb-6 rounded-xl shadow-2xl rotate-1">
                    <img
                      src="/images/9607ee30635b921d2b85d787a80249bd.jpg"
                      alt="专属回忆"
                      className="w-full rounded-lg"
                    />
                    <p className="text-center text-gray-500 text-xs mt-3 font-handwriting">
                      我们的专属回忆
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="mt-8 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-colors"
                  >
                    返回继续冒险
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮球体 */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-center">
        {/* 动态提示文案 */}
        <motion.div
          key={stage.text}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-xs font-medium text-white drop-shadow-md px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm whitespace-nowrap"
        >
          {isUltimate ? '已满溢 ✨' : stage.text}
        </motion.div>

        <motion.button
          ref={buttonRef}
          onClick={handleClick}
          disabled={isUltimate || isAnimating}
          whileTap={isUltimate || isAnimating ? undefined : { scale: 0.82 }}
          transition={{ type: 'spring', stiffness: 500, damping: 17 }}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
            isUltimate || isAnimating ? 'cursor-default' : 'cursor-pointer'
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
                      '0 0 45px 14px rgba(227, 93, 106, 0.8)',
                      '0 0 20px 4px rgba(227, 93, 106, 0.5)',
                    ],
                    scale: [1, 1.08, 1],
                  }
                : {
                    boxShadow: [
                      '0 0 0 0 rgba(227, 93, 106, 0.3)',
                      '0 0 20px 4px rgba(227, 93, 106, 0.25)',
                      '0 0 0 0 rgba(227, 93, 106, 0.3)',
                    ],
                  }
            }
            transition={{ duration: isUltimate ? 1.2 : 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-16 h-16 rounded-full flex items-center justify-center border backdrop-blur-xl transition-colors ${
              isUltimate
                ? 'bg-[#E35D6A]/40 border-[#E35D6A]/70'
                : isAnimating
                ? 'bg-white/20 border-white/40'
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
