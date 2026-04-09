'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CORRECT_CODE = '咪啾咪啾';
const STORAGE_KEY = 'isPassed';
const RESET_SIGNAL_KEY = 'gatekeeper_reset_signal';

interface GateKeeperProps {
  children: React.ReactNode;
}

// 极简发光锁形 SVG
const GlowingLock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-10 h-10 text-white/80"
    style={{
      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.35))',
    }}
  >
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
    <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

export default function GateKeeper({ children }: GateKeeperProps) {
  const [isPassed, setIsPassed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 检查本地存储的验证状态
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsPassed(true);
    }
    setIsLoading(false);
  }, []);

  // 监听管理端重置信号（跨标签页通信）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RESET_SIGNAL_KEY) {
        // 管理端发出了重置信号
        localStorage.removeItem(STORAGE_KEY);
        setIsPassed(false);
        setInputValue('');
        setIsSuccess(false);
      }
    };

    const handleCustomReset = () => {
      // 检查当前状态是否被重置
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== 'true' && isPassed) {
        setIsPassed(false);
        setInputValue('');
        setIsSuccess(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleCustomReset);

    // 定期检查（防止同一标签页内的状态不同步）
    const interval = setInterval(handleCustomReset, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleCustomReset);
      clearInterval(interval);
    };
  }, [isPassed]);

  const handleSubmit = useCallback(() => {
    if (inputValue.trim() === CORRECT_CODE) {
      // 验证成功
      setIsError(false);
      setIsSuccess(true);
      localStorage.setItem(STORAGE_KEY, 'true');

      // 延迟后切换到主页面
      setTimeout(() => {
        setIsPassed(true);
      }, 1400);
    } else {
      // 验证失败
      setIsError(true);
      setInputValue('');
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0510]">
        {/* Mesh Gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(76,29,149,0.45) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-20 -right-20 w-[700px] h-[700px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(190,24,93,0.35) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.35) 0%, transparent 70%)' }}
          />
        </div>
        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="relative z-10 text-white/80 font-mono-micro text-xs tracking-[0.3em]"
        >
          SYSTEM INITIALIZING
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isPassed ? (
        <motion.div
          key="gate"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 overflow-hidden bg-[#0a0510]"
        >
          {/* Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(76,29,149,0.45) 0%, transparent 70%)' }}
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -right-20 w-[700px] h-[700px] rounded-full blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(190,24,93,0.35) 0%, transparent 70%)' }}
            />
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.35) 0%, transparent 70%)' }}
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, -40, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }}
            />
          </div>

          {/* Noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* 主内容 - Liquid Glass Portal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md"
          >
            <div
              className="rounded-[2.5rem] px-8 py-12 md:px-12 md:py-16 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                boxShadow: '0 0 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* 锁形 / System Locked */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-8 flex flex-col items-center"
              >
                <GlowingLock />
                <div className="mt-4 font-mono-micro text-[10px] tracking-[0.25em] text-white/40">
                  [ SYSTEM LOCKED ]
                </div>
              </motion.div>

              {/* 标题 */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.9 }}
                className="text-3xl md:text-4xl font-serif-display text-white tracking-wide mb-2"
                style={{
                  textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.15)',
                }}
              >
                欢迎来到我们的记忆宇宙
              </motion.h1>

              {/* 副提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-10 flex items-center justify-center gap-2 font-mono-micro text-[10px] md:text-xs tracking-widest text-white/50"
              >
                <span className="inline-block w-1.5 h-px bg-white/40" />
                <span>ENTER OVERRIDE CODE_</span>
                <span className="inline-block w-1.5 h-px bg-white/40" />
              </motion.div>

              {/* 输入区域 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setIsError(false);
                    }}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className={`
                      w-full bg-transparent border-b text-center text-xl md:text-2xl text-white placeholder-white/20
                      focus:outline-none transition-all duration-500 py-3
                      ${isError ? 'border-red-400/60' : isSuccess ? 'border-emerald-400/60' : 'border-white/30 focus:border-white/70'}
                    `}
                    style={{
                      caretColor: 'rgba(255,255,255,0.9)',
                      textShadow: '0 0 12px rgba(255,255,255,0.15)',
                    }}
                    placeholder=""
                  />
                  <AnimatePresence>
                    {inputValue.trim().length > 0 && !isSuccess && (
                      <motion.button
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.25 }}
                        onClick={handleSubmit}
                        className="absolute right-0 text-white/60 hover:text-white transition-colors"
                        aria-label="Submit"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Press Enter 提示 */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: inputValue.trim().length > 0 ? 1 : 0.5 }}
                  className="mt-4 font-mono-micro text-[10px] tracking-widest text-white/30"
                >
                  {isSuccess ? 'ACCESS GRANTED' : inputValue.trim().length > 0 ? 'PRESS ENTER' : 'AWAITING INPUT_'}
                </motion.p>

                {/* 错误 / 成功提示 */}
                <AnimatePresence mode="wait">
                  {isError && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 text-red-300/80 text-xs tracking-wide"
                    >
                      暗号不匹配，请再次尝试
                    </motion.p>
                  )}
                  {isSuccess && (
                    <motion.p
                      key="success"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 text-emerald-300/80 text-xs tracking-wide"
                    >
                      暗号正确，欢迎回家
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          {/* 底部微标 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <p className="font-mono-micro text-[10px] tracking-[0.2em] text-white/20">
              SZQ & LD · MEMORY ARCHIVE
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 全局重置函数（供管理端调用）
export function resetGateKeeper() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(RESET_SIGNAL_KEY, Date.now().toString());
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: RESET_SIGNAL_KEY,
      newValue: Date.now().toString(),
    })
  );
}
