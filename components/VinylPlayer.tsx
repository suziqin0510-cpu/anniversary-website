'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { useGame, Letter } from '@/lib/game-context';
import { useMusic } from '@/lib/music-context';

// 音符粒子组件
const MusicNote = ({ delay }: { delay: number }) => {
  const notes = ['♪', '♫', '♬', '♩'];
  const note = notes[Math.floor(Math.random() * notes.length)];
  const x = Math.random() * 40 - 20;

  return (
    <motion.span
      initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-10, -40, -60],
        x: [0, x, x * 1.5],
        scale: [0.5, 1, 0.8],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 0.5,
      }}
      className="absolute text-rose-400 text-lg pointer-events-none"
      style={{ left: '50%', bottom: '100%' }}
    >
      {note}
    </motion.span>
  );
};

export default function VinylPlayer() {
  const [showLetterR, setShowLetterR] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast } = useGame();
  const {
    isPlaying,
    currentSong,
    currentIndex,
    togglePlay,
    playNext,
    playPrevious,
    hasStarted
  } = useMusic();

  // 处理播放/暂停
  const handleTogglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    togglePlay();
  }, [togglePlay]);

  // 处理上一首
  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playPrevious();
  }, [playPrevious]);

  // 处理下一首
  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playNext();
  }, [playNext]);

  // 字母 r 触发 - 悬停在中心圆孔
  const handleCenterHover = useCallback(() => {
    if (!hasCollectedLetter('r' as Letter)) {
      setShowLetterR(true);
    }
  }, [hasCollectedLetter]);

  const handleCenterLeave = useCallback(() => {
    setShowLetterR(false);
  }, []);

  const handleCollectR = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasCollectedLetter('r' as Letter)) {
      collectLetter('r' as Letter);
      triggerLetterAnimation('r' as Letter, e.clientX, e.clientY);
      showToast('发现字母 R！', 'success');
    }
    setShowLetterR(false);
  }, [collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast]);

  return (
    <motion.div
      className="fixed bottom-12 left-6 z-[9999]"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      {/* 统一容器 - 唱片和控制台包裹在一起，避免鼠标离开间隙 */}
      <div
        className="group flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 黑胶唱片按钮 - 左侧主控件 */}
        <motion.button
          onClick={handleTogglePlay}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 shadow-xl border-2 border-rose-300 hover:border-rose-400 transition-colors flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* 唱片纹理 */}
          <div className="absolute inset-1 rounded-full border border-rose-300 opacity-50" />
          <div className="absolute inset-2 rounded-full border border-rose-300 opacity-30" />
          <div className="absolute inset-3 rounded-full border border-rose-300 opacity-20" />

          {/* 旋转的中心标签 - 字母 r 触发器 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              duration: 4,
              repeat: isPlaying ? Infinity : 0,
              ease: 'linear',
            }}
            onMouseEnter={handleCenterHover}
            onMouseLeave={handleCenterLeave}
            onClick={handleCollectR}
          >
            <div className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center relative">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              {/* 字母 r */}
              <AnimatePresence>
                {showLetterR && !hasCollectedLetter('r' as Letter) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-6 text-sm font-bold text-[#E35D6A]"
                    style={{ textShadow: '0 0 5px rgba(227, 93, 106, 0.8)' }}
                  >
                    r
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 播放/暂停图标 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isPlaying ? (
              <Pause className="w-4 h-4 text-rose-700/80" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 text-rose-700/80 ml-0.5" fill="currentColor" />
            )}
          </div>

          {/* 音符粒子 */}
          <AnimatePresence>
            {isPlaying && (
              <>
                {[0, 0.3, 0.6, 0.9, 1.2].map((delay, i) => (
                  <MusicNote key={i} delay={delay} />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* 状态指示灯 */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
            animate={{
              backgroundColor: isPlaying ? '#10B981' : '#9CA3AF',
              scale: isPlaying ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
          />
        </motion.button>

        {/* 展开的控制台气泡 - 使用 group-hover 触发 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-rose-100 px-4 py-2 flex items-center space-x-3 whitespace-nowrap"
              style={{
                boxShadow: '0 4px 20px rgba(227, 93, 106, 0.15)',
              }}
            >
              {/* 上一首按钮 */}
              <button
                onClick={handlePrevious}
                className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                title="上一首"
              >
                <SkipBack className="w-4 h-4 text-[#7C444F]" fill="currentColor" />
              </button>

              {/* 播放/暂停按钮 */}
              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E35D6A] to-[#F4A460] hover:from-[#d44d5a] hover:to-[#e49450] flex items-center justify-center transition-all shadow-md"
                title={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                )}
              </button>

              {/* 下一首按钮 */}
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                title="下一首"
              >
                <SkipForward className="w-4 h-4 text-[#7C444F]" fill="currentColor" />
              </button>

              {/* 分隔线 */}
              <div className="w-px h-6 bg-rose-200" />

              {/* 当前歌名 */}
              <div className="flex items-center space-x-2 max-w-[140px]">
                <Music className="w-3.5 h-3.5 text-[#E35D6A] flex-shrink-0" />
                <span className="text-sm text-[#7C444F] font-medium truncate">
                  {currentSong.title}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 首次使用提示 */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 bottom-full mb-2 bg-rose-500 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            点击任意处开始播放音乐 🎵
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-rose-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
