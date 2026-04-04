'use client';

import { calculateDaysTogether } from '@/lib/utils';

// 手绘风格心形
const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1.5"
    />
  </svg>
);

export default function Footer() {
  const days = calculateDaysTogether();

  return (
    <footer className="bg-gradient-to-t from-[#F8AD9D]/10 to-transparent py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <HandDrawnHeart />
            <span className="font-handwriting text-lg text-[#5D4037]">
              苏子钦 & 李丹
            </span>
          </div>

          {/* Days Counter */}
          <p className="text-sm text-[#8D6E63]">
            在一起 <span className="text-[#F8AD9D] font-semibold">{days}</span> 天
          </p>

          {/* Quote */}
          <p className="text-xs text-[#8D6E63]/60 italic max-w-md text-center">
            "你可以永远不用长大，我会一直在这里，陪你作，陪你笑"
          </p>

          {/* Copyright */}
          <p className="text-xs text-[#8D6E63]/40 mt-4">
            Made with  for 李丹
          </p>

          {/* 暗号 */}
          <div className="flex items-center space-x-2 text-[#8D6E63]/40 text-xs mt-2">
            <span>啾米啾米</span>
            <span className="text-[#F8AD9D]">♥</span>
            <span>米啾米啾</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
