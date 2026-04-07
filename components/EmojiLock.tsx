'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, MapPin, Sparkles } from 'lucide-react';
import { useGame } from '@/lib/game-context';
import confetti from 'canvas-confetti';

const EMOJI_POOL = ['☕️', '🚗', '🌹', '💍', '🍲', '🏔️', '🐱', '✈️', '🐶', '🎬', '📚', '🎵'];
const CORRECT_SEQUENCE = ['🍲', '🏔️', '🐱', '✈️'];

export default function EmojiLock() {
  const { isLevelUnlocked, unlockLevel, showToast } = useGame();
  const [slots, setSlots] = useState(['☕️', '☕️', '☕️', '☕️']);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 检查是否已经解锁
  useEffect(() => {
    if (isLevelUnlocked(2)) {
      setIsUnlocked(true);
      setSlots(CORRECT_SEQUENCE);
    }
  }, [isLevelUnlocked]);

  const handleSlotClick = (index: number) => {
    if (isUnlocked) return;

    setSlots(prev => {
      const newSlots = [...prev];
      const currentIndex = EMOJI_POOL.indexOf(newSlots[index]);
      const nextIndex = (currentIndex + 1) % EMOJI_POOL.length;
      newSlots[index] = EMOJI_POOL[nextIndex];
      return newSlots;
    });
  };

  // 检查密码是否正确
  useEffect(() => {
    if (isUnlocked) return;

    const isCorrect = slots.every((slot, index) => slot === CORRECT_SEQUENCE[index]);

    if (isCorrect) {
      setIsUnlocked(true);
      setShowSuccess(true);
      showToast('🎉 密码正确！解锁通往足迹地图的道路！', 'success');

      // 播放撒花特效
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#E35D6A', '#F4A460', '#FFD700', '#10B981'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#E35D6A', '#F4A460', '#FFD700', '#10B981'],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // 延迟解锁
      setTimeout(() => {
        unlockLevel(2);
      }, 1000);
    }
  }, [slots, isUnlocked, unlockLevel, showToast]);

  return (
    <div className="mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* 提示文案 */}
        <div className="text-center mb-6">
          <p className="text-[#7C444F] text-sm mb-2">
            我们的故事，是由哪几个印记串联起来的？
          </p>
          <p className="text-[#9B6A6C] text-xs">
            （注意寻找隐藏的痕迹哦~）
          </p>
        </div>

        {/* Emoji 锁 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-white/60 p-8">
          {/* 锁头图标 */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={isUnlocked ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isUnlocked
                  ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-400/30'
                  : 'bg-gradient-to-br from-[#E35D6A] to-[#F4A460]'
              }`}
            >
              {isUnlocked ? (
                <Unlock className="w-8 h-8 text-white" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </motion.div>
          </div>

          {/* 4个槽位 */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {slots.map((emoji, index) => (
              <motion.button
                key={index}
                onClick={() => handleSlotClick(index)}
                disabled={isUnlocked}
                whileHover={!isUnlocked ? { scale: 1.1 } : {}}
                whileTap={!isUnlocked ? { scale: 0.95 } : {}}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all ${
                  isUnlocked
                    ? 'bg-green-100 border-2 border-green-400 shadow-inner'
                    : 'bg-[#FFF5F5] border-2 border-[#E35D6A]/30 hover:border-[#E35D6A] hover:shadow-md'
                }`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>

          {/* 状态提示 */}
          <div className="text-center">
            {isUnlocked ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-green-600 font-medium flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>密码正确！时光之门已开启</span>
                  <Sparkles className="w-4 h-4" />
                </p>
                <motion.a
                  href="/map"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <MapPin className="w-5 h-5" />
                  <span>进入足迹地图</span>
                  <span>→</span>
                </motion.a>
              </motion.div>
            ) : (
              <p className="text-[#9B6A6C] text-sm">
                点击槽位切换 Emoji，寻找正确的组合
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
