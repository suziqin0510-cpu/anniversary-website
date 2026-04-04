'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

// 手绘风格心形
const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1.5"
    />
  </svg>
);

// 手绘风格锁
const HandDrawnLock = ({ locked }: { locked: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {locked ? (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5"/>
        <path d="M8 11V7a4 4 0 118 0v4" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5"/>
        <path d="M8 11V7a4 4 0 118 0v4" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
        <path d="M12 16l2 2M12 16l-2 2" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round"/>
      </>
    )}
  </svg>
);

export default function IntroPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const password = '啾米啾米';
  const response = '米啾米啾';

  // 显示欢迎内容
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (input === password) {
      setIsUnlocked(true);
      setShowError(false);
      setTimeout(() => {
        localStorage.setItem('authenticated', 'true');
        router.push('/');
      }, 2000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] flex items-center justify-center px-4 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#F8AD9D]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FBC3B6]/10 rounded-full blur-3xl" />

      {/* 手绘装饰 */}
      <div className="absolute top-32 right-20 opacity-20 animate-float">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="15" stroke="#F8AD9D" strokeWidth="2" strokeDasharray="4 2"/>
        </svg>
      </div>
      <div className="absolute bottom-32 left-20 opacity-20 animate-gentle-bounce">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F8AD9D"/>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* 卡片 */}
        <div className="warm-card rounded-3xl overflow-hidden">
          {/* 标题栏 */}
          <div className="bg-[#F8AD9D]/10 px-6 py-4 flex items-center justify-center border-b border-[#F8AD9D]/20">
            <div className="flex items-center space-x-2">
              <HandDrawnHeart />
              <span className="text-[#5D4037] font-medium">李丹专属通道</span>
            </div>
          </div>

          {/* 内容 */}
          <div className="p-8 space-y-6">
            {/* 欢迎语 */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#5D4037] mb-2 font-handwriting">欢迎来到我们的小窝</h2>
              <p className="text-[#8D6E63]">这里是专属于你和苏子钦的空间</p>
            </div>

            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* 密码提示 */}
                  <div className="flex items-center justify-center space-x-2 text-[#8D6E63]">
                    <HandDrawnLock locked={true} />
                    <span>请输入暗号...</span>
                  </div>

                  {/* 输入框 */}
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="输入暗号..."
                      className="w-full bg-[#FFFBF0] border border-[#F8AD9D]/30 rounded-2xl py-4 pl-5 pr-12 text-[#5D4037] placeholder-[#8D6E63]/50 focus:border-[#F8AD9D] focus:outline-none focus:ring-2 focus:ring-[#F8AD9D]/20 transition-all text-center"
                      autoFocus
                    />
                    <button
                      onClick={handleSubmit}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#F8AD9D] hover:text-[#FBC3B6] transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* 错误提示 */}
                  <AnimatePresence>
                    {showError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm text-center"
                      >
                        <span>暗号不对哦，再想想~</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 提示 */}
                  <p className="text-xs text-[#8D6E63]/60 text-center">
                    💡 提示：这是只有你们两个人知道的暗号
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto bg-[#F8AD9D]/20 rounded-full flex items-center justify-center"
                  >
                    <HandDrawnLock locked={false} />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-[#F8AD9D] text-2xl font-handwriting">{response}</p>
                    <p className="text-[#8D6E63] text-sm">身份验证通过</p>
                    <p className="text-[#5D4037]">正在进入我们的小窝...</p>
                  </div>
                  <div className="flex justify-center">
                    <HandDrawnHeart />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 text-[#8D6E63]/60 text-sm">
            <span>啾米啾米</span>
            <span className="text-[#F8AD9D] animate-heartbeat">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F8AD9D"/>
              </svg>
            </span>
            <span>米啾米啾</span>
          </div>
          <p className="text-[#8D6E63]/40 text-xs mt-2">始于 2025.05.20</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
