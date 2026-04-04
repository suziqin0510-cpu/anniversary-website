'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Tilt from 'react-parallax-tilt';

export default function IntroPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typedText, setTypedText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const password = '啾米啾米';
  const fullText = '欢迎来到我们的小窝...';

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);
    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (input === password) {
      setIsUnlocked(true);
      setShowError(false);
      setTimeout(() => {
        localStorage.setItem('authenticated', 'true');
        router.push('/');
      }, 1500);
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* 流体背景球 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-72 h-72 bg-[#E35D6A]/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#F4A460]/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#E8D5C4]/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-20 h-20 mx-auto text-[#E35D6A]">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <p className="text-[#7C444F] font-handwriting text-2xl md:text-3xl">
            {typedText}
            <span className={`inline-block w-0.5 h-6 bg-[#F8AD9D] ml-1 align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="lock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <p className="text-[#9B6A6C] text-sm tracking-widest">
                请输入暗号
              </p>

              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1rem" style={{ borderRadius: '1rem' }}>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入暗号..."
                    className="w-full bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl py-4 px-6 text-center text-[#7C444F] text-lg placeholder-[#9B6A6C]/50 focus:border-[#E35D6A] focus:outline-none transition-all"
                  />
                </div>
              </Tilt>

              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} glareEnable={false} style={{ borderRadius: '1rem' }}>
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-[#E35D6A] text-white rounded-2xl font-medium hover:bg-[#F4A460] transition-colors"
                  style={{ boxShadow: '0 4px 20px rgba(248, 173, 157, 0.3)' }}
                >
                  进入
                </button>
              </Tilt>

              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm"
                  >
                    暗号不对哦，再想想~
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-[#9B6A6C]/60 text-xs">
                💡 提示：这是只有我们两个人知道的暗号
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-[#E35D6A] font-handwriting text-3xl"
              >
                米啾米啾
              </motion.div>
              <p className="text-[#9B6A6C]">
                欢迎回家，李丹
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-[#E35D6A] border-t-transparent rounded-full mx-auto"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[#9B6A6C]/40 text-sm">
          啾米啾米 ♥ 米啾米啾
        </p>
      </div>
    </div>
  );
}
