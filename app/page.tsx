'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { calculateDaysTogether } from '@/lib/utils';

// 手绘风格图标组件
const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(248,173,157,0.3))' }}
    />
  </svg>
);

const HandDrawnClock = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <circle cx="12" cy="12" r="9" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M12 7v5l3 3" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnMap = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" fill="#F8AD9D" fillOpacity="0.3" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="9" r="2" fill="#F8AD9D" />
  </svg>
);

const HandDrawnTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4H5a2 2 0 00-2 2v1a3 3 0 003 3M17 4h2a2 2 0 012 2v1a3 3 0 01-3 3" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnStar = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F8AD9D" fillOpacity="0.4" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandDrawnBook = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#F8AD9D" fillOpacity="0.2" />
  </svg>
);

const HandDrawnPaw = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <ellipse cx="12" cy="15" rx="4" ry="3.5" fill="#F8AD9D" fillOpacity="0.3" stroke="#5D4037" strokeWidth="1.5" />
    <ellipse cx="6.5" cy="9" rx="2" ry="2.5" fill="#F8AD9D" fillOpacity="0.4" stroke="#5D4037" strokeWidth="1.5" />
    <ellipse cx="12" cy="6" rx="2" ry="2.5" fill="#F8AD9D" fillOpacity="0.4" stroke="#5D4037" strokeWidth="1.5" />
    <ellipse cx="17.5" cy="9" rx="2" ry="2.5" fill="#F8AD9D" fillOpacity="0.4" stroke="#5D4037" strokeWidth="1.5" />
  </svg>
);

const HandDrawnSparkles = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="#F8AD9D" />
  </svg>
);

export default function HomePage() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    setDays(calculateDaysTogether());
  }, []);

  const welcomeQuote = `李丹，欢迎来到我们的小窝。
这里没有赛博朋克，只有冬日暖阳。
365 天里，每一秒都真实存在着苏子钦。
你可以永远不用长大，我会一直在这里，陪你作，陪你笑。`;

  const modules = [
    { name: '时间线', href: '/timeline', desc: '我们的故事', icon: HandDrawnClock },
    { name: '足迹地图', href: '/map', desc: '一起去过的地方', icon: HandDrawnMap },
    { name: '成就勋章', href: '/achievements', desc: '专属纪念', icon: HandDrawnTrophy },
    { name: '愿望清单', href: '/future', desc: '未来计划', icon: HandDrawnStar },
    { name: '私密日记', href: '/diary', desc: '写给李丹', icon: HandDrawnBook },
    { name: '宠物专区', href: '/pets', desc: '盼盼 & 石榴', icon: HandDrawnPaw },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F8AD9D]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FBC3B6]/10 rounded-full blur-3xl" />

      {/* 手绘风格装饰元素 */}
      <div className="absolute top-20 left-10 animate-float opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="15" stroke="#F8AD9D" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
      </div>
      <div className="absolute top-40 right-20 animate-gentle-bounce opacity-20">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F8AD9D" />
        </svg>
      </div>

      {/* 内容 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* 头部 */}
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
            <span className="text-[#F8AD9D] animate-heartbeat">
              <HandDrawnHeart />
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-[#5D4037] mb-4 font-handwriting">
            苏子钦 & 李丹
          </h1>

          <p className="text-lg text-[#8D6E63] mb-6 font-light">
            冬日暖阳 · 愈系日记
          </p>

          <div className="inline-flex items-center space-x-3 px-6 py-3 warm-card rounded-full">
            <span className="text-[#F8AD9D] animate-heartbeat">
              <HandDrawnHeart />
            </span>
            <span className="text-[#5D4037]">
              在一起 <span className="text-[#F8AD9D] font-bold text-xl">{days}</span> 天
            </span>
            <span className="text-[#F8AD9D] animate-heartbeat">
              <HandDrawnHeart />
            </span>
          </div>
        </motion.div>

        {/* 开场寄语卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="warm-card p-8 relative overflow-hidden warm-card-hover">
            {/* 手绘边框装饰 */}
            <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[#F8AD9D]/40 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-[#F8AD9D]/40 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-[#F8AD9D]/40 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[#F8AD9D]/40 rounded-br-lg" />

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F8AD9D]/20 flex items-center justify-center flex-shrink-0">
                <HandDrawnSparkles />
              </div>

              <div className="space-y-4">
                <p className="text-[#5D4037] leading-relaxed whitespace-pre-line font-light text-lg">
                  {welcomeQuote}
                </p>

                <div className="flex items-center space-x-2 text-[#F8AD9D] text-sm">
                  <span>—</span>
                  <span className="font-handwriting text-lg">苏子钦</span>
                  <span className="text-[#8D6E63]">|</span>
                  <span className="text-[#8D6E63]">始于 2025.05.20</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 功能模块网格 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link href={module.href}>
                    <div className="warm-card rounded-3xl p-6 warm-card-hover cursor-pointer h-full group">
                      <div className="w-12 h-12 rounded-2xl bg-[#F8AD9D]/20 flex items-center justify-center mb-4 group-hover:bg-[#F8AD9D]/30 transition-colors">
                        <Icon />
                      </div>

                      <h3 className="text-lg font-medium text-[#5D4037] mb-1 group-hover:text-[#F8AD9D] transition-colors">
                        {module.name}
                      </h3>

                      <p className="text-xs text-[#8D6E63]">
                        {module.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 text-[#8D6E63]/60 text-sm">
            <span>啾米啾米</span>
            <span className="text-[#F8AD9D]">♥</span>
            <span>米啾米啾</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
