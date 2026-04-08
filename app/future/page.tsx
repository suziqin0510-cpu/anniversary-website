'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import SoulQuiz from '@/components/SoulQuiz';

const HandDrawnStar = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E35D6A" fillOpacity="0.5" stroke="#E35D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HandDrawnCheck = ({ checked }: { checked: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {checked ? (
      <>
        <circle cx="12" cy="12" r="10" fill="#E35D6A" fillOpacity="0.3" stroke="#E35D6A" strokeWidth="1.5"/>
        <path d="M8 12l3 3 5-6" stroke="#7C444F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ) : (
      <circle cx="12" cy="12" r="10" stroke="#E35D6A" strokeWidth="1.5" strokeDasharray="4 2"/>
    )}
  </svg>
);

interface Wish {
  id: string;
  title: string;
  description: string;
  icon: () => React.ReactElement;
  completed: boolean;
}

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2c0 0-7 4-7 11v3l-2 2h18l-2-2v-3c0-7-7-11-7-11z" fill="#E35D6A" fillOpacity="0.3" stroke="#E35D6A" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill="#E35D6A"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E35D6A" fillOpacity="0.4" stroke="#E35D6A" strokeWidth="1.5"/>
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M3 12l9-9 9 9M5 10v10h14V10" stroke="#E35D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#E35D6A" fillOpacity="0.2"/>
  </svg>
);

const RingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <circle cx="12" cy="12" r="8" stroke="#E35D6A" strokeWidth="1.5" fill="#E35D6A" fillOpacity="0.2"/>
    <circle cx="12" cy="12" r="3" fill="#E35D6A"/>
  </svg>
);

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M22 12h-6l-3-9-3 9H2l3 3v4l4-2 4 6 4-6 4 2v-4l3-3z" fill="#E35D6A" fillOpacity="0.3" stroke="#E35D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BeachIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M2 16c3-2 7-2 10 0s7 2 10 0" stroke="#E35D6A" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="6" r="3" fill="#E35D6A" fillOpacity="0.4" stroke="#E35D6A" strokeWidth="1"/>
    <path d="M2 20h20" stroke="#E35D6A" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HoneymoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E35D6A" fillOpacity="0.3" stroke="#E35D6A" strokeWidth="1.5"/>
    <circle cx="12" cy="10" r="2" fill="#E35D6A"/>
  </svg>
);

const wishes: Wish[] = [
  { id: '1', title: '事业进阶', description: '搞定 AI 项目和所有回款，给我们的生活换个更硬核的动力引擎。', icon: RocketIcon, completed: false },
  { id: '2', title: '全力支持', description: '陪你读完马来西亚 USM，那是你发光的舞台，而我会是你永远的头号粉丝。', icon: HeartIcon, completed: false },
  { id: '3', title: '终极小窝', description: '从租房到买房。我要给你买一套带超大落地窗的房子，让阳光铺满盼盼和石榴睡觉的地方。', icon: HomeIcon, completed: false },
  { id: '4', title: '亚庇海滩婚礼测试', description: '等我们学成归来，在亚庇看落日的时候，先在海滩上彩排一场只属于我们四个（还有盼盼和石榴）的小婚礼。', icon: BeachIcon, completed: false },
  { id: '5', title: "一起领'红本本'", description: "搞定所有事业后，我们要手牵手去民政局，把你从'小公主'变成'苏太太'。", icon: RingIcon, completed: false },
  { id: '6', title: '环球蜜月之旅', description: '结婚后，我要带你去世界打卡，把我们的小窝从昆明铺向地球的每一个角落。', icon: HoneymoonIcon, completed: false },
  { id: '7', title: '环球打卡', description: '等我回血，第一站我们就去亚庇看落日，然后是全世界。', icon: PlaneIcon, completed: false },
];

export default function FuturePage() {
  const [wishList, setWishList] = useState(wishes);
  const completedCount = wishList.filter(w => w.completed).length;
  const progress = (completedCount / wishList.length) * 100;

  const toggleWish = (id: string) => {
    setWishList(wishList.map(wish => wish.id === id ? { ...wish, completed: !wish.completed } : wish));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/future_bg.png?v=2')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/40 pointer-events-none" />
      <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-4"><HandDrawnStar /></div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-handwriting drop-shadow-lg">我们的未来清单</h1>
          <p className="text-white/90 drop-shadow-md">富裕且稳固的规划</p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-white/90 drop-shadow-md">完成进度</span>
              <span className="text-white drop-shadow-md font-medium">{completedCount}/{wishList.length}</span>
            </div>
            <div className="h-3 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden border border-white/50">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-gradient-to-r from-[#E35D6A] to-[#F4A460] rounded-full" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {wishList.map((wish, index) => {
            const Icon = wish.icon;
            return (
              <motion.div key={wish.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => toggleWish(wish.id)} className="cursor-pointer"
              >
                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.01} glareEnable={false} style={{ borderRadius: '1.5rem' }}
                >
                  <div className={`glass-card rounded-3xl p-6 transition-all bg-white/20 ${wish.completed ? 'opacity-60' : 'glass-card-hover'}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1"><HandDrawnCheck checked={wish.completed} /></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-lg font-medium drop-shadow-md ${wish.completed ? 'text-white/60 line-through' : 'text-white'}`}>{wish.title}</h3>
                        </div>
                        <p className={`text-sm leading-relaxed drop-shadow-md ${wish.completed ? 'text-white/50' : 'text-white/90'}`}>{wish.description}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl glass-card-highlight bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Icon />
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.01} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem' }}
          >
            <div className="glass-card rounded-3xl p-8 text-center bg-white/20">
              <div className="flex justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 animate-heartbeat">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E35D6A" stroke="#E35D6A" strokeWidth="1.5"/>
                </svg>
              </div>
              <p className="text-white italic text-lg drop-shadow-md font-medium">"在这个充满变数的世界里，我为你撑起一个永远恒温的小窝"</p>
              <p className="text-white/90 text-sm mt-3 font-handwriting drop-shadow-md">—— 苏子钦</p>
            </div>
          </Tilt>
        </motion.div>

        {/* 关卡5：灵魂拷问 - 解锁私密日记 */}
        <SoulQuiz />
      </div>
    </div>
  </>
  );
}
