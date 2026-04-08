'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Sparkles } from 'lucide-react';

const CORRECT_CODE = '咪啾咪啾';
const STORAGE_KEY = 'isPassed';
const RESET_SIGNAL_KEY = 'gatekeeper_reset_signal';

interface GateKeeperProps {
  children: React.ReactNode;
}

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
      }, 800);
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
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center z-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Heart className="w-12 h-12 text-rose-400 fill-rose-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isPassed ? (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center justify-center z-[100]"
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                y: [-20, 20, -20], 
                rotate: [0, 5, 0],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-20 left-20 w-32 h-32 bg-rose-200 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                y: [20, -20, 20], 
                rotate: [0, -5, 0],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute bottom-20 right-20 w-40 h-40 bg-pink-200 rounded-full blur-3xl"
            />
          </div>

          {/* 主内容 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10 text-center px-6"
          >
            {/* 图标 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center">
                <Lock className="w-12 h-12 text-rose-400" />
              </div>
            </motion.div>

            {/* 标题 */}
            <h1 className="text-3xl md:text-4xl font-bold text-rose-600 mb-2">
              欢迎来到我们的记忆宇宙
            </h1>
            <p className="text-rose-400 mb-8 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              请输入开启甜蜜旅程的专属暗号
              <Sparkles className="w-4 h-4" />
            </p>

            {/* 输入框区域 */}
            <motion.div
              animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsError(false);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="在这里输入暗号..."
                  className={`
                    w-72 md:w-80 px-6 py-4 text-center text-lg
                    rounded-full border-2 outline-none
                    transition-all duration-300
                    ${isError 
                      ? 'border-red-400 bg-red-50 text-red-600' 
                      : isSuccess
                        ? 'border-green-400 bg-green-50 text-green-600'
                        : 'border-rose-200 bg-white text-rose-700 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                    }
                  `}
                  autoFocus
                />
                
                {/* 成功状态装饰 */}
                {isSuccess && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Heart className="w-6 h-6 text-green-500 fill-green-500" />
                  </motion.div>
                )}
              </div>

              {/* 确认按钮 */}
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSuccess}
                className={`
                  w-72 md:w-80 py-3 rounded-full font-bold text-lg
                  transition-all duration-300 shadow-lg
                  ${isSuccess
                    ? 'bg-green-400 text-white cursor-default'
                    : 'bg-gradient-to-r from-rose-400 to-pink-400 text-white hover:shadow-xl hover:from-rose-500 hover:to-pink-500'
                  }
                `}
              >
                {isSuccess ? '验证成功！' : '确认开启'}
              </motion.button>

              {/* 错误提示 */}
              <AnimatePresence>
                {isError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    暗号不对哦，再好好想想~ 💕
                  </motion.p>
                )}
              </AnimatePresence>

              {/* 成功提示 */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-500 text-sm mt-2"
                  >
                    暗号正确！准备进入...
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 底部提示 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-rose-300 text-sm"
            >
              提示：我们的专属甜蜜咒语 ✨
            </motion.p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
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
  window.dispatchEvent(new StorageEvent('storage', {
    key: RESET_SIGNAL_KEY,
    newValue: Date.now().toString()
  }));
}
