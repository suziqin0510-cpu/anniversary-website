'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt';

// ===== 图标组件 =====
const RedHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
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
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#E35D6A"
      stroke="#E35D6A"
      strokeWidth="1.5"
    />
  </svg>
);

const HandDrawnClock = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <circle cx="12" cy="12" r="9" stroke="#7C444F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 7v5l3 3" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnMap = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" fill="#E35D6A" fillOpacity="0.3" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="9" r="2" fill="#E35D6A" />
  </svg>
);

const HandDrawnTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4H5a2 2 0 00-2 2v1a3 3 0 003 3M17 4h2a2 2 0 012 2v1a3 3 0 01-3 3" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnStar = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnBook = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#7C444F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#E35D6A" fillOpacity="0.2" />
  </svg>
);

const HandDrawnPaw = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <ellipse cx="12" cy="15" rx="4" ry="3.5" fill="#E35D6A" fillOpacity="0.3" stroke="#7C444F" strokeWidth="1.5" />
    <ellipse cx="6.5" cy="9" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" />
    <ellipse cx="12" cy="6" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" />
    <ellipse cx="17.5" cy="9" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#7C444F" strokeWidth="1.5" />
  </svg>
);

const VideoPlayerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
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
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <circle cx="12" cy="12" r="5" fill="#F4A460" fillOpacity="0.6" stroke="#F4A460" strokeWidth="1.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#F4A460" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WeatherCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <path d="M18 10h-1.26A8 8 0 104 16.25" stroke="#9B6A6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#E35D6A" fillOpacity="0.2" />
    <path d="M16 10a5 5 0 110 10h-1" stroke="#9B6A6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GiftBoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <rect x="3" y="8" width="18" height="13" rx="2" fill="#E35D6A" fillOpacity="0.2" stroke="#E35D6A" strokeWidth="1.5" />
    <path d="M12 8v13M3 12h18" stroke="#E35D6A" strokeWidth="1.5" />
    <path d="M7 8c0-2.21 1.79-4 4-4a4 4 0 014 4M17 8c0-2.21-1.79-4-4-4" stroke="#E35D6A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ===== 实时心跳计时器组件 =====
function LiveHeartbeatTimer() {
  const [timeData, setTimeData] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const START_DATE = new Date('2025-05-20T00:00:00');

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

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center space-x-1 mb-2">
        <span className="animate-heartbeat"><SmallHeart className="w-5 h-5" /></span>
        <span className="text-sm text-[#9B6A6C]">实时心跳</span>
        <span className="animate-heartbeat"><SmallHeart className="w-5 h-5" /></span>
      </div>
      <div className="text-3xl font-bold text-[#E35D6A] font-mono">
        {String(timeData.days).padStart(3, '0')}:{String(timeData.hours).padStart(2, '0')}:
        {String(timeData.minutes).padStart(2, '0')}:{String(timeData.seconds).padStart(2, '0')}
      </div>
      <div className="text-xs text-[#9B6A6C] mt-1">自 2025.05.20 起</div>
    </div>
  );
}

// ===== 回忆盲盒宝丽来组件 =====
const polaroids = [
  { id: 1, caption: '初遇 · 昆明', color: 'bg-[#FFE4E1]' },
  { id: 2, caption: '大理的风', color: 'bg-[#E6F3FF]' },
  { id: 3, caption: '丽江的酒', color: 'bg-[#FFF8DC]' },
  { id: 4, caption: '亚庇落日', color: 'bg-[#FFE4B5]' },
];

