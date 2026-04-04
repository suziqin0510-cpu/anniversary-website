'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// 手绘风格心形
const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1.5"
    />
  </svg>
);

// 手绘风格云朵
const HandDrawnCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-20 h-20 opacity-20">
    <path d="M17 19c2.8 0 5-2.2 5-5s-2.2-5-5-5c-.3 0-.6 0-.9.1C15.3 6.2 13.3 5 11 5c-3.3 0-6 2.7-6 6-.5.3-1 .7-1.4 1.2C2.5 13.3 2 14.6 2 16c0 2.8 2.2 5 5 5h10z" fill="#F8AD9D" stroke="#F8AD9D" strokeWidth="1"/>
  </svg>
);

export default function MonologuePage() {
  const monologue = `李丹，其实我有过压力。

在你眼里我似乎什么都能搞定，但其实我也有焦虑回款、深夜死磕 AI 的时候。但我从没想过让你跟着操心。

我知道你爱说气话，爱试探我，那是因为你太在乎。

我大你 8 岁，这 8 年的阅历不是为了让我对你讲道理，而是为了让我有足够的肩膀，在这个充满变数的世界里，为你撑起一个永远恒温的小窝。

你可以永远不用长大，我会一直在这里，陪你作，陪你笑。`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] pt-24 pb-12 overflow-hidden relative">
      {/* 装饰背景 */}
      <div className="absolute top-20 left-10">
        <HandDrawnCloud />
      </div>
      <div className="absolute bottom-40 right-10">
        <HandDrawnCloud />
      </div>
      <div className="absolute top-1/3 right-20 w-32 h-32 bg-[#F8AD9D]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 left-20 w-48 h-48 bg-[#FBC3B6]/10 rounded-full blur-2xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="animate-heartbeat">
              <HandDrawnHeart />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#5D4037] mb-2 font-handwriting">
            苏子钦的内心独白
          </h1>
          <p className="text-[#8D6E63]">写给李丹的话</p>
        </motion.div>

        {/* 独白卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="warm-card rounded-3xl p-8 md:p-12 relative"
        >
          {/* 装饰角落 */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[#F8AD9D]/40 rounded-tl-xl" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-[#F8AD9D]/40 rounded-tr-xl" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-[#F8AD9D]/40 rounded-bl-xl" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[#F8AD9D]/40 rounded-br-xl" />

          {/* 开头引号 */}
          <div className="mb-8">
            <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-[#F8AD9D]/30">
              <path d="M4 10c0-3 2-5 5-5v3c-1 0-2 1-2 2v1h3v7H4v-8zM13 10c0-3 2-5 5-5v3c-1 0-2 1-2 2v1h3v7h-6v-8z" fill="currentColor"/>
            </svg>
          </div>

          {/* 独白内容 */}
          <div className="space-y-6">
            {monologue.split('\n\n').map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`text-lg md:text-xl leading-relaxed ${
                  index === 0 || index === monologue.split('\n\n').length - 1
                    ? 'text-[#F8AD9D] font-medium'
                    : 'text-[#5D4037]'
                }`}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* 结尾引号 */}
          <div className="mt-8 flex justify-end">
            <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-[#F8AD9D]/30">
              <path d="M20 14c0 3-2 5-5 5v-3c1 0 2-1 2-2v-1h-3v-7h6v8zM11 14c0 3-2 5-5 5v-3c1 0 2-1 2-2v-1H5v-7h6v8z" fill="currentColor"/>
            </svg>
          </div>

          {/* 署名 */}
          <div className="mt-8 text-right">
            <p className="text-[#8D6E63]">—— 永远爱你的</p>
            <p className="text-[#F8AD9D] font-handwriting text-2xl mt-1">苏子钦</p>
          </div>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <Link href="/">
            <button className="px-8 py-3 warm-card warm-card-hover rounded-full text-[#5D4037] hover:text-[#F8AD9D] transition-colors">
              返回首页
            </button>
          </Link>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-3 text-[#8D6E63]/60 text-sm">
            <span>你可以永远不用长大</span>
            <span className="text-[#F8AD9D] animate-heartbeat">
              <HandDrawnHeart />
            </span>
            <span>我会一直在这里</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
