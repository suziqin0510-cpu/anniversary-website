'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt';
import ScratchCard from '@/components/ScratchCard';
import CinemaModal from '@/components/CinemaModal';
import InventoryBar from '@/components/InventoryBar';
import PolaroidFlip from '@/components/PolaroidFlip';
import MagneticButton from '@/components/MagneticButton';
import OrganicReveal from '@/components/OrganicReveal';
import { useGame, Letter, LEVEL_ROUTES } from '@/lib/game-context';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

// ===== 全局样式：禁用 Hover 阴影 =====
const noShadowStyle = { outline: 'none', boxShadow: 'none' } as const;

// ===== 获取路由需要的关卡 =====
function getRouteLevel(href: string): number | null {
  for (const [level, routes] of Object.entries(LEVEL_ROUTES)) {
    if (routes.some((r) => href.startsWith(r))) {
      return parseInt(level);
    }
  }
  return null;
}

// ===== 带锁定的 Link 组件 =====
function LockedLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const { isLevelUnlocked, showToast } = useGame();
  const router = useRouter();
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const requiredLevel = getRouteLevel(href);

    // 如果需要关卡且未解锁
    if (requiredLevel && !isLevelUnlocked(requiredLevel)) {
      e.preventDefault();
      e.stopPropagation();

      // 触发摇晃动画
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      // 显示 Toast
      showToast('🔒 关卡未解锁：请先找齐 8 个光阴碎片，拼出幸福的密码！', 'error');
      return false;
    }

    // 调用原始的 onClick
    onClick?.(e);
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

// ===== 带锁定的卡片组件 =====
function LockedCard({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { isLevelUnlocked, showToast } = useGame();
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const requiredLevel = getRouteLevel(href);

    if (requiredLevel && !isLevelUnlocked(requiredLevel)) {
      e.preventDefault();
      e.stopPropagation();

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      showToast('🔒 关卡未解锁：请先找齐 8 个光阴碎片，拼出幸福的密码！', 'error');
      return false;
    }
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={className}
      onClick={handleClick}
    >
      {children}
    </motion.div>
  );
}

// ===== 带锁定的卡片链接组件（用于小型卡片） =====
function LockedCardLink({
  href,
  icon,
  title,
  subtitle,
  delay = 0,
  small = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay?: number;
  small?: boolean;
}) {
  const { isLevelUnlocked, showToast } = useGame();
  const [isShaking, setIsShaking] = useState(false);
  const requiredLevel = getRouteLevel(href);
  const isLocked = requiredLevel ? !isLevelUnlocked(requiredLevel) : false;

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      showToast('🔒 关卡未解锁：请先找齐 8 个光阴碎片，拼出幸福的密码！', 'error');
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, x: isShaking ? [-5, 5, -5, 5, 0] : 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white/30 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50 transition-all hover:bg-white/40 relative ${
        isLocked ? 'cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'
      }`}
    >
      <Link href={isLocked ? '#' : href} onClick={handleClick} className="flex items-center space-x-3 group">
        <div
          className={`rounded-xl bg-[#E35D6A]/20 flex items-center justify-center transition-transform ${
            small ? 'w-10 h-10' : 'w-12 h-12'
          } ${isLocked ? '' : 'group-hover:scale-105'}`}
        >
          {isLocked ? (
            <Lock className={`${small ? 'w-4 h-4' : 'w-5 h-5'} text-[#9B6A6C]/50`} />
          ) : (
            icon
          )}
        </div>
        <div>
          <h3
            className={`font-bold text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] transition-colors ${
              small ? 'text-sm' : ''
            } ${isLocked ? '' : 'group-hover:text-[#E35D6A]'}`}
          >
            {isLocked ? '🔒 ' + title : title}
          </h3>
          <p className={`text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] ${small ? 'text-[10px]' : 'text-xs'}`}>
            {isLocked ? '关卡未解锁' : subtitle}
          </p>
        </div>
      </Link>
      {/* 微观标记 */}
      <div className="corner-mark top-2 left-2 border-l border-t border-white/30" />
      <div className="corner-mark top-2 right-2 border-r border-t border-white/30" />
      <div className="corner-mark bottom-2 left-2 border-l border-b border-white/30" />
      <div className="corner-mark bottom-2 right-2 border-r border-b border-white/30" />
      <span className="absolute top-3 left-3 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">ID_{(href.replace(/\//g, '') || 'HOME').toUpperCase()}</span>
      <span className="absolute bottom-3 right-3 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">v1.0</span>
    </motion.div>
  );
}

// ===== 字母 H 触发器组件 =====
function LetterHTrigger() {
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast } = useGame();

  const handleCollectH = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasCollectedLetter('h' as Letter)) {
      collectLetter('h' as Letter);
      triggerLetterAnimation('h' as Letter, e.clientX, e.clientY);
      showToast('发现字母 H！', 'success');
    }
  };

  if (hasCollectedLetter('h' as Letter)) return null;

  return (
    <span
      onClick={handleCollectH}
      className="ml-1 text-white/10 hover:text-[#E35D6A] hover:text-white/80 cursor-pointer transition-all text-xs"
    >
      h
    </span>
  );
}

