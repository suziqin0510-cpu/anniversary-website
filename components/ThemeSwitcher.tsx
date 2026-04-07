'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const [isStarryMode, setIsStarryMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'starry') {
      setIsStarryMode(true);
      document.documentElement.classList.add('starry-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isStarryMode;
    setIsStarryMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('starry-mode');
      localStorage.setItem('theme', 'starry');
    } else {
      document.documentElement.classList.remove('starry-mode');
      localStorage.setItem('theme', 'sunset');
    }
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isStarryMode ? '切换到落日模式' : '切换到星空模式'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isStarryMode ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isStarryMode ? (
          <Moon className="w-5 h-5 text-blue-200" />
        ) : (
          <Sun className="w-5 h-5 text-amber-400" />
        )}
      </motion.div>

      {/* 发光效果 */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isStarryMode
            ? '0 0 20px rgba(147, 197, 253, 0.5)'
            : '0 0 20px rgba(251, 191, 36, 0.5)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
