'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Terminal, Heart, Sparkles, Clock, MapPin, BookOpen, Star, Trophy } from 'lucide-react';
import { calculateDaysTogether } from '@/lib/utils';

export default function HomePage() {
  const [days, setDays] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    setDays(calculateDaysTogether());
    const timer = setTimeout(() => setTypingComplete(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const welcomeQuote = `李丹，欢迎来到我们的赛博空间。
这里没有时差，没有争吵，
只有 365 天里每一秒都真实存在的苏子钦。
密码是我们的暗号，而这个网页，
是我给你的一颗定心丸。`;

  const modules = [
    {
      name: '时间线',
      href: '/timeline',
      desc: 'OUR STORY',
      icon: Clock,
      color: 'from-[#D4A574] to-[#E8843C]',
    },
    {
      name: '足迹地图',
      href: '/map',
      desc: 'LOCATIONS',
      icon: MapPin,
      color: 'from-[#E8843C] to-[#D4A574]',
    },
    {
      name: '成就勋章',
      href: '/achievements',
      desc: 'MEDALS',
      icon: Trophy,
      color: 'from-[#D4A574] to-[#F4A460]',
    },
    {
      name: '愿望清单',
      href: '/future',
      desc: 'WISHLIST',
      icon: Star,
      color: 'from-[#E8843C] to-[#F4A460]',
    },
    {
      name: '私密日记',
      href: '/diary',
      desc: 'LETTERS',
      icon: BookOpen,
      color: 'from-[#D4A574] to-[#E8843C]',
    },
    {
      name: '宠物专区',
      href: '/pets',
      desc: 'PANPAN & SHILIU',
      icon: Heart,
      color: 'from-[#E8843C] to-[#D4A574]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F13] relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,165,116,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(212,165,116,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,165,116,0.1)_1px,transparent_1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* 发光装饰 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E8843C]/5 rounded-full blur-3xl" />

      {/* 内容 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-[#D4A574]" />
            <span className="text-xs text-[#8A8A92] font-mono tracking-wider">SYSTEM.ONLINE</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gradient-gold mb-4">
            苏子钦 & 李丹
          </h1>

          <p className="text-xl text-[#8A8A92] font-mono mb-2">
            CYBERSPACE v1.0
          </p>

          <div className="inline-flex items-center space-x-3 px-6 py-3 glass-effect rounded-full">
            <Heart className="w-5 h-5 text-[#D4A574] fill-[#D4A574]" />
            <span className="text-[#E8E8EC]">
              已连接 <span className="text-[#D4A574] font-mono text-xl">{days}</span> 天
            </span>
            <Heart className="w-5 h-5 text-[#D4A574] fill-[#D4A574]" />
          </div>
        </motion.div>

        {/* 开场寄语卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="glass-effect rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A574] to-transparent" />

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 flex items-center justify-center flex-shrink-0 border border-[#D4A574]/30">
                <Sparkles className="w-5 h-5 text-[#D4A574]" />
              </div>

              <div className="space-y-4">
                <p className="text-[#E8E8EC] leading-relaxed whitespace-pre-line font-light text-lg">
                  {welcomeQuote}
                </p>

                <div className="flex items-center space-x-2 text-[#D4A574]/60 text-sm font-mono">
                  <span>—</span>
                  <span>苏子钦</span>
                  <span className="text-[#8A8A92]">|</span>
                  <span>EST. 2025.05.20</span>
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
                    <div className="glass-effect rounded-xl p-6 hover:border-[#D4A574]/50 transition-all group cursor-pointer h-full">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="text-lg font-medium text-[#E8E8EC] mb-1 group-hover:text-[#D4A574] transition-colors">
                        {module.name}
                      </h3>

                      <p className="text-xs text-[#8A8A92] font-mono">
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
          <div className="inline-flex items-center space-x-4 text-[#8A8A92]/40 text-xs font-mono">
            <span>SYSTEM.STATUS: ONLINE</span>
            <span className="text-[#D4A574]/40">|</span>
            <span>ENCRYPTION: ENABLED</span>
            <span className="text-[#D4A574]/40">|</span>
            <span className="text-[#D4A574]">啾米啾米 ← → 米啾米啾</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