// ===== 图标组件（无阴影版本） =====
const RedHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#DC2626"
      stroke="#DC2626"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SmallHeart = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} style={noShadowStyle}>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#E35D6A"
      stroke="#E35D6A"
      strokeWidth="1.5"
    />
  </svg>
);

const HandDrawnClock = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <circle cx="12" cy="12" r="9" stroke="#7C444F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 7v5l3 3" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnMap = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" fill="#E35D6A" fillOpacity="0.3" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="9" r="2" fill="#E35D6A" />
  </svg>
);

const HandDrawnTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4H5a2 2 0 00-2 2v1a3 3 0 003 3M17 4h2a2 2 0 012 2v1a3 3 0 01-3 3" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnStar = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnBook = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#E35D6A" fillOpacity="0.2" />
  </svg>
);

const HandDrawnPaw = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <ellipse cx="12" cy="15" rx="4" ry="3.5" fill="#E35D6A" fillOpacity="0.3" stroke="#7C444F" strokeWidth="1.5" />
    <ellipse cx="6.5" cy="9" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" />
    <ellipse cx="12" cy="6" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" />
    <ellipse cx="17.5" cy="9" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" />
  </svg>
);

const VideoPlayerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={noShadowStyle}>
    <rect x="2" y="6" width="20" height="12" rx="3" fill="url(#videoGrad)" fillOpacity="0.3" stroke="#E35D6A" strokeWidth="1.5" />
    <path d="M10 9l6 3-6 3V9z" fill="#E35D6A" />
    <defs>
      <linearGradient id="videoGrad" x1="2" y1="6" x2="22" y2="18">
        <stop stopColor="#F4A460" />
        <stop offset="1" stopColor="#E35D6A" />
      </linearGradient>
    </defs>
  </svg>
);

const WeatherSun = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={noShadowStyle}>
    <circle cx="12" cy="12" r="5" fill="#F4A460" fillOpacity="0.6" stroke="#F4A460" strokeWidth="1.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#F4A460" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WeatherCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={noShadowStyle}>
    <path d="M18 10h-1.26A8 8 0 104 16.25" stroke="#9B6A6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#E35D6A" fillOpacity="0.2" />
    <path d="M16 10a5 5 0 110 10h-1" stroke="#9B6A6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ===== 实时心跳计时器组件 =====
