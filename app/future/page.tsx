'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// 手绘风格图标
const HandDrawnStar = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F8AD9D" fillOpacity="0.5" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HandDrawnRocket = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2c0 0-7 4-7 11v3l-2 2h18l-2-2v-3c0-7-7-11-7-11z" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" fill="#F8AD9D"/>
    <path d="M12 21v2M8 21v2M16 21v2" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F8AD9D" fillOpacity="0.4" stroke="#F8AD9D" strokeWidth="1.5"/>
  </svg>
);

const HandDrawnHome = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M3 12l9-9 9 9M5 10v10h14V10" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#F8AD9D" fillOpacity="0.2"/>
    <rect x="9" y="15" width="6" height="5" fill="#F8AD9D" fillOpacity="0.3"/>
  </svg>
);

const HandDrawnPlane = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M22 12h-6l-3-9-3 9H2l3 3v4l4-2 4 6 4-6 4 2v-4l3-3z" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HandDrawnCheck = ({ checked }: { checked: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {checked ? (
      <>
        <circle cx="12" cy="12" r="10" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5"/>
        <path d="M8 12l3 3 5-6" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ) : (
      <circle cx="12" cy="12" r="10" stroke="#F8AD9D" strokeWidth="1.5" strokeDasharray="4 2"/>
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

const wishes: Wish[] = [
  {
    id: '1',
    title: '事业进阶',
    description: '搞定 AI 项目和所有回款，给我们的生活换个更硬核的动力引擎。',
    icon: HandDrawnRocket,
    completed: false,
  },
  {
    id: '2',
    title: '全力支持',
    description: '陪你读完马来西亚 USM，那是你发光的舞台，而我会是你永远的头号粉丝。',
    icon: HandDrawnHeart,
    completed: false,
  },
  {
    id: '3',
    title: '终极小窝',
    description: '从租房到买房。我要给你买一套带超大落地窗的房子，让阳光铺满盼盼和石榴睡觉的地方。',
    icon: HandDrawnHome,
    completed: false,
  },
  {
    id: '4',
    title: '环球打卡',
    description: '等我回血，第一站我们就去亚庇看落日，然后是全世界。',
    icon: HandDrawnPlane,
    completed: false,
  },
];

export default function FuturePage() {
  const [wishList, setWishList] = useState(wishes);
  const completedCount = wishList.filter(w => w.completed).length;
  const progress = (completedCount / wishList.length) * 100;

  const toggleWish = (id: string) => {
    setWishList(wishList.map(wish =>
      wish.id === id ? { ...wish, completed: !wish.completed } : wish
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] pt-24 pb-12">
      {/* 装饰背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#F8AD9D]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FBC3B6]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <HandDrawnStar />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#5D4037] mb-2 font-handwriting">
            我们的未来清单
          </h1>
          <p className="text-[#8D6E63]">
            富裕且稳固的规划
          </p>

          {/* 进度 */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-[#8D6E63]">完成进度</span>
              <span className="text-[#F8AD9D] font-medium">{completedCount}/{wishList.length}</span>
            </div>
            <div className="h-3 bg-[#FFF0D4] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-[#F8AD9D] to-[#FBC3B6] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* 愿望列表 */}
        <div className="space-y-4">
          {wishList.map((wish, index) => {
            const Icon = wish.icon;
            return (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleWish(wish.id)}
                className="cursor-pointer"
              >
                <div className={`warm-card rounded-3xl p-6 transition-all ${
                  wish.completed ? 'opacity-60' : 'warm-card-hover'
                }`}>
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <HandDrawnCheck checked={wish.completed} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-medium ${wish.completed ? 'text-[#8D6E63] line-through' : 'text-[#5D4037]'}`}>
                          {wish.title}
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed ${wish.completed ? 'text-[#8D6E63]/60' : 'text-[#8D6E63]'}`}>
                        {wish.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-[#F8AD9D]/20 flex items-center justify-center flex-shrink-0">
                      <Icon />
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
          <div className="warm-card rounded-3xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 animate-heartbeat">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F8AD9D" stroke="#F8AD9D" strokeWidth="1.5"/>
              </svg>
            </div>
            <p className="text-[#5D4037] italic text-lg">
              "这个充满变数的世界里，我为你撑起一个永远恒温的小窝"
            </p>
            <p className="text-[#F8AD9D] text-sm mt-3 font-handwriting">
              —— 苏子钦
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
