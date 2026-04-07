'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Sparkles } from 'lucide-react';

// 设定解锁日期：2027年6月7日（李丹毕业日）
const UNLOCK_DATE = new Date('2027-06-07T00:00:00');

export default function TimeCapsule() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shake, setShake] = useState(false);

  // 计算剩余时间
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const unlockTime = UNLOCK_DATE.getTime();
      const diff = unlockTime - now;

      if (diff <= 0) {
        setIsUnlocked(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    if (isUnlocked) {
      setIsOpen(true);
    } else {
      // 触发摇晃动画
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <>
      {/* 时光胶囊卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleClick}
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center group"
          >
            {/* 信封图标 */}
            <span className="text-3xl">✉️</span>

            {/* 锁图标 */}
            {!isUnlocked && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                <Lock className="w-3 h-3 text-white" />
              </div>
            )}

            {/* 解锁闪光 */}
            {isUnlocked && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-amber-400"
              />
            )}
          </motion.button>

          <div className="flex-1">
            <h3 className="font-bold text-[#7C444F]">给未来李丹的信</h3>
            <p className="text-xs text-[#9B6A6C] mt-1">
              {isUnlocked ? (
                <span className="text-green-600">✨ 点击开启时光胶囊</span>
              ) : (
                <span>锁定中 · 距离解锁还有</span>
              )}
            </p>

            {/* 倒计时显示 */}
            {!isUnlocked && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-lg font-mono font-bold text-[#E35D6A]">
                  {String(timeLeft.days).padStart(3, '0')}
                </span>
                <span className="text-xs text-[#9B6A6C]">天</span>
                <span className="text-lg font-mono font-bold text-[#E35D6A]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs text-[#9B6A6C]">时</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 模态框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="relative bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-rose-100 flex items-center justify-center text-[#7C444F]"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 信件内容 */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-rose-200 mb-4"
                >
                  <Sparkles className="w-8 h-8 text-amber-600" />
                </motion.div>
                <h2 className="text-2xl font-handwriting text-[#7C444F] mb-2">给未来李丹的信</h2>
                <p className="text-xs text-[#9B6A6C]">写于 2026年4月 · 开启于 2027年6月7日</p>
              </div>

              <div className="bg-white/60 rounded-2xl p-6 space-y-4 text-[#7C444F] leading-relaxed">
                <p>亲爱的李丹：</p>
                <p>
                  当你读到这封信时，你应该已经大学毕业了。时间过得真快，从我们相识到现在，已经走过了这么长的路。
                </p>
                <p>
                  我希望那时的我们依然相爱，依然会为对方准备小惊喜，依然会在深夜聊天到不想睡觉。
                </p>
                <p>
                  无论未来的路有多么艰难，请记住：苏子钦永远爱你。
                </p>
                <p className="text-right mt-6 font-handwriting text-lg">
                  永远爱你的<br />苏子钦
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 未解锁提示 */}
      <AnimatePresence>
        {shake && !isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-1/3 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-300 text-amber-800 px-6 py-3 rounded-full shadow-lg z-[200]"
          >
            <p className="text-sm whitespace-nowrap">
              🔒 别急，未来的李丹，到了那天你自然就懂了。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
