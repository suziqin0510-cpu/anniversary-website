'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// S & L 水印组件
export function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 重复的 S & L 水印 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 100px,
            rgba(227, 93, 106, 0.1) 100px,
            rgba(227, 93, 106, 0.1) 180px
          )
        `,
      }}>
        {/* S & L 文字层 */}
        <div className="absolute inset-0 flex flex-wrap justify-around items-center gap-20 p-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="text-6xl font-bold text-[#E35D6A] select-none transform"
              style={{
                transform: `rotate(-15deg) translate(${i % 2 === 0 ? 20 : -20}px, ${i % 3 === 0 ? 10 : -10}px)`,
              }}
            >
              S & L
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 随机弹幕彩蛋 - 扩充浪漫文案
const messages = [
  "今天也很爱你 💕",
  "想带你去滑雪 ⛷️",
  "李丹，你是我的唯一 ✨",
  "好想抱你 🤗",
  "我们的故事才刚开始 🌟",
  "盼盼和石榴也想你了 🐾",
  "等我回血，带你去亚庇看海 🌊",
  "你是我见过最美的风景 🌸",
  "每天都很想你 💭",
  "要一起吃好多顿火锅 🍲",
  "你只管安心做小公主 👑",
  "山海可平，爱你如初 🏔️",
  // 新增浪漫短语
  "想和你去吃好吃的 🍲",
  "盼盼和石榴今天也很乖 🐶🐱",
  "副驾永远是你的位置 🚗",
  "今天也要开心哦，小公主 👑",
  "2500公里也挡不住想你 ✈️",
  "我们在昆明有个家 🏠",
  "苏子钦永远爱李丹 💖",
  "想牵着你的手不放开 🤝",
  "你的笑容是我的阳光 ☀️",
  "一周年快乐，我的宝贝 🎉",
  "未来的路我们一起走 🛤️",
];

export function RandomDanmaku() {
  const [visibleMessages, setVisibleMessages] = useState<Array<{
    id: number;
    text: string;
    x: number;
    y: number;
    duration: number;
    size: 'small' | 'medium' | 'large';
  }>>([]);
  const [idleTime, setIdleTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let messageTimer: NodeJS.Timeout;

    const resetIdle = () => {
      setIdleTime(0);
      setIsIdle(false);
    };

    // 监听用户活动
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetIdle));

    // 空闲计时器
    const checkIdle = () => {
      setIdleTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 5) { // 5秒后开始显示弹幕（缩短等待时间）
          setIsIdle(true);
        }
        return newTime;
      });
    };

    idleTimer = setInterval(checkIdle, 1000);

    // 空闲时随机显示弹幕
    const showRandomMessage = () => {
      // 同屏数量上限提升至15条
      if (isIdle && visibleMessages.length < 15) {
        const id = Date.now() + Math.random();
        const message = messages[Math.floor(Math.random() * messages.length)];

        // 轨道防重叠：Y轴分布范围 10% - 85%，增加随机性
        const y = Math.random() * 75 + 10; // 10% - 85%

        // 速度错落有致：15-25秒缓慢飘过，营造浪漫氛围
        const duration = 15 + Math.random() * 10; // 15-25秒

        // 随机字体大小
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];

        setVisibleMessages(prev => [...prev, { id, text: message, x: 0, y, duration, size }]);

        // 动画结束后移除
        setTimeout(() => {
          setVisibleMessages(prev => prev.filter(m => m.id !== id));
        }, duration * 1000);
      }
    };

    // 生成间隔：2000-3500ms之间随机生成
    const getRandomInterval = () => 2000 + Math.random() * 1500;

    // 使用递归setTimeout实现随机间隔
    const scheduleNextMessage = () => {
      messageTimer = setTimeout(() => {
        showRandomMessage();
        scheduleNextMessage();
      }, getRandomInterval());
    };

    scheduleNextMessage();

    return () => {
      clearInterval(idleTimer);
      clearTimeout(messageTimer);
      events.forEach(event => window.removeEventListener(event, resetIdle));
    };
  }, [isIdle, visibleMessages.length]);

  // 字体大小映射
  const sizeClasses = {
    small: 'text-xs px-3 py-1.5',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-5 py-2.5',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {visibleMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: '-20vw', scale: 0.8 }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              x: ['-10vw', '110vw'],
              scale: [0.8, 1, 1, 0.9],
            }}
            transition={{
              duration: msg.duration,
              times: [0, 0.05, 0.95, 1],
              ease: 'linear',
            }}
            className="absolute whitespace-nowrap font-medium"
            style={{
              left: 0,
              top: `${msg.y}%`,
            }}
          >
            <span className={`rounded-full bg-white/70 backdrop-blur-sm text-[#E35D6A] shadow-md border border-rose-100/50 ${sizeClasses[msg.size]}`}>
              {msg.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// 触觉反馈按钮包装器
interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function RippleButton({ children, onClick, className = '', disabled = false }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden transition-all ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}

      {/* 波纹效果 */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute rounded-full bg-rose-300/50 pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </motion.button>
  );
}

// 组合组件
export default function GlobalEffects() {
  return (
    <>
      <Watermark />
      <RandomDanmaku />
    </>
  );
}
