'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Sparkles, Lock, ArrowRight, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FinalPuzzleModal() {
  const { showPuzzleModal, setShowPuzzleModal, unlockLevel, collectedLetters, showToast, isHydrated } = useGame();
  const [inputValue, setInputValue] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦输入框
  useEffect(() => {
    if (showPuzzleModal && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [showPuzzleModal]);

  // 清除错误状态
  useEffect(() => {
    if (isWrong) {
      const timer = setTimeout(() => setIsWrong(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isWrong]);

  const handleSubmit = () => {
    const answer = inputValue.trim().toLowerCase();
    if (answer === 'euphoria') {
      setIsSuccess(true);
      showToast('解锁成功！正在开启时光之门...', 'success');

      // 播放撒花特效
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#E35D6A', '#F4A460', '#FFD700', '#FF6B6B'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#E35D6A', '#F4A460', '#FFD700', '#FF6B6B'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // 延迟解锁并跳转
      setTimeout(() => {
        unlockLevel(1);
        setShowPuzzleModal(false);
        // 平滑滚动到时间线
        window.location.href = '/timeline';
      }, 2000);
    } else {
      setIsWrong(true);
      showToast('不对哦，再想想～用这8个字母拼出幸福的单词 ✨', 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 处理输入框点击，确保获得焦点
  const handleInputClick = () => {
    inputRef.current?.focus();
  };

  if (!isHydrated) return null;

  return (
    <AnimatePresence>
      {showPuzzleModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4"
          style={{ pointerEvents: 'auto' }}
          onClick={() => {}} // 点击背景不关闭
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 装饰背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-transparent to-amber-50/50 pointer-events-none" />

            {/* 顶部装饰 */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E35D6A] via-[#F4A460] to-[#E35D6A]" />

            {/* 内容 */}
            <div className="relative p-8">
              {/* 图标 */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E35D6A]/20 to-[#F4A460]/20 flex items-center justify-center"
                >
                  {isSuccess ? (
                    <Sparkles className="w-10 h-10 text-[#E35D6A]" />
                  ) : (
                    <Lock className="w-10 h-10 text-[#E35D6A]" />
                  )}
                </motion.div>
              </div>

              {/* 标题 */}
              <h2 className="text-2xl font-bold text-center text-[#7C444F] mb-2">
                {isSuccess ? '解锁成功！' : '碎片已集齐！'}
              </h2>

              {/* 提示 */}
              <p className="text-center text-[#9B6A6C] mb-6">
                {isSuccess
                  ? '时光之门已开启，让我们重温那些美好回忆...'
                  : '和幸福有关的单词，请重新排列这些字母并输入拼写 ✨'}
              </p>

              {/* 已收集字母展示 - 按收集顺序，乱序显示 */}
              {!isSuccess && (
                <>
                  <div className="flex justify-center mb-2">
                    <div className="flex items-center space-x-2 text-[#9B6A6C] text-sm">
                      <Shuffle className="w-4 h-4" />
                      <span>收集顺序（乱序）</span>
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="flex items-center space-x-2 bg-[#FFF5F5] rounded-xl px-4 py-3">
                      {collectedLetters.map((letter, index) => (
                        <motion.span
                          key={`${letter}-${index}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="w-8 h-8 rounded-lg bg-white border border-[#E35D6A]/30 flex items-center justify-center text-lg font-bold text-[#E35D6A]"
                        >
                          {letter.toUpperCase()}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* 输入框 */}
                  <div className="relative mb-4" style={{ zIndex: 30 }}>
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onClick={handleInputClick}
                      placeholder="请输入单词..."
                      disabled={isSuccess}
                      readOnly={false}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-medium uppercase tracking-widest transition-all ${
                        isWrong
                          ? 'border-red-400 bg-red-50 text-red-500 animate-shake'
                          : isSuccess
                          ? 'border-green-400 bg-green-50 text-green-600'
                          : 'border-[#E35D6A]/30 focus:border-[#E35D6A] focus:outline-none bg-white'
                      }`}
                    />
                    {isSuccess && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <Sparkles className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>

                  {/* 提交按钮 */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSuccess || inputValue.trim().length === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                      isSuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white hover:shadow-lg'
                    }`}
                  >
                    <span>{isSuccess ? '解锁成功！' : '解锁时光之门'}</span>
                    {!isSuccess && <ArrowRight className="w-4 h-4" />}
                  </motion.button>

                  {/* 提示 */}
                  <p className="text-center text-xs text-[#9B6A6C]/60 mt-4">
                    提示：用背包里的 8 个字母重新排列，拼出和幸福有关的单词
                  </p>
                </>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center space-x-2 text-green-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">正在进入时间线...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
