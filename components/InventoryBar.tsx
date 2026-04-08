'use client';

import { motion } from 'framer-motion';
import { useGame, TARGET_LETTERS } from '@/lib/game-context';
import { Lock, Sparkles, Backpack } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function InventoryBar() {
  const { collectedLetters, isAllLettersCollected, unlockedLevels } = useGame();
  const pathname = usePathname();

  // 只在首页显示，其他页面隐藏
  if (pathname !== '/') {
    return null;
  }

  // 8个空槽位
  const slots = Array(8).fill(null);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="max-w-2xl mx-auto px-4 pb-4">
        <div className="bg-white/40 backdrop-blur-md border-t border-white/60 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] rounded-2xl p-4 pointer-events-auto">
          {/* 标题和进度 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Backpack className="w-4 h-4 text-[#E35D6A]" />
              <span className="text-sm font-medium text-[#7C444F]">
                {unlockedLevels.length > 0 ? '时光碎片背包' : '收集光阴碎片'}
              </span>
            </div>
            <span className="text-xs text-[#9B6A6C]">
              {collectedLetters.length} / {TARGET_LETTERS.length}
            </span>
          </div>

          {/* 无序碎片背包 - 按收集顺序排列 */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            {slots.map((_, index) => {
              // 按收集顺序获取字母
              const letter = collectedLetters[index];
              const hasLetter = !!letter;

              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    scale: hasLetter ? 1 : 1,
                    backgroundColor: hasLetter ? 'rgba(227, 93, 106, 0.15)' : 'rgba(255, 255, 255, 0.5)',
                  }}
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hasLetter
                      ? 'border-2 border-[#E35D6A]/50 shadow-inner bg-gradient-to-br from-rose-50 to-amber-50'
                      : 'border-2 border-dashed border-[#9B6A6C]/30'
                  }`}
                >
                  {hasLetter ? (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      className="text-lg sm:text-xl font-bold text-[#E35D6A]"
                      style={{ textShadow: '0 0 10px rgba(227, 93, 106, 0.5)' }}
                    >
                      {letter.toUpperCase()}
                    </motion.span>
                  ) : (
                    <span className="text-[#9B6A6C]/30 text-sm">?</span>
                  )}

                  {/* 发光效果 */}
                  {hasLetter && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-[#E35D6A]/20 blur-sm"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 提示文字 */}
          {unlockedLevels.length === 0 && (
            <p className="text-center text-xs text-[#9B6A6C]/70 mt-2">
              在首页各处寻找隐藏的字母，按收集顺序放入背包
            </p>
          )}

          {/* 收集完成提示 */}
          {isAllLettersCollected && unlockedLevels.length === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs text-[#E35D6A] mt-2 font-medium"
            >
              背包已满！请重新排列这些字母拼出单词~
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
