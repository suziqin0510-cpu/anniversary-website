'use client';

import { Heart } from 'lucide-react';
import { NAMES, calculateDaysTogether } from '@/lib/utils';

export default function Footer() {
  const days = calculateDaysTogether();

  return (
    <footer className="bg-gradient-to-t from-[#FFE4E1]/30 to-transparent py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-[#E8A598] fill-[#E8A598]" />
            <span className="font-handwriting text-lg text-[#2D2D2D]">
              {NAMES.boy} & {NAMES.girl}
            </span>
          </div>

          {/* Days Counter */}
          <p className="text-sm text-[#6B6B6B]">
            已相爱 <span className="text-[#E8A598] font-semibold">{days}</span> 天
          </p>

          {/* Quote */}
          <p className="text-xs text-[#6B6B6B]/60 italic max-w-md text-center">
            "最好的爱情，是两个人一起慢慢变好"
          </p>

          {/* Copyright */}
          <p className="text-xs text-[#6B6B6B]/40 mt-4">
            Made with ❤️ for {NAMES.girl}
          </p>
        </div>
      </div>
    </footer>
  );
}