function MemoryBlindBox() {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [opened, setOpened] = useState<Set<number>>(new Set());

  const handleFlip = (id: number) => {
    if (flipped === id) {
      setFlipped(null);
    } else {
      setFlipped(id);
      setOpened(prev => new Set([...prev, id]));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <GiftBoxIcon />
          <span className="text-lg font-bold text-[#7C444F]">回忆盲盒</span>
        </div>
        <span className="text-xs text-[#9B6A6C]">已开启 {opened.size}/4</span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {polaroids.map((p, i) => (
          <motion.div
            key={p.id}
            className="relative cursor-pointer"
            style={{ perspective: 1000 }}
            onClick={() => handleFlip(p.id)}
            initial={{ opacity: 0, rotateY: 180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ rotateY: flipped === p.id ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 正面 - 问号 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#E35D6A]/20 to-[#F4A460]/20 rounded-xl flex items-center justify-center border-2 border-dashed border-[#E35D6A]/30"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-4xl text-[#E35D6A]/50">?</span>
              </div>

              {/* 背面 - 宝丽来照片 */}
              <div
                className={`absolute inset-0 ${p.color} rounded-lg p-2 shadow-md`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-full h-[70%] bg-white rounded shadow-inner flex items-center justify-center">
                  <SmallHeart className="w-8 h-8 opacity-50" />
                </div>
                <div className="text-[10px] text-[#7C444F] mt-1 text-center font-handwriting">{p.caption}</div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-[#9B6A6C] mt-3 text-center">点击卡片开启回忆 ✨</p>
    </div>
  );
}

// ===== 双城天气同步组件 =====
function DualCityWeather() {
  const [kunmingTemp] = useState(22);
  const [malaysiaTemp] = useState(31);

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <WeatherSun />
        <span className="text-sm font-bold text-[#7C444F]">双城天气</span>
      </div>

      <div className="flex items-center justify-center space-x-4">
        {/* 昆明 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[#E35D6A]">{kunmingTemp}°</div>
          <div className="text-xs text-[#9B6A6C]">昆明</div>
          <div className="text-[10px] text-[#9B6A6C]/70">晴朗</div>
        </div>

        {/* 虚线连接 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-px border-t-2 border-dashed border-[#E35D6A]/40 relative">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <SmallHeart className="w-3 h-3" />
            </motion.div>
          </div>
          <span className="text-[10px] text-[#9B6A6C]/60 mt-1">2412km</span>
        </div>

        {/* 马来西亚 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[#F4A460]">{malaysiaTemp}°</div>
          <div className="text-xs text-[#9B6A6C]">槟城</div>
          <div className="text-[10px] text-[#9B6A6C]/70">多云</div>
        </div>
      </div>

      <div className="text-center mt-3 text-xs text-[#9B6A6C]/70">
        同一时刻，同一心跳 💓
      </div>
    </div>
  );
}

// ===== 想你按钮组件 =====
function MissYouButton() {
  const [count, setCount] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
    const newHeart = { id: Date.now(), x: Math.random() * 60 - 30 };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      <motion.button
        onClick={handleClick}
        className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center space-x-2">
          <SmallHeart className="w-5 h-5" />
          <span>想你</span>
        </span>
      </motion.button>

      <div className="mt-3 text-center">
        <div className="text-2xl font-bold text-[#E35D6A]">{count}</div>
        <div className="text-xs text-[#9B6A6C]">次思念已发送</div>
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

// ===== Bento 卡片组件 =====
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tiltProps?: {
    tiltMaxAngleX?: number;
    tiltMaxAngleY?: number;
    scale?: number;
  };
}

function BentoCard({ children, className = '', delay = 0, tiltProps = {} }: BentoCardProps) {
  const { tiltMaxAngleX = 10, tiltMaxAngleY = 10, scale = 1.02 } = tiltProps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`h-full ${className}`}
    >
      <Tilt
        tiltMaxAngleX={tiltMaxAngleX}
        tiltMaxAngleY={tiltMaxAngleY}
        perspective={1000}
        scale={scale}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#E35D6A"
        glarePosition="all"
        glareBorderRadius="1.5rem"
        style={{ borderRadius: '1.5rem', height: '100%' }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-white/60 hover:shadow-xl transition-shadow h-full">
          {children}
        </div>
      </Tilt>
    </motion.div>
  );
}

// ===== 模块链接卡片 =====
function ModuleCard({
  href,
  icon: Icon,
  title,
  desc,
  delay = 0,
  size = 'small'
}: {
  href: string;
  icon: React.ComponentType;
  title: string;
  desc: string;
  delay?: number;
  size?: 'small' | 'wide' | 'large';
}) {
  const content = (
    <BentoCard delay={delay} className="cursor-pointer group">
      <div className={`h-full flex ${size === 'wide' ? 'items-center space-x-4' : size === 'large' ? 'flex-col' : 'flex-col items-center text-center'}`}>
        <div className={`rounded-2xl bg-[#E35D6A]/20 flex items-center justify-center group-hover:bg-[#E35D6A]/30 transition-colors ${size === 'large' ? 'w-16 h-16 mb-4' : size === 'wide' ? 'w-14 h-14 flex-shrink-0' : 'w-12 h-12 mb-3'}`}>
          <Icon />
        </div>
        <div className={size === 'large' ? 'flex-1' : ''}>
          <h3 className={`font-bold text-[#7C444F] group-hover:text-[#E35D6A] transition-colors ${size === 'large' ? 'text-2xl mb-2' : size === 'wide' ? 'text-xl mb-1' : 'text-base mb-1'}`}>
            {title}
          </h3>
          <p className={`text-[#9B6A6C] ${size === 'large' ? 'text-base' : size === 'wide' ? 'text-sm' : 'text-xs'}`}>
            {desc}
          </p>
        </div>
        {size === 'large' && (
          <div className="mt-4 flex items-center text-[#E35D6A] text-sm">
            <span>探索我们的故事</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        )}
      </div>
    </BentoCard>
  );

  return <Link href={href} className="block h-full">{content}</Link>;
}

// ===== 主页面 =====
export default function HomePage() {
  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        {/* 头部标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <span className="animate-heartbeat"><RedHeart /></span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-2 font-handwriting bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
            苏子钦 & 李丹
          </h1>

          <p className="text-base text-[#9B6A6C] font-light tracking-wider">
            CYBERSPACE v1.0 · 我们的 365 天
          </p>
        </motion.div>

        {/* ===== Bento Box 全屏网格 ===== */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4 auto-rows-[140px]">
          {/* 1. 时间线 - 大卡片 (2x2) */}
          <div className="col-span-2 row-span-2">
            <ModuleCard
              href="/timeline"
              icon={HandDrawnClock}
              title="时间线"
              desc="我们的故事 · 从初见开始"
              delay={0.1}
              size="large"
            />
          </div>

          {/* 2. 实时心跳计时器 (2x1) */}
          <div className="col-span-2">
            <BentoCard delay={0.2}>
              <LiveHeartbeatTimer />
            </BentoCard>
          </div>

          {/* 3. 回忆盲盒 (2x2) */}
          <div className="col-span-2 row-span-2">
            <BentoCard delay={0.3}>
              <MemoryBlindBox />
            </BentoCard>
          </div>

          {/* 4. 足迹地图 (2x1) */}
          <div className="col-span-2">
            <ModuleCard
              href="/map"
              icon={HandDrawnMap}
              title="足迹地图"
              desc="一起去过的每一个地方"
              delay={0.4}
              size="wide"
            />
          </div>

          {/* 5. 双城天气 (2x1) */}
          <div className="col-span-2">
            <BentoCard delay={0.5}>
              <DualCityWeather />
            </BentoCard>
          </div>

          {/* 6. 想你按钮 (1x1) */}
          <div className="col-span-1">
            <BentoCard delay={0.6} tiltProps={{ scale: 1.05 }}>
              <MissYouButton />
            </BentoCard>
          </div>

          {/* 7. AI 视频播放器 - 降级为小卡片 (1x1) */}
          <div className="col-span-1">
            <BentoCard delay={0.7}>
              <Link href="/video" className="h-full flex flex-col items-center justify-center group">
                <div className="w-12 h-12 rounded-2xl bg-[#E35D6A]/20 flex items-center justify-center mb-2 group-hover:bg-[#E35D6A]/30 transition-colors">
                  <VideoPlayerIcon />
                </div>
                <h3 className="text-base font-bold text-[#7C444F] group-hover:text-[#E35D6A] transition-colors">AI 影院</h3>
                <p className="text-xs text-[#9B6A6C]">我们的电影</p>
              </Link>
            </BentoCard>
          </div>

          {/* 8. 私密日记 (1x1) */}
          <div className="col-span-1">
            <ModuleCard
              href="/diary"
              icon={HandDrawnBook}
              title="私密日记"
              desc="写给李丹"
              delay={0.8}
            />
          </div>

          {/* 9. 宠物专区 (1x1) */}
          <div className="col-span-1">
            <ModuleCard
              href="/pets"
              icon={HandDrawnPaw}
              title="宠物专区"
              desc="盼盼 & 石榴"
              delay={0.9}
            />
          </div>

          {/* 10. 成就勋章 (1x1) */}
          <div className="col-span-1">
            <ModuleCard
              href="/achievements"
              icon={HandDrawnTrophy}
              title="成就勋章"
              desc="专属纪念"
              delay={1.0}
            />
          </div>

          {/* 11. 愿望清单 (1x1) */}
          <div className="col-span-1">
            <ModuleCard
              href="/future"
              icon={HandDrawnStar}
              title="愿望清单"
              desc="未来计划"
              delay={1.1}
            />
          </div>

          {/* 12. 底部彩蛋卡片 (2x1) */}
          <div className="col-span-2">
            <BentoCard delay={1.2}>
              <div className="h-full flex items-center justify-center space-x-3">
                <span className="text-[#9B6A6C]">啾米啾米</span>
                <span className="animate-heartbeat"><SmallHeart className="w-5 h-5" /></span>
                <span className="text-[#9B6A6C]">米啾米啾</span>
              </div>
            </BentoCard>
          </div>
        </div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-center"
        >
          <p className="text-[#9B6A6C]/60 text-sm">
            在这个充满变数的世界里，我为你撑起一个永远恒温的小窝
          </p>
        </motion.div>
      </div>
    </div>
  );
}
