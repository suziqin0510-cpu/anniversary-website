'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAMES } from '@/lib/utils';

const navItems = [
  { name: '首页', href: '/' },
  { name: '时间线', href: '/timeline' },
  { name: '足迹', href: '/map' },
  { name: '勋章', href: '/achievements' },
  { name: '愿望', href: '/future' },
  { name: '日记', href: '/diary' },
  { name: '宠物', href: '/pets' },
];

// 正红色小爱心
const RedHeartSmall = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
    <path
      d="M10 17.35l-1-1C4.5 12.36 2 9.78 2 6.5 2 4 4 2 6.5 2c1.5 0 2.9.7 3.5 1.8C10.6 2.7 12 2 13.5 2 16 2 18 4 18 6.5c0 3.28-2.5 5.86-7 9.85l-1 1z"
      fill="#DC2626"
      stroke="#DC2626"
      strokeWidth="1"
    />
  </svg>
);

// 手绘风格玫瑰花
const HandDrawnRose = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" fill="#E35D6A" fillOpacity="0.6" stroke="#E35D6A" strokeWidth="1"/>
    <path d="M12 12C12 12 8 14 6 14C4 14 2 12 2 12C2 12 4 10 6 10C8 10 12 12 12 12Z" fill="#F4A460" fillOpacity="0.5" stroke="#F4A460" strokeWidth="1"/>
    <path d="M12 12C12 12 16 14 18 14C20 14 22 12 22 12C22 12 20 10 18 10C16 10 12 12 12 12Z" fill="#F4A460" fillOpacity="0.5" stroke="#F4A460" strokeWidth="1"/>
    <circle cx="12" cy="12" r="2" fill="#7C444F"/>
  </svg>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FFF5F5]/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-2xl bg-[#E35D6A]/20 flex items-center justify-center group-hover:bg-[#E35D6A]/30 transition-colors">
                <HandDrawnRose />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#7C444F] group-hover:text-[#E35D6A] transition-colors">
                  {NAMES.boy} & {NAMES.girl}
                </span>
                <span className="text-[10px] text-[#9B6A6C]">微醺告白</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm text-[#9B6A6C] hover:text-[#7C444F] transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-[#E35D6A] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Status Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-4 py-1.5 glass-card rounded-full">
                <RedHeartSmall />
                <span className="text-xs text-[#9B6A6C]">温暖相伴</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#7C444F]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#FFF5F5]/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-2xl font-medium text-[#7C444F] hover:text-[#E35D6A] transition-colors"
                  >
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex items-center space-x-2 text-[#9B6A6C]"
              >
                <RedHeartSmall />
                <span>啾米啾米</span>
                <span className="text-[#E35D6A]">♥</span>
                <span>米啾米啾</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
