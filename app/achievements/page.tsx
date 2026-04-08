'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import TimeMailbox from '@/components/TimeMailbox';

const HandDrawnTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke="#E35D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#E35D6A" fillOpacity="0.3"/>
    <path d="M7 4H5a2 2 0 00-2 2v1a3 3 0 003 3M17 4h2a2 2 0 012 2v1a3 3 0 01-3 3" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HandDrawnStar = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? "#E35D6A" : "none"}
      stroke="#E35D6A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HandDrawnMedal = ({ emoji }: { emoji: string }) => (
  <div className="w-16 h-16 rounded-2xl glass-card-highlight flex items-center justify-center text-3xl">
    {emoji}
  </div>
);

const achievements = [
  { id: '1', title: 'AA 创始人', description: '奖励那个初见时坚持AA的独立女孩', date: '2025.05.20', unlocked: true, rarity: 'legendary', emoji: '💰' },
  { id: '2', title: '轮椅上的公主', description: '奖励即使脚受伤了也陪我走完旅程的你', date: '2025.07.15', unlocked: true, rarity: 'epic', emoji: '👑' },
  { id: '3', title: '洗衣机终身守护者', description: '苏子钦专属：为你手洗内衣裤 365 天成就', date: '2025.09.01', unlocked: true, rarity: 'rare', emoji: '🧺' },
  { id: '4', title: '跨国异地通关', description: '跨越 2500 公里的思念，进度条 100%', date: '2026.02.01', unlocked: true, rarity: 'legendary', emoji: '✈️' },
  { id: '5', title: '惊艳一眼', description: '奖励那个在长水机场出口，一眼就惊艳了苏子钦的女孩', date: '2025.05.20', unlocked: true, rarity: 'legendary', emoji: '✨' },
  { id: '6', title: 'nomade游牧', description: '纪念我们在百色市、桂林码头基地旁边搭帐篷，像游牧民族一样的野趣经历', date: '2025.08', unlocked: true, rarity: 'epic', emoji: '⛺' },
  { id: '7', title: '茶山知己', description: '奖励那个陪苏子钦在景迈山古茶林里，品美食、看美景的女孩', date: '2025.10', unlocked: true, rarity: 'rare', emoji: '🍵' },
];

const rarityConfig = {
  legendary: { label: '传说', stars: 3, color: 'text-white drop-shadow-sm' },
  epic: { label: '史诗', stars: 2, color: 'text-white drop-shadow-sm' },
  rare: { label: '稀有', stars: 1, color: 'text-white drop-shadow-sm' },
  common: { label: '普通', stars: 0, color: 'text-white drop-shadow-sm' },
};

export default function AchievementsPage() {
  const [selectedMedal, setSelectedMedal] = useState<typeof achievements[0] | null>(null);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/achievements_bg.png?v=1')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/40 pointer-events-none" />
      <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-4"><HandDrawnTrophy /></div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-handwriting drop-shadow-lg">成就勋章</h1>
          <p className="text-white/90 drop-shadow-md">每一个勋章，都是我们爱情的见证</p>
          <div className="mt-8 inline-flex items-center space-x-6 px-6 py-3 glass-card rounded-full bg-white/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-white drop-shadow-md">{unlockedCount}</div>
              <div className="text-xs text-white/80 drop-shadow-sm">已解锁</div>
            </div>
            <div className="w-px h-8 bg-white/50" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white drop-shadow-md">{achievements.length}</div>
              <div className="text-xs text-white/80 drop-shadow-sm">总计</div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => {
            const rarity = rarityConfig[achievement.rarity as keyof typeof rarityConfig];
            return (
              <motion.div key={achievement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem' }}>
                  <div className="glass-card rounded-3xl p-6 glass-card-hover relative overflow-hidden cursor-pointer group bg-white/30"
                    onClick={() => setSelectedMedal(achievement)}
                  >
                    <div className="absolute top-4 right-4 flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <HandDrawnStar key={i} filled={i < rarity.stars} />
                      ))}
                    </div>

                    <div className="relative z-10 flex items-start space-x-4">
                      <HandDrawnMedal emoji={achievement.emoji} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-white drop-shadow-md">{achievement.title}</h3>
                          <span className={`px-3 py-0.5 rounded-full text-xs glass-card-highlight bg-white/20 ${rarity.color}`}>{rarity.label}</span>
                        </div>
                        <p className="text-white/80 drop-shadow-md mb-3">{achievement.description}</p>
                        {achievement.unlocked && (
                          <div className="flex items-center space-x-2 text-sm text-white drop-shadow-md">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E35D6A"/>
                            </svg>
                            <span>解锁于 {achievement.date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.01} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem' }}>
            <div className="glass-card rounded-3xl p-8 text-center bg-white/30">
              <div className="flex justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 animate-heartbeat">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E35D6A"/>
                </svg>
              </div>
              <p className="text-white text-lg mb-2 drop-shadow-md font-medium">"还有更多成就等着我们一起解锁"</p>
              <p className="text-white/90 drop-shadow-md">未来的路还很长，我们继续一起收集勋章</p>
            </div>
          </Tilt>
        </motion.div>

        {/* 时空信箱 - 关卡4入口 */}
        <TimeMailbox />
      </div>
    </div>
  </>
  );
}
