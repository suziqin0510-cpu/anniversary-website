'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDaysTogether } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// 手绘风格心形
const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1.5"
    />
  </svg>
);

// 隐藏彩蛋弹窗
const SecretModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="glass-card rounded-3xl max-w-md w-full p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="white"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#7C444F] mb-2">我们的秘密暗号</h3>
          <p className="text-[#9B6A6C] text-sm mb-6">被你发现了！这是我们的第一个纪念日...</p>

          <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-2xl p-6 mb-6">
            <p className="text-[#E35D6A] font-bold text-lg mb-2">2025年5月20日</p>
            <p className="text-[#7C444F] text-sm">长水机场的初见，袁老四的火锅</p>
            <p className="text-[#9B6A6C] text-xs mt-2 italic">"从那一刻起，我们的故事开始了"</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#E35D6A] text-white rounded-xl font-medium hover:bg-[#d54d5a] transition-colors"
          >
            我会永远记得 💕
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// 飞机密码线索弹窗
const PlaneClueModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative bg-gradient-to-br from-sky-100 to-blue-50 rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl border border-sky-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 飞机装饰 */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            ✈️
          </motion.div>

          <h3 className="text-2xl font-bold text-[#7C444F] mb-3">恭喜你！</h3>
          <p className="text-[#9B6A6C] text-sm mb-4">
            你找到了全部密码线索！
          </p>

          <div className="bg-white/70 rounded-2xl p-4 mb-6">
            <p className="text-[#7C444F] text-sm mb-2">四个印记已集齐：</p>
            <div className="flex justify-center space-x-3 text-2xl">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >🍲</motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >🏔️</motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >🐱</motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sky-500"
              >✈️</motion.span>
            </div>
          </div>

          <p className="text-[#E35D6A] font-medium text-sm mb-4">
            快快解锁下一章吧！
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl font-medium shadow-lg"
          >
            去解锁！🔓
          </motion.button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Footer() {
  const days = calculateDaysTogether();
  const [showSecret, setShowSecret] = useState(false);
  const [showPlane, setShowPlane] = useState(false);
  const [showPlaneClue, setShowPlaneClue] = useState(false);
  const pathname = usePathname();

  // 判断是否在时间线页面
  const isTimelinePage = pathname?.startsWith('/timeline');

  return (
    <>
      <SecretModal isOpen={showSecret} onClose={() => setShowSecret(false)} />
      <PlaneClueModal isOpen={showPlaneClue} onClose={() => setShowPlaneClue(false)} />

      <footer className="bg-gradient-to-t from-[#F8AD9D]/10 to-transparent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo - 点击名字出现飞机 */}
            <div className="flex items-center space-x-2 relative">
              <HandDrawnHeart />
              <span
                className="font-handwriting text-lg text-[#5D4037] cursor-pointer hover:text-[#E35D6A] transition-colors select-none"
                onClick={() => {
                  // 在时间线页面点击名字才显示飞机
                  if (isTimelinePage) {
                    setShowPlane(true);
                  }
                }}
              >
                苏子钦 & 李丹
              </span>

              {/* 飞机图标 - 点击名字后出现 */}
              <AnimatePresence>
                {showPlane && isTimelinePage && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPlaneClue(true)}
                    className="absolute -right-10 top-1/2 -translate-y-1/2 text-2xl cursor-pointer z-10"
                    title="点击我！"
                  >
                    ✈️
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Days Counter */}
            <p className="text-sm text-[#8D6E63]">
              在一起 <span className="text-[#F8AD9D] font-semibold">{days}</span> 天
            </p>

            {/* Quote */}
            <p className="text-xs text-[#8D6E63]/60 italic max-w-md text-center">
              "你可以永远不用长大，我会一直在这里，陪你作，陪你笑"
            </p>

            {/* Copyright */}
            <p className="text-xs text-[#8D6E63]/40 mt-4">
              Made with  for 李丹
            </p>

            {/* 暗号 + 隐藏彩蛋按钮 */}
            <div className="flex items-center space-x-2 text-[#8D6E63]/40 text-xs mt-2 relative">
              <span>啾米啾米</span>
              <span className="text-[#F8AD9D]">♥</span>
              <span>米啾米啾</span>

              {/* 隐藏彩蛋按钮 - 20%透明度极小按钮 */}
              <button
                onClick={() => setShowSecret(true)}
                className="absolute -right-8 w-4 h-4 rounded-full bg-[#E35D6A]/20 hover:bg-[#E35D6A]/40 transition-colors cursor-pointer"
                aria-label="秘密彩蛋"
                title="发现了我？"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
