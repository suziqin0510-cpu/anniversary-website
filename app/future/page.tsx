'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, Terminal, Heart, PawPrint, Home, Plane, Sun } from 'lucide-react';

interface Wish {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'life' | 'pets';
  completed: boolean;
}

const wishes: Wish[] = [
  {
    id: '1',
    title: '在亚庇看一场最美的落日',
    description: '去马来西亚亚庇，看丹绒亚路海滩的日落',
    category: 'travel',
    completed: false,
  },
  {
    id: '2',
    title: '陪你读完 USM，接你风风光光回昆明',
    description: '等你在马来西亚理科大学毕业，我们一起回家',
    category: 'life',
    completed: false,
  },
  {
    id: '3',
    title: '换一套能看到海或者更大落地窗的房子',
    description: '属于我们的家，有盼盼和石榴的位置',
    category: 'life',
    completed: false,
  },
  {
    id: '4',
    title: '给盼盼找个伴，或者让它和石榴学会和平共处',
    description: '毛孩子们要和睦相处',
    category: 'pets',
    completed: false,
  },
];

const categoryIcons = {
  travel: Plane,
  life: Home,
  pets: PawPrint,
};

const categoryLabels = {
  travel: '旅行',
  life: '生活',
  pets: '宠物',
};

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
    <div className="min-h-screen bg-[#0F0F13] pt-24 pb-12">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,165,116,0.08)_0%,_transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass-effect rounded-full mb-4">
            <Star className="w-4 h-4 text-[#D4A574]" />
            <span className="text-xs text-[#8A8A92] font-mono">WISHLIST_DATA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            愿望清单
          </h1>
          <p className="text-[#8A8A92]">
            未来想和你一起完成的事
          </p>

          {/* 进度 */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-[#8A8A92]">完成进度</span>
              <span className="text-[#D4A574] font-mono">{completedCount}/{wishList.length}</span>
            </div>
            <div className="h-2 bg-[#1A1A1F] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-[#D4A574] to-[#E8843C] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* 愿望列表 */}
        <div className="space-y-4">
          {wishList.map((wish, index) => {
            const Icon = categoryIcons[wish.category];
            return (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleWish(wish.id)}
                className="cursor-pointer"
              >
                <div className={`glass-effect rounded-xl p-5 transition-all ${
                  wish.completed ? 'opacity-60' : 'hover:border-[#D4A574]/50'
                }`}>
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      wish.completed
                        ? 'bg-[#D4A574] border-[#D4A574]'
                        : 'border-[#D4A574]/30 hover:border-[#D4A574]'
                    }`}>
                      {wish.completed && <Check className="w-4 h-4 text-[#0F0F13]" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className={`text-lg font-medium ${wish.completed ? 'text-[#8A8A92] line-through' : 'text-[#E8E8EC]'}`}>
                          {wish.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-[#D4A574]/10 text-xs text-[#D4A574]">
                          {categoryLabels[wish.category]}
                        </span>
                      </div>
                      <p className={`text-sm ${wish.completed ? 'text-[#8A8A92]/60' : 'text-[#8A8A92]'}`}>
                        {wish.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-[#2A2A32] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#D4A574]" />
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
            <Heart className="w-6 h-6 text-[#D4A574] mx-auto mb-4" />
            <p className="text-[#E8E8EC] italic">
              "最好的爱情，是两个人一起慢慢实现彼此的梦想"
            </p>
            <p className="text-[#8A8A92] text-sm mt-2">
              这些愿望，我们一起完成
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
