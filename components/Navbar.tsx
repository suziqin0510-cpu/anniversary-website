'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Menu, X, Heart } from 'lucide-react';
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
            ? 'bg-[#0F0F13]/90 backdrop-blur-xl border-b border-[#D4A574]/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A574] to-[#E8843C] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#0F0F13]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#E8E8EC] group-hover:text-[#D4A574] transition-colors">
                  {NAMES.boy} & {NAMES.girl}
                </span>
                <span className="text-[10px] text-[#8A8A92] font-mono">CYBERSPACE</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm text-[#8A8A92] hover:text-[#D4A574] transition-colors duration-300 relative group"
                >
                  <span className="font-mono text-xs opacity-50 mr-1">//</span>
                  {item.name}
                  <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-[#D4A574] to-[#E8843C] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Status Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-1.5 glass-effect rounded-full">
                <Heart className="w-3 h-3 text-[#D4A574] fill-[#D4A574] animate-pulse" />
                <span className="text-xs text-[#8A8A92] font-mono">CONNECTED</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#D4A574]"
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
            className="fixed inset-0 z-40 bg-[#0F0F13]/95 backdrop-blur-xl md:hidden"
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
                    className="flex items-center space-x-2 text-2xl font-medium text-[#E8E8EC] hover:text-[#D4A574] transition-colors"
                  >
                    <span className="text-[#D4A574] font-mono text-sm">//</span>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex items-center space-x-2 text-[#8A8A92] font-mono text-sm"
              >
                <Heart className="w-4 h-4 text-[#D4A574] fill-[#D4A574]" />
                <span>啾米啾米</span>
                <span className="text-[#D4A574]">←→</span>
                <span>米啾米啾</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