function LiveHeartbeatTimer() {
  const [timeData, setTimeData] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showLetterE, setShowLetterE] = useState(false);
  const START_DATE = new Date('2025-05-20T00:00:00');
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast } = useGame();

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeData({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDaysHover = () => {
    if (!hasCollectedLetter('e' as Letter)) {
      setShowLetterE(true);
    }
  };

  const handleDaysLeave = () => {
    setShowLetterE(false);
  };

  const handleCollectE = (e: React.MouseEvent) => {
    if (!hasCollectedLetter('e' as Letter)) {
      collectLetter('e' as Letter);
      triggerLetterAnimation('e' as Letter, e.clientX, e.clientY);
      showToast('发现字母 E！', 'success');
    }
    setShowLetterE(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center space-x-1 mb-2">
        <span className="animate-heartbeat"><SmallHeart className="w-5 h-5" /></span>
        <span className="text-sm text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">实时心跳</span>
        <span className="animate-heartbeat"><SmallHeart className="w-5 h-5" /></span>
      </div>
      <div
        className="text-3xl font-bold text-[#E35D6A] font-mono relative cursor-pointer drop-shadow-[0_2px_4px_rgba(255,255,255,1)]"
        onMouseEnter={handleDaysHover}
        onMouseLeave={handleDaysLeave}
      >
        <span>{String(timeData.days).padStart(3, '0')}</span>
        <span className="text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">:</span>
        <span>{String(timeData.hours).padStart(2, '0')}</span>
        <span className="text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">:</span>
        <span>{String(timeData.minutes).padStart(2, '0')}</span>
        <span className="text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">:</span>
        <span>{String(timeData.seconds).padStart(2, '0')}</span>

        {/* 字母 e 触发器 */}
        <AnimatePresence>
          {showLetterE && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={handleCollectE}
              className="absolute -right-6 top-0 text-2xl font-bold text-[#E35D6A] cursor-pointer hover:scale-125 transition-transform"
              style={{ textShadow: '0 0 10px rgba(227, 93, 106, 0.8)' }}
            >
              e
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="text-xs text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] mt-1">自 2025.05.20 起</div>
    </div>
  );
}

// ===== 2x2 错落拍立得画廊 =====
const polaroidsData = [
  {
    id: 1,
    title: '我们的第一个 100 天',
    caption: '一场美美的约会。',
    rotate: '-4deg',
    image: 'https://i.ibb.co/kYwptsL/58d4863d5a51e750dc6e8152b64ab74c.jpg',
    backText: '那天阳光很好，你笑得很甜。我想，这就是爱情的样子吧。',
  },
  {
    id: 2,
    title: '鲜花后备箱',
    caption: '专属于你的后备箱（鲜花限定版）。',
    rotate: '3deg',
    image: 'https://i.ibb.co/Cpz5MvGc/94d4f8cada1991a77bf8ce953d7f9734.jpg',
    backText: '准备这个惊喜的时候，我比你还紧张。看到你惊喜的表情，一切都值得。',
  },
  {
    id: 3,
    title: '超爽泡私汤',
    caption: '你肯定记得这是在哪了吧。',
    rotate: '-2deg',
    image: 'https://i.ibb.co/mrfHcVp7/135431bee4c12631c685caa0838abcae.jpg',
    backText: '香格里拉的私汤很暖，你很甜。雪山下的浪漫，是我见过最美的风景。',
  },
  {
    id: 4,
    title: '专属四宫格',
    caption: '这可是我们自己的四宫格哦。',
    rotate: '5deg',
    image: 'https://i.ibb.co/4w7S1Y9m/2cb378e808092ab8ba55cd0cd2b02152.jpg',
    backText: '每一张都是我们的独家记忆，每一个笑容都是我最珍贵的宝藏。',
  },
];

function ScatteredPolaroids() {
  return (
    <div className="h-full flex flex-col">
      {/* 标题 */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 drop-shadow-[0_4px_4px_rgba(255,255,255,0.8)] font-handwriting">散落的回忆</h3>
        <p className="text-xs text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] mt-1">点击照片，翻转查看背面文字</p>
      </div>

      {/* 2x2 3D翻转拍立得网格 */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {polaroidsData.map((p, index) => (
          <PolaroidFlip
            key={p.id}
            frontImage={p.image}
            frontCaption={p.title}
            backText={p.backText}
            rotate={p.rotate}
            delay={index * 0.1}
            letterTrigger={index === 0 ? ('p' as Letter) : undefined} // 第一张拍立得包含字母 p
          />
        ))}
      </div>

      {/* 手绘涂鸦装饰 */}
      <svg className="absolute bottom-3 right-3 w-6 h-6 text-[#E35D6A]/25 pointer-events-none" viewBox="0 0 24 24">
        <path d="M4 12c3-6 9-6 12 0s6 6 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ===== 我们在昆明有个家 🏠 入口卡片（全宽横幅版） =====
function DarkroomCard() {
  return (
    <a href="/album" className="block group relative">
      <div className="bg-white/40 backdrop-blur-md border border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl py-8 px-6 sm:px-10 flex flex-row items-center justify-between cursor-pointer relative overflow-hidden">
        {/* 噪点 overlay */}
        <div className="noise-overlay rounded-2xl" />

        {/* 微观标记 */}
        <div className="corner-mark top-3 left-3 border-l border-t border-white/30" />
        <div className="corner-mark top-3 right-3 border-r border-t border-white/30" />
        <div className="corner-mark bottom-3 left-3 border-l border-b border-white/30" />
        <div className="corner-mark bottom-3 right-3 border-r border-b border-white/30" />
        <span className="absolute top-4 left-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">ALBUM_01</span>
        <span className="absolute bottom-4 right-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">KM.2024</span>

        {/* 左侧文案 */}
        <div className="flex flex-col items-start relative z-10">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 drop-shadow-[0_4px_4px_rgba(255,255,255,0.8)] tracking-wide">
            我们在昆明有个家 🏠
          </h3>
          <p className="text-sm text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] mt-2">
            专属于我们的记忆
          </p>
        </div>

        {/* 右侧图标 */}
        <div className="flex items-center space-x-3 relative z-10">
          <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">📷</span>
          <span className="text-rose-400 text-xl md:text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">➔</span>
        </div>
      </div>
    </a>
  );
}

// ===== 双城天气同步组件 =====
function DualCityWeather() {
  const [kunmingTemp] = useState(22);
  const [malaysiaTemp] = useState(31);
  const [showLetterU, setShowLetterU] = useState(false);
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast } = useGame();

  const handleWeatherClick = (e: React.MouseEvent) => {
    if (!hasCollectedLetter('u' as Letter)) {
      collectLetter('u' as Letter);
      triggerLetterAnimation('u' as Letter, e.clientX, e.clientY);
      showToast('发现字母 U！', 'success');
    }
    setShowLetterU(true);
    setTimeout(() => setShowLetterU(false), 1000);
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <WeatherSun />
        <span className="text-sm font-bold text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">双城天气</span>
      </div>

      <div className="flex items-center justify-center space-x-4">
        {/* 昆明 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[#E35D6A] drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">{kunmingTemp}°</div>
          <div className="text-xs text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">昆明</div>
          <div className="text-[10px] text-gray-800/80 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">晴朗</div>
        </div>

        {/* 虚线连接 */}
        <div className="flex flex-col items-center relative">
          <div className="w-16 h-px border-t-2 border-dashed border-[#E35D6A]/40 relative">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <SmallHeart className="w-3 h-3" />
            </motion.div>
          </div>
          {/* 字母 u 触发器 - 点击天气图标 */}
          <motion.button
            onClick={handleWeatherClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center cursor-pointer"
          >
            <AnimatePresence>
              {!hasCollectedLetter('u' as Letter) ? (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <WeatherCloud />
                </motion.div>
              ) : (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-lg font-bold text-[#E35D6A]"
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* 掉落的字母 u */}
          <AnimatePresence>
            {showLetterU && (
              <motion.span
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: 30, opacity: 0, scale: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-[#E35D6A] pointer-events-none"
              >
                u
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* 马来西亚 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[#F4A460] drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">{malaysiaTemp}°</div>
          <div className="text-xs text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">槟城</div>
          <div className="text-[10px] text-gray-800/80 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">多云</div>
        </div>
      </div>

      <div className="text-center mt-3 text-xs text-gray-800/80 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
        同一时刻，同一心跳 💓
      </div>
    </div>
  );
}

// ===== 想你按钮组件（带字母 a 触发器） =====
function MissYouButton() {
  const [count, setCount] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [showLetterA, setShowLetterA] = useState(false);
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast } = useGame();

  const handleClick = useCallback(() => {
    setCount(c => {
      const newCount = c + 1;
      // 点击5次后显示字母A
      if (newCount === 5 && !hasCollectedLetter('a' as Letter)) {
        setShowLetterA(true);
        showToast('✨ 神秘的字母出现了！', 'success');
      }
      return newCount;
    });
    const newHeart = { id: Date.now(), x: Math.random() * 60 - 30 };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  }, [hasCollectedLetter, showToast]);

  const handleCollectA = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasCollectedLetter('a' as Letter)) {
      collectLetter('a' as Letter);
      triggerLetterAnimation('a' as Letter, e.clientX, e.clientY);
      showToast('发现字母 A！', 'success');
      setShowLetterA(false);
    }
  };

  // 检查是否满足显示条件（已点击5次且未收集）
  const shouldShowLetterA = showLetterA || (count >= 5 && !hasCollectedLetter('a' as Letter));

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      <MagneticButton strength={18} innerStrength={6} className="relative z-10">
        <motion.button
          onClick={handleClick}
          className="px-6 py-3 bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center space-x-2">
            <SmallHeart className="w-5 h-5" />
            <span>想你</span>
          </span>
        </motion.button>
      </MagneticButton>

      <div className="mt-3 text-center relative">
        <div className="text-2xl font-bold text-[#E35D6A] drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">{count}</div>
        <div className="text-xs text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">次思念已发送</div>
        {/* 字母 a 触发器 - 点击52次后显示 */}
        {shouldShowLetterA && !hasCollectedLetter('a' as Letter) && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            onClick={handleCollectA}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-[#E35D6A] cursor-pointer hover:scale-125 transition-all z-10 px-3 py-2"
            style={{ textShadow: '0 0 15px rgba(227, 93, 106, 0.8)' }}
          >
            A
          </motion.span>
        )}
        {/* 进度提示 - 5次前显示 */}
        {count < 5 && !hasCollectedLetter('a' as Letter) && (
          <motion.span
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-800/70 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"
          >
            {52 - count}次后...
          </motion.span>
        )}
      </div>

      {/* 漂浮的心 */}
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none"
            initial={{ y: 0, opacity: 1, x: heart.x }}
            animate={{ y: -100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ bottom: '40%', left: '50%', marginLeft: -10 }}
          >
            <SmallHeart className="w-5 h-5" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ===== 宠物专区组件（带字母 i 触发器） =====
function PetSectionCard() {
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast, isLevelUnlocked } = useGame();
  const [isShaking, setIsShaking] = useState(false);

  const isLocked = !isLevelUnlocked(6);

  const handleCollectI = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasCollectedLetter('i' as Letter)) {
      collectLetter('i' as Letter);
      triggerLetterAnimation('i' as Letter, e.clientX, e.clientY);
      showToast('发现字母 I！', 'success');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      showToast('🔒 关卡未解锁：请先找齐 8 个光阴碎片，拼出幸福的密码！', 'error');
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, x: isShaking ? [-5, 5, -5, 5, 0] : 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className={`bg-white/30 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/50 transition-all hover:bg-white/40 relative ${
        isLocked ? 'cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'
      }`}
    >
      <Link href={isLocked ? '#' : '/pets'} onClick={handleClick} className="flex items-center space-x-3 group">
        <motion.div
          whileHover={isLocked ? {} : { scale: 1.1, rotate: 5 }}
          whileTap={isLocked ? {} : { scale: 0.9 }}
          onClick={handleCollectI}
          className="w-10 h-10 rounded-xl bg-[#E35D6A]/20 flex items-center justify-center cursor-pointer relative"
        >
          {isLocked ? (
            <Lock className="w-4 h-4 text-[#9B6A6C]/50" />
          ) : (
            <>
              <HandDrawnPaw />
              {/* 字母 i - 未收集时显示 */}
              {!hasCollectedLetter('i' as Letter) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -right-1 -top-1 text-xs font-bold text-[#E35D6A]"
                  style={{ textShadow: '0 0 5px rgba(227, 93, 106, 0.8)' }}
                >
                  i
                </motion.span>
              )}
            </>
          )}
        </motion.div>
        <div>
          <h3 className={`font-bold text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] transition-colors text-sm ${isLocked ? '' : 'group-hover:text-[#E35D6A]'}`}>
            {isLocked ? '🔒 宠物专区' : '宠物专区'}
          </h3>
          <p className="text-[10px] text-gray-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">{isLocked ? '关卡未解锁' : '盼盼 & 石榴'}</p>
        </div>
      </Link>
      {/* 微观标记 */}
      <div className="corner-mark top-2 left-2 border-l border-t border-white/30" />
      <div className="corner-mark top-2 right-2 border-r border-t border-white/30" />
      <div className="corner-mark bottom-2 left-2 border-l border-b border-white/30" />
      <div className="corner-mark bottom-2 right-2 border-r border-b border-white/30" />
      <span className="absolute top-3 left-3 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">PET_01</span>
      <span className="absolute bottom-3 right-3 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">PA+SS</span>
    </motion.div>
  );
}
function ImageCard({
  href,
  title,
  subtitle,
  delay = 0,
  bgImage = 'linear-gradient(135deg, #E35D6A 0%, #F4A460 100%)',
  size = 'large'
}: {
  href: string;
  title: string;
  subtitle: string;
  delay?: number;
  bgImage?: string;
  size?: 'large' | 'small';
}) {
  const { isLevelUnlocked, showToast } = useGame();
  const [isShaking, setIsShaking] = useState(false);
  const requiredLevel = getRouteLevel(href);
  const isLocked = requiredLevel ? !isLevelUnlocked(requiredLevel) : false;

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();

      // 触发摇晃动画
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      // 显示 Toast
      showToast('🔒 关卡未解锁：请先找齐 8 个光阴碎片，拼出幸福的密码！', 'error');
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, x: isShaking ? [-5, 5, -5, 5, 0] : 0 }}
      transition={{ delay, duration: 0.5 }}
      className="h-full"
    >
      <Link href={isLocked ? '#' : href} onClick={handleClick} className="block h-full">
        <Tilt
          tiltMaxAngleX={8}
          tiltMaxAngleY={8}
          perspective={1000}
          scale={isLocked ? 1 : 1.02}
          glareEnable={!isLocked}
          glareMaxOpacity={0.15}
          glareColor="#E35D6A"
          glarePosition="all"
          glareBorderRadius="1.5rem"
          style={{ borderRadius: '1.5rem', height: '100%' }}
        >
          <div
            className="h-full rounded-3xl overflow-hidden relative group cursor-pointer bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: bgImage,
              filter: isLocked ? 'grayscale(0.3) brightness(0.7)' : 'none',
            }}
          >
            {/* 深色渐变遮罩 */}
            <div className={`absolute inset-0 bg-gradient-to-t ${isLocked ? 'from-black/90 via-black/50 to-black/40' : 'from-black/80 via-black/30 to-black/20'}`} />

            {/* 锁定图标 */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                  <Lock className="w-8 h-8 text-white/80" />
                </div>
              </div>
            )}

            {/* 内容 - 靠左下角对齐 */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className={`font-bold text-white mb-2 transition-transform origin-left ${size === 'large' ? 'text-3xl' : 'text-xl'} ${isLocked ? '' : 'group-hover:scale-105'}`}>
                {title}
              </h3>
              <p className="text-white/80 text-sm">
                {subtitle}
              </p>
              <div className={`mt-4 flex items-center text-white/70 text-sm transition-colors ${isLocked ? '' : 'group-hover:text-white'}`}>
                <span>{isLocked ? '锁定中' : '进入'}</span>
                <span className={`ml-2 transition-transform ${isLocked ? '' : 'group-hover:translate-x-1'}`}>{isLocked ? '🔒' : '→'}</span>
              </div>
            </div>

            {/* 噪点胶片 overlay */}
            <div className="noise-overlay rounded-3xl" />

            {/* 微观标记 - 四角 */}
            <div className="corner-mark top-3 left-3 border-l border-t" />
            <div className="corner-mark top-3 right-3 border-r border-t" />
            <div className="corner-mark bottom-3 left-3 border-l border-b" />
            <div className="corner-mark bottom-3 right-3 border-r border-b" />
            <span className="absolute top-4 left-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">LAT:25.04</span>
            <span className="absolute top-4 right-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">LON:102.71</span>
            <span className="absolute bottom-4 left-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">MEM_ID_001</span>
            <span className="absolute bottom-4 right-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">ISO:200</span>

            {/* 装饰光斑 */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          </div>
        </Tilt>
      </Link>
    </motion.div>
  );
}

// ===== 主页面 =====
export default function HomePage() {
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);

  return (
    <>
      {/* 👉 强制绕过 Next.js 优化的高清背景层 👈 */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: "url('/homepage_bg_final.png?v=3')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'translateZ(0)',
        }}
      />
      {/* 纯暗色遮罩压亮背景，保证文字清晰同时不模糊背景 */}
      <div className="fixed inset-0 -z-10 bg-black/30" />

      <div className="min-h-screen relative z-10">

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-40 relative z-10">
        {/* 头部标题区 - 直接悬浮在背景上 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <span className="animate-heartbeat"><RedHeart /></span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif-display text-white drop-shadow-lg tracking-tighter">
            苏子钦 & 李丹
          </h1>

          <p className="text-lg text-white font-light tracking-wider drop-shadow-md">
            CYBERSPACE v1.0 · <span className="font-serif-display tracking-tight">我们的 365 天</span>
          </p>

          {/* 寄语直接悬浮在背景上 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-white italic max-w-md mx-auto drop-shadow-md"
          >
            "在这个充满变数的世界里，我为你撑起一个永远恒温的小窝"
          </motion.p>
        </motion.div>

        {/* ===== V9.0 艺术手账本布局 ===== */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* 第一列 */}
          <div className="col-span-12 md:col-span-5 space-y-6 md:space-y-8">
            {/* 1. 时间线 - 图片背景大卡片 */}
            <OrganicReveal delay={0.1} className="h-64 md:h-80">
              <ImageCard
                href="/timeline"
                title="时间线"
                subtitle="我们的故事 · 从初见开始"
                delay={0.1}
                bgImage="url('https://i.ibb.co/pvYQdqjC/Gemini-Generated-Image-bq75hcbq75hcbq75.png')"
                size="large"
              />
            </OrganicReveal>

            {/* 2. 实时心跳计时器 */}
            <OrganicReveal delay={0.15}>
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/60 relative overflow-hidden">
                <div className="noise-overlay rounded-3xl" />
                <div className="relative z-10">
                  <LiveHeartbeatTimer />
                </div>
              </div>
            </OrganicReveal>

            {/* 3. 双城天气 */}
            <OrganicReveal delay={0.2}>
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/60 relative overflow-hidden">
                <div className="noise-overlay rounded-3xl" />
                <div className="relative z-10">
                  <DualCityWeather />
                </div>
              </div>
            </OrganicReveal>
          </div>

          {/* 第二列 - 整体向下偏移 mt-12 实现不对称错落 */}
          <div className="col-span-12 md:col-span-4 md:mt-16 space-y-6 md:space-y-8">
            {/* 4. 散落的拍立得 */}
            <OrganicReveal delay={0.25}>
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/60 min-h-[420px] relative overflow-hidden">
                <div className="noise-overlay rounded-3xl" />
                <div className="relative z-10">
                  <ScatteredPolaroids />
                </div>
              </div>
            </OrganicReveal>

            {/* 5. 想你按钮 */}
            <OrganicReveal delay={0.3}>
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/60 relative overflow-hidden">
                <div className="noise-overlay rounded-3xl" />
                <div className="corner-mark top-2 left-2 border-l border-t border-white/30" />
                <div className="corner-mark top-2 right-2 border-r border-t border-white/30" />
                <div className="corner-mark bottom-2 left-2 border-l border-b border-white/30" />
                <div className="corner-mark bottom-2 right-2 border-r border-b border-white/30" />
                <span className="absolute top-3 left-3 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">LAT:24.88</span>
                <span className="absolute bottom-3 right-3 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">MISS_YOU</span>
                <div className="relative z-10">
                  <MissYouButton />
                </div>
              </div>
            </OrganicReveal>

            {/* 6. 私密日记 */}
            <OrganicReveal delay={0.35}>
              <LockedCardLink
                href="/diary"
                delay={0.5}
                icon={<HandDrawnBook />}
                title="私密日记"
                subtitle="写给李丹"
              />
            </OrganicReveal>
          </div>


          {/* 第三列 */}
          <div className="col-span-12 md:col-span-3 space-y-6 md:space-y-8">
            {/* 7. 足迹地图 */}
            <OrganicReveal delay={0.2}>
              <LockedCardLink
                href="/map"
                delay={0.4}
                icon={<HandDrawnMap />}
                title="足迹地图"
                subtitle="一起去过的地方"
                small
              />
            </OrganicReveal>

            {/* 8. AI 影院 - 图片背景，点击打开模态框 */}
            <OrganicReveal delay={0.25} className="h-40">
              <div className="h-full">
                <Tilt
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  perspective={1000}
                  scale={1.02}
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                  glareColor="#E35D6A"
                  glarePosition="all"
                  glareBorderRadius="1.5rem"
                  style={{ borderRadius: '1.5rem', height: '100%' }}
                >
                  <div
                    onClick={() => setIsCinemaOpen(true)}
                    className="h-full rounded-3xl overflow-hidden relative group cursor-pointer bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://i.ibb.co/ymG0cCwC/85612113dddcb5076bf0815e263b4a2c.jpg')" }}
                  >
                    {/* 深色渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                    {/* 噪点 overlay */}
                    <div className="noise-overlay rounded-3xl" />

                    {/* 微观标记 */}
                    <div className="corner-mark top-3 left-3 border-l border-t border-white/30 z-20" />
                    <div className="corner-mark top-3 right-3 border-r border-t border-white/30 z-20" />
                    <div className="corner-mark bottom-3 left-3 border-l border-b border-white/30 z-20" />
                    <div className="corner-mark bottom-3 right-3 border-r border-b border-white/30 z-20" />
                    <span className="absolute top-4 left-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">FILM_01</span>
                    <span className="absolute bottom-4 right-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">4K_HDR</span>

                    {/* 播放图标 */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>

                    {/* 内容 - 靠左下角对齐 */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                      <h3 className="font-bold text-white mb-2 text-xl group-hover:scale-105 transition-transform origin-left">
                        恋爱回忆录
                      </h3>
                      <p className="text-white/80 text-sm">
                        我们的专属电影，有些记忆永远不会褪色
                        {/* 字母 h 触发器 - 极其暗淡的字母 */}
                        <LetterHTrigger />
                      </p>
                      <div className="mt-4 flex items-center text-white/70 text-sm group-hover:text-white transition-colors">
                        <span>点击播放</span>
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">▶</span>
                      </div>
                    </div>

                    {/* 装饰光斑 */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  </div>
                </Tilt>
              </div>
            </OrganicReveal>

            {/* 9. 宠物专区（带字母 i 触发器） */}
            <OrganicReveal delay={0.3}>
              <PetSectionCard />
            </OrganicReveal>

            {/* 10. 成就勋章 */}
            <OrganicReveal delay={0.35}>
              <LockedCardLink
                href="/achievements"
                delay={0.7}
                icon={<HandDrawnTrophy />}
                title="成就勋章"
                subtitle="专属纪念"
                small
              />
            </OrganicReveal>

            {/* 11. 刮刮乐 - 专属兑换券 */}
            <OrganicReveal delay={0.4}>
              <div className="h-48 sm:h-56 relative overflow-hidden rounded-3xl">
                <div className="noise-overlay rounded-3xl" />
                <div className="corner-mark top-3 left-3 border-l border-t border-white/30 z-20" />
                <div className="corner-mark top-3 right-3 border-r border-t border-white/30 z-20" />
                <div className="corner-mark bottom-3 left-3 border-l border-b border-white/30 z-20" />
                <div className="corner-mark bottom-3 right-3 border-r border-b border-white/30 z-20" />
                <span className="absolute top-4 left-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">COUPON_01</span>
                <span className="absolute bottom-4 right-4 text-[10px] font-mono-micro tracking-[0.2em] text-white/40 z-20">REDEEM</span>
                <div className="relative z-10 h-full">
                  <ScratchCard />
                </div>
              </div>
            </OrganicReveal>
          </div>

          {/* 4.5 我们在昆明有个家 🏠 - 全宽横幅 */}
          <OrganicReveal delay={0.3} className="col-span-full">
            <DarkroomCard />
          </OrganicReveal>
        </div>

        {/* 底部彩蛋 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 text-gray-800/80 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
            <span>啾咪啾咪</span>
            <span className="animate-heartbeat"><SmallHeart className="w-5 h-5" /></span>
            <span>咪啾咪啾</span>
          </div>
        </motion.div>

        <InventoryBar />
      </div>

      {/* AI影院模态框 */}
      <CinemaModal isOpen={isCinemaOpen} onClose={() => setIsCinemaOpen(false)} />

    </div>
    </>
  );
}
