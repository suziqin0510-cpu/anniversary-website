'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Unlock, Sparkles, Star, Heart } from 'lucide-react';

const achievements = [
  {
    id: '1',
    title: 'AA 创始人',
    description: '奖励那个初见时坚持AA的独立女孩',
    date: '2025.05.20',
    unlocked: true,
    rarity: 'legendary',
    icon: '💰',
  },
  {
    id: '2',
    title: '轮椅上的公主',
    description: '奖励即使脚瘸了也陪我走完旅程的你',
    date: '2025.07.15',
    unlocked: true,
    rarity: 'epic',
    icon: '👑',
  },
  {
    id: '3',
    title: '洗衣机终身守护者',
    description: '苏子钦专属：洗内衣裤 365 天成就',
    date: '2025.09.01',
    unlocked: true,
    rarity: 'rare',
    icon: '🧺',
  },
  {
    id: '4',
    title: '跨国异地通关',
    description: '跨越 2500 公里的思念，进度条 100%',
    date: '2026.02.01',
    unlocked: true,
    rarity: 'legendary',
    icon: '✈️',
  },
];

const rarityConfig = {
  legendary: {
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/50',
    label: '传说',
    glow: 'shadow-yellow-500/50',
  },
  epic: {
    color: 'from-purple-400 to-pink-500',
    bg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/50',
    label: '史诗',
    glow: 'shadow-purple-500/50',
  },
  rare: {
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/50',
    label: '稀有',
    glow: 'shadow-blue-500/50',
  },
  common: {
    color: 'from-gray-400 to-gray-500',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    label: '普通',
    glow: 'shadow-gray-500/30',
  },
};

export default function AchievementsPage() {
  const [selectedMedal, setSelectedMedal] = useState<typeof achievements[0] | null>(null);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#0F0F13] pt-24 pb-12">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,165,116,0.1)_0%,_transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass-effect rounded-full mb-4">
            <Trophy className="w-4 h-4 text-[#D4A574]" />
            <span className="text-xs text-[#8A8A92] font-mono">ACHIEVEMENT_SYSTEM</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            成就勋章
          </h1>
          <p className="text-[#8A8A92]">
            每一个勋章，都是我们爱情的见证
          </p>

          {/* 统计 */}
          <div className="mt-8 inline-flex items-center space-x-6 px-6 py-3 glass-effect rounded-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D4A574]">{unlockedCount}</div>
              <div className="text-xs text-[#8A8A92]">已解锁</div>
            </div>
            <div className="w-px h-8 bg-[#2A2A32]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#8A8A92]">{achievements.length}</div>
              <div className="text-xs text-[#8A8A92]">总计</div>
            </div>
          </div>
        </motion.div>

        {/* 勋章展示 */}
        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => {
            const rarity = rarityConfig[achievement.rarity as keyof typeof rarityConfig];
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMedal(achievement)}
                className="cursor-pointer group"
              >
                <div className={`glass-effect rounded-2xl p-6 border ${rarity.border} hover:border-[#D4A574] transition-all relative overflow-hidden`}>
                  {/* 发光效果 */}
                  <div className={`absolute inset-0 ${rarity.bg} opacity-50`} />

                  <div className="relative z-10 flex items-start space-x-4">
                    {/* 勋章图标 */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rarity.color} flex items-center justify-center text-3xl shadow-lg ${rarity.glow}`}>
                      {achievement.icon}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-[#E8E8EC]">{achievement.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs bg-gradient-to-r ${rarity.color} text-white`}>
                          {rarity.label}
                        </span>
                      </div>
                      <p className="text-[#8A8A92] mb-3">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="flex items-center space-x-2 text-sm text-[#D4A574]">
                          <Unlock className="w-4 h-4" />
                          <span>解锁于 {achievement.date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 底部寄语 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="glass-effect rounded-2xl p-8 text-center">
            <Sparkles className="w-8 h-8 text-[#D4A574] mx-auto mb-4" />
            <p className="text-[#E8E8EC] text-lg mb-2">
              "还有更多成就等着我们一起解锁"
            </p>
            <p className="text-[#8A8A92]">
              未来的路还很长，我们继续一起收集勋章
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
