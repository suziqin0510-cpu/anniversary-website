'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Letter, useGame } from '@/lib/game-context';

interface PolaroidFlipProps {
  frontImage: string;
  frontCaption: string;
  backText: string;
  rotate?: string;
  delay?: number;
  letterTrigger?: Letter; // 可选的字母触发器
}

export default function PolaroidFlip({
  frontImage,
  frontCaption,
  backText,
  rotate = '0deg',
  delay = 0,
  letterTrigger,
}: PolaroidFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast } = useGame();

  const handleLetterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (letterTrigger && !hasCollectedLetter(letterTrigger)) {
      collectLetter(letterTrigger);
      triggerLetterAnimation(letterTrigger, e.clientX, e.clientY);
      showToast(`发现字母 ${letterTrigger.toUpperCase()}！`, 'success');
    }
  };

  const showLetter = isFlipped && letterTrigger && !hasCollectedLetter(letterTrigger);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      // 第 1 层：透视容器 (严禁使用 absolute，必须有宽高比撑开高度)
      className="relative w-full aspect-[3/4] group cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 第 2 层：3D 翻转控制层 (必须 preserve-3d) */}
      <motion.div
        className="relative w-full h-full shadow-sm hover:shadow-md rounded-lg"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* 第 3 层 - 正面 (必须 absolute 且隐藏背面) */}
        <div
          className="absolute inset-0 w-full h-full bg-white/60 backdrop-blur-md border border-white/80 shadow-md rounded-xl p-2 pb-6"
          style={{
            transform: `rotate(${rotate})`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* 照片区域 - 固定比例 */}
          <div className="w-full aspect-square bg-rose-50/50 rounded-sm mb-2 overflow-hidden">
            <img
              src={frontImage}
              alt={frontCaption}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* 文字区域 */}
          <div className="flex-1 flex flex-col justify-center px-1">
            <h4 className="text-[11px] font-bold text-[#7C444F] leading-tight mb-1 truncate">
              {frontCaption}
            </h4>
          </div>

          {/* 翻转提示 */}
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs">↻</span>
          </div>
        </div>

        {/* 第 3 层 - 背面 (必须 absolute, rotateY-180 且隐藏背面) */}
        <div
          className="absolute inset-0 w-full h-full rounded-lg p-4 flex flex-col items-center justify-center"
          style={{
            transform: `rotate(${rotate}) rotateY(180deg)`,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '1px solid rgba(180, 160, 100, 0.3)',
          }}
        >
          {/* 旧纸张纹理效果 */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none rounded-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* 手写体文字 */}
          <div className="relative z-10 text-center overflow-y-auto max-h-full">
            <p
              className="text-[#8B4513] text-xs sm:text-sm leading-relaxed font-handwriting"
              style={{
                fontFamily: "'Ma Shan Zheng', cursive",
                textShadow: '0.5px 0.5px 0 rgba(139, 69, 19, 0.1)',
              }}
            >
              {backText || '大理的风很暖，你很甜'}
            </p>
          </div>

          {/* 装饰印章 */}
          <div className="absolute bottom-4 right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-red-400/50 flex items-center justify-center transform rotate-[-15deg]">
            <span className="text-[8px] sm:text-[10px] text-red-500/70 font-bold">S❤️L</span>
          </div>

          {/* 日期戳 */}
          <div className="absolute top-3 left-3 text-[9px] sm:text-[10px] text-[#8B4513]/50">
            2025.05.20
          </div>

          {/* 字母触发器 - 背面右下角微小字母 */}
          {showLetter && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleLetterClick}
              className="absolute bottom-2 right-2 text-[10px] text-[#8B4513]/40 cursor-pointer hover:text-[#E35D6A] hover:scale-150 transition-all"
              style={{ textShadow: '0 0 5px rgba(227, 93, 106, 0.5)' }}
            >
              {letterTrigger?.toLowerCase()}
            </motion.span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
