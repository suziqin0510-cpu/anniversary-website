'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock } from 'lucide-react';
import { NAMES } from '@/lib/utils';
import HeartBurst from './HeartBurst';
import ThemeSwitcher from './ThemeSwitcher';
import MagneticButton from './MagneticButton';
import { useGame, Letter, LEVEL_ROUTES } from '@/lib/game-context';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '首页', href: '/', level: 0 },
  { name: '时间线', href: '/timeline', level: 1 },
  { name: '足迹', href: '/map', level: 2 },
  { name: '勋章', href: '/achievements', level: 3 },
  { name: '愿望', href: '/future', level: 4 },
  { name: '日记', href: '/diary', level: 5 },
  { name: '宠物', href: '/pets', level: 6 },
];

// 正红色小爱心
const RedHeartSmall = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 animate-pulse">
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
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const [showLetterO, setShowLetterO] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoRef = useRef<HTMLDivElement>(null);
  const { isLevelUnlocked, showToast, collectLetter, hasCollectedLetter, triggerLetterAnimation, unlockedLevels } = useGame();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    // 计算点击位置作为粒子爆发原点
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      setBurstOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      setBurstOrigin({ x: e.clientX, y: e.clientY });
    }
    setShowHeartBurst(true);

    // 点击3次后显示字母O
    setLogoClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3 && !hasCollectedLetter('o' as Letter)) {
        setShowLetterO(true);
        showToast('✨ Logo 里似乎藏着什么...', 'success');
      }
      return newCount;
    });
  };

  // 处理导航项点击 - 强制阻止未解锁的跳转
  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    // 首页总是允许
    if (item.level === 0) return;

    // 检查是否解锁
    if (!isLevelUnlocked(item.level)) {
      e.preventDefault();
      e.stopPropagation();
      showToast('需要先在首页找到 8 个光阴碎片才能开启回忆的大门哦 🔒');
      return false;
    }
  };

  const handleCollectO = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasCollectedLetter('o' as Letter)) {
      collectLetter('o' as Letter);
      triggerLetterAnimation('o' as Letter, e.clientX, e.clientY);
      showToast('发现字母 O！', 'success');
    }
    setShowLetterO(false);
  };

  return (
    <>
      {/* 爱心粒子爆发彩蛋 */}
      <HeartBurst
        trigger={showHeartBurst}
        originX={burstOrigin.x}
        originY={burstOrigin.y}
        onComplete={() => setShowHeartBurst(false)}
      />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/40 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - 点击触发爱心粒子彩蛋，点击3次出现字母O */}
            <MagneticButton strength={12} innerStrength={4} className="cursor-pointer">
              <div
                ref={logoRef}
                onClick={handleLogoClick}
                className="flex items-center space-x-2 group cursor-pointer select-none relative"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#E35D6A]/20 flex items-center justify-center group-hover:bg-[#E35D6A]/30 transition-colors">
                  <HandDrawnRose />
                </div>
                <div className="flex flex-col relative">
                  <span className="text-sm font-medium text-white drop-shadow-md group-hover:text-white transition-colors">
                    {NAMES.boy} & {NAMES.girl}
                  </span>
                  <span className="text-[10px] text-white/80 drop-shadow-md font-mono-micro tracking-wider">微醺告白 · 点我有惊喜</span>

                {/* 字母 o 触发器 */}
                <AnimatePresence>
                  {showLetterO && !hasCollectedLetter('o' as Letter) && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={handleCollectO}
                      className="absolute -right-6 top-1/2 -translate-y-1/2 text-xl font-bold text-[#E35D6A] cursor-pointer hover:scale-125 transition-transform z-50 pointer-events-auto px-2 py-1"
                      style={{ textShadow: '0 0 15px rgba(227, 93, 106, 1)' }}
                    >
                      O
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
            </MagneticButton>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isLocked = item.level > 0 && !isLevelUnlocked(item.level);
                return (
                  <MagneticButton key={item.name} strength={10} innerStrength={3}>
                    <Link
                      href={isLocked ? '#' : item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`px-4 py-2 text-sm relative group flex items-center space-x-1 transition-all duration-300 drop-shadow-md ${
                        isLocked
                          ? 'text-white/50 cursor-not-allowed'
                          : pathname === item.href
                          ? 'text-white font-medium'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {isLocked && <Lock className="w-3 h-3" />}
                      <span>{item.name}</span>
                      {!isLocked && pathname !== item.href && (
                        <span className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-[#E35D6A] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                      )}
                      {!isLocked && pathname === item.href && (
                        <span className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-[#E35D6A] transform scale-x-100 transition-transform origin-left rounded-full" />
                      )}
                    </Link>
                  </MagneticButton>
                );
              })}
            </nav>

            {/* Status Indicator & Theme Switcher */}
            <div className="hidden md:flex items-center space-x-3">
              <MagneticButton strength={8} innerStrength={2}>
                <ThemeSwitcher />
              </MagneticButton>
              <MagneticButton strength={10} innerStrength={3}>
                <div className="flex items-center space-x-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-white/30 transition-all duration-300 rounded-full"
                >
                  <RedHeartSmall />
                  <span className="text-xs text-white font-medium drop-shadow-md font-mono-micro tracking-wide"
                  >
                    {unlockedLevels.length > 0 ? `已解锁 ${unlockedLevels.length} 关` : '温暖相伴'}
                  </span>
                </div>
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#7C444F]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-white drop-shadow-md" /> : <Menu className="w-6 h-6 text-white drop-shadow-md" />}
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
              {navItems.map((item, index) => {
                const isLocked = item.level > 0 && !isLevelUnlocked(item.level);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isLocked ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          showToast('需要先在首页找到 8 个光阴碎片才能开启回忆的大门哦 🔒');
                        }}
                        className="flex items-center space-x-2 text-2xl font-medium text-[#9B6A6C]/40 cursor-not-allowed"
                      >
                        <Lock className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-2 text-2xl font-medium text-[#7C444F] hover:text-[#E35D6A] transition-colors"
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </motion.div>
                );
              })}

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
