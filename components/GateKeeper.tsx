'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CORRECT_CODE = '咪啾咪啾';
const STORAGE_KEY = 'isPassed';
const RESET_SIGNAL_KEY = 'gatekeeper_reset_signal';

interface GateKeeperProps {
  children: React.ReactNode;
}

const HINT_FULL_TEXT = '看来是答不出来过来问我了老婆，你点击下面的“我们”试试。';

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

  // Easter egg states
  const [lockClickCount, setLockClickCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [weClickable, setWeClickable] = useState(false);
  const [finalMessage, setFinalMessage] = useState(false);
  const [hintText, setHintText] = useState('');
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        localStorage.removeItem(STORAGE_KEY);
        setIsPassed(false);
        setInputValue('');
        setIsSuccess(false);
        // reset egg states
        setLockClickCount(0);
        setShowHint(false);
        setWeClickable(false);
        setFinalMessage(false);
        setHintText('');
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      }
    };

    const handleCustomReset = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== 'true' && isPassed) {
        setIsPassed(false);
        setInputValue('');
        setIsSuccess(false);
        setLockClickCount(0);
        setShowHint(false);
        setWeClickable(false);
        setFinalMessage(false);
        setHintText('');
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleCustomReset);
    const interval = setInterval(handleCustomReset, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleCustomReset);
      clearInterval(interval);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [isPassed]);

  // 傲娇提示语打字机效果
  useEffect(() => {
    if (!showHint) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index <= HINT_FULL_TEXT.length) {
        setHintText(HINT_FULL_TEXT.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [showHint]);

  const handleSubmit = useCallback(() => {
    if (inputValue.trim() === CORRECT_CODE) {
      setIsError(false);
      setIsSuccess(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      setTimeout(() => {
        setIsPassed(true);
      }, 1400);
    } else {
      setIsError(true);
      setInputValue('');
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleLockClick = () => {
    if (showHint || finalMessage) return;
    setLockClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowHint(true);
        setWeClickable(true);
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
        return 0;
      }
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      lockTimerRef.current = setTimeout(() => {
        setLockClickCount(0);
      }, 1500);
      return next;
    });
  };

  const handleWeClick = () => {
    if (!weClickable || finalMessage) return;
    setTimeout(() => {
      setFinalMessage(true);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0510]">
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
              {/* 锁形 / Hint / System Locked */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-8 flex flex-col items-center"
              >
                <motion.button
                  onClick={handleLockClick}
                  disabled={showHint || finalMessage}
                  whileTap={{ scale: 0.88 }}
                  className={`relative ${showHint || finalMessage ? 'cursor-default' : 'cursor-pointer'}`}
                  aria-label="Lock"
                >
                  <GlowingLock />
                  {/* Click feedback rings */}
                  {!showHint && !finalMessage && lockClickCount > 0 && (
                    <motion.span
                      key={lockClickCount}
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 rounded-full border border-white/40"
                    />
                  )}
                </motion.button>

                <div className="mt-4 h-5">
                  <AnimatePresence mode="wait">
                    {showHint ? (
                      <motion.p
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-serif-display text-xs md:text-sm text-white/80 tracking-wide"
                        style={{ textShadow: '0 0 10px rgba(255,255,255,0.25)' }}
                      >
                        {hintText}
                        <span className="inline-block w-0.5 h-4 bg-white/60 ml-1 align-middle animate-pulse" />
                      </motion.p>
                    ) : (
                      <motion.p
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-mono-micro text-[10px] tracking-[0.25em] text-white/40"
                      >
                        [ SYSTEM LOCKED ]
                      </motion.p>
                    )}
                  </AnimatePresence>
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
                欢迎来到
                <span
                  onClick={weClickable ? handleWeClick : undefined}
                  className={`transition-all duration-500 ${
                    weClickable
                      ? 'cursor-pointer text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.8)]'
                      : ''
                  }`}
                >
                  我们
                </span>
                的记忆宇宙
              </motion.h1>

              {/* 副提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-10 flex items-center justify-center gap-2 font-mono-micro text-[10px] md:text-xs tracking-widest text-white/50"
              >
                <span className="inline-block w-1.5 h-px bg-white/40" />
                <span>Happy First Anniversary of Our Love</span>
                <span className="inline-block w-1.5 h-px bg-white/40" />
              </motion.div>

              {/* 输入区域 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative"
              >
                {!finalMessage ? (
                  <>
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
                      {isSuccess ? 'ACCESS GRANTED' : inputValue.trim().length > 0 ? 'PRESS ENTER' : '专属我们的恋爱暗号'}
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
                  </>
                ) : (
                  <AnimatePresence>
                    <motion.p
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-2 text-2xl md:text-3xl font-serif-display text-white tracking-wide"
                      style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,200,150,0.3)',
                      }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-block"
                      >
                        老婆 啾咪啾咪！
                      </motion.span>
                    </motion.p>
                  </AnimatePresence>
                )}
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
