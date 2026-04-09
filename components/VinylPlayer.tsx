'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Music } from 'lucide-react';
import { useGame, Letter } from '@/lib/game-context';
import { useMusic } from '@/lib/music-context';

const formatTime = (sec: number) => {
  if (!isFinite(sec) || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

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
      className="absolute text-rose-400 text-lg pointer-events-none z-10"
      style={{ left: '50%', bottom: '50%' }}
    >
      {note}
    </motion.span>
  );
};

export default function VinylPlayer() {
  const [showLetterR, setShowLetterR] = useState(false);
  const { collectLetter, hasCollectedLetter, triggerLetterAnimation, showToast } = useGame();
  const {
    isPlaying,
    currentSong,
    togglePlay,
    playNext,
    playPrevious,
    hasStarted,
    currentTime,
    duration,
    seek,
    isShuffle,
    toggleShuffle,
  } = useMusic();

  const handleTogglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    togglePlay();
  }, [togglePlay]);

  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playPrevious();
  }, [playPrevious]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playNext();
  }, [playNext]);

  const handleShuffleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleShuffle();
  }, [toggleShuffle]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

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
    <>
      <style>{`
        .music-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 3px;
          background: rgba(124, 68, 79, 0.15);
          border-radius: 999px;
          outline: none;
          cursor: pointer;
        }
        .music-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          background: #E35D6A;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          transition: transform 0.15s ease;
        }
        .music-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .music-range::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: #E35D6A;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
      `}</style>

      <motion.div
        className="fixed bottom-6 left-6 z-[9999]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {/* Glassmorphism Control Console */}
        <div className="flex items-center gap-4 bg-white/30 backdrop-blur-md border border-white/50 shadow-2xl rounded-2xl px-4 py-3 pr-5">
          {/* Vinyl Disc */}
          <motion.button
            onClick={handleTogglePlay}
            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 shadow-lg border border-rose-300 hover:border-rose-400 transition-colors flex-shrink-0"
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
              <div className="w-4 h-4 rounded-full bg-rose-400 flex items-center justify-center relative group/center">
                <div className="w-1 h-1 rounded-full bg-rose-600 transition-transform group-hover/center:scale-125" />
                {/* 悬停反馈光环 */}
                <div className="absolute inset-0 rounded-full bg-rose-300 opacity-0 group-hover/center:opacity-60 transition-opacity blur-[1px]" />
                <AnimatePresence>
                  {showLetterR && !hasCollectedLetter('r' as Letter) && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0, y: 0 }}
                      animate={{ opacity: 1, scale: 1, y: -4 }}
                      exit={{ opacity: 0, scale: 0, y: 0 }}
                      className="absolute -top-5 text-sm font-bold text-[#E35D6A] pointer-events-none drop-shadow-[0_0_4px_rgba(227,93,106,0.8)]"
                    >
                      r
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* 播放/暂停图标（叠加在唱片上） */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-rose-700/80" fill="currentColor" />
              ) : (
                <Play className="w-3.5 h-3.5 text-rose-700/80 ml-0.5" fill="currentColor" />
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
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
              animate={{
                backgroundColor: isPlaying ? '#10B981' : '#9CA3AF',
                scale: isPlaying ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
            />
          </motion.button>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-colors"
              title="上一首"
            >
              <SkipBack className="w-4 h-4 text-[#7C444F]" fill="currentColor" />
            </button>

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

            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-colors"
              title="下一首"
            >
              <SkipForward className="w-4 h-4 text-[#7C444F]" fill="currentColor" />
            </button>

            <button
              onClick={handleShuffleToggle}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isShuffle
                  ? 'bg-rose-100 text-[#E35D6A]'
                  : 'bg-white/40 text-[#7C444F] hover:bg-white/60'
              }`}
              title={isShuffle ? '随机播放' : '顺序播放'}
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-white/60" />

          {/* Progress & Info */}
          <div className="flex-1 min-w-0 hidden sm:flex flex-col justify-center gap-1.5">
            <div className="flex items-center gap-2">
              <Music className="w-3 h-3 text-[#E35D6A] flex-shrink-0" />
              <span className="text-xs text-[#7C444F] font-medium truncate drop-shadow-sm">
                {currentSong.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={handleProgressChange}
                className="music-range flex-1"
              />
              <span className="text-[10px] text-[#7C444F]/80 font-medium tabular-nums w-[4.5ch] text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
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
    </>
  );
}
