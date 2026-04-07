'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollJourney() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  // 使用弹簧动画让移动更流畅
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // 监听滚动显示组件
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      className="fixed right-4 top-0 z-40 pointer-events-none"
      style={{
        height: '100vh',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 进度轨道 */}
      <div className="absolute right-2 top-20 bottom-20 w-0.5 bg-rose-200/30 rounded-full">
        {/* 进度填充 */}
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-rose-400 to-amber-400 rounded-full"
          style={{
            height: useTransform(smoothProgress, [0, 1], ['0%', '100%']),
          }}
        />
      </div>

      {/* 奔跑的盼盼 */}
      <motion.div
        className="absolute right-0"
        style={{
          top: useTransform(smoothProgress, [0, 1], ['15%', '85%']),
        }}
      >
        <motion.div
          animate={{
            x: [0, 3, -3, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          {/* 盼盼图标 - 奔跑的阿拉斯加犬 */}
          <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border-2 border-rose-200 flex items-center justify-center">
            <span className="text-2xl">🐕</span>
          </div>

          {/* 移动方向指示 */}
          <motion.div
            className="absolute -left-4 top-1/2 -translate-y-1/2"
            animate={{
              opacity: [0.5, 1, 0.5],
              x: [-2, -5, -2],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
            }}
          >
            <span className="text-xs text-rose-400">💨</span>
          </motion.div>
        </motion.div>

        {/* 提示文字 */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm whitespace-nowrap"
        >
          <span className="text-xs text-[#7C444F] font-handwriting">盼盼在奔跑</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// 辅助函数：转换数值
function useTransform(value: any, inputRange: number[], outputRange: string[]) {
  const [output, setOutput] = useState(outputRange[0]);

  useEffect(() => {
    const unsubscribe = value.on('change', (latest: number) => {
      const clamped = Math.max(inputRange[0], Math.min(inputRange[1], latest));
      const percent = (clamped - inputRange[0]) / (inputRange[1] - inputRange[0]);
      const outputValue = parseFloat(outputRange[0]) + percent * (parseFloat(outputRange[1]) - parseFloat(outputRange[0]));
      setOutput(`${outputValue}%`);
    });

    return () => unsubscribe();
  }, [value, inputRange, outputRange]);

  return output;
}
