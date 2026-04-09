'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import { YEARS, getNextAnniversaryCountdown } from '@/lib/year-config';

interface YearSelectorProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  onLockedClick?: (countdownText: string) => void;
}

export default function YearSelector({ selectedYear, onSelectYear, onLockedClick }: YearSelectorProps) {
  const [countdowns, setCountdowns] = useState(
    YEARS.map((y) => (y.status === 'locked' ? getNextAnniversaryCountdown(y.year) : null))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdowns(
        YEARS.map((y) => (y.status === 'locked' ? getNextAnniversaryCountdown(y.year) : null))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (yearConfig: typeof YEARS[number], index: number) => {
    if (yearConfig.status === 'locked') {
      const cd = countdowns[index];
      const text = cd
        ? `距离下一章开启还有 ${cd.days} 天 ${cd.hours} 小时 ${cd.minutes} 分钟`
        : '该章节尚未解锁';
      if (onLockedClick) onLockedClick(text);
      return;
    }
    onSelectYear(yearConfig.year);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex flex-col items-center"
    >
      <div className="flex items-center space-x-2 liquid-glass rounded-full p-1.5">
        {YEARS.map((yearConfig, index) => {
          const isSelected = selectedYear === yearConfig.year;
          const isLocked = yearConfig.status === 'locked';
          return (
            <MagneticButton key={yearConfig.year} strength={10} innerStrength={3}>
              <button
                onClick={() => handleClick(yearConfig, index)}
                className={`
                  relative flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isSelected && !isLocked ? 'bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white shadow-md' : ''}
                  ${!isSelected && !isLocked ? 'text-white/90 hover:bg-white/20' : ''}
                  ${isLocked ? 'text-white/50 cursor-not-allowed' : ''}
                `}
              >
                {isLocked && <Lock className="w-3 h-3" />}
                <span>{yearConfig.year}</span>
              </button>
            </MagneticButton>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-white/80 drop-shadow-sm">
        {YEARS.find((y) => y.year === selectedYear)?.title || ''}
      </p>
    </motion.div>
  );
}
