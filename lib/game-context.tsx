'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 8 个目标字母
type Letter = 'e' | 'u' | 'p' | 'h' | 'o' | 'r' | 'i' | 'a';
const TARGET_LETTERS: Letter[] = ['e', 'u', 'p', 'h', 'o', 'r', 'i', 'a'];

// 关卡路由映射
const LEVEL_ROUTES: Record<number, string[]> = {
  1: ['/timeline'],
  2: ['/map'],
  3: ['/achievements'],
  4: ['/future'],
  5: ['/diary'],
  6: ['/pets'],
};

// Toast 类型
interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

// 游戏上下文类型
interface GameContextType {
  // 关卡解锁状态
  unlockedLevels: number[];
  unlockLevel: (level: number) => void;
  isLevelUnlocked: (level: number) => boolean;
  canAccessRoute: (route: string) => boolean;
  getRouteRequiredLevel: (route: string) => number | null;
  resetGame: () => void; // 重置游戏进度

  // 收集的字母（按收集顺序）
  collectedLetters: Letter[];
  collectLetter: (letter: Letter) => void;
  hasCollectedLetter: (letter: Letter) => boolean;
  isAllLettersCollected: boolean;

  // 解密状态
  showPuzzleModal: boolean;
  setShowPuzzleModal: (value: boolean) => void;

  // Toast 提示
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;

  // 字母收集动画
  floatingLetter: { letter: Letter; x: number; y: number } | null;
  triggerLetterAnimation: (letter: Letter, x: number, y: number) => void;

  // 是否已hydrated
  isHydrated: boolean;
}

// 默认上下文值（用于 SSR 或组件在 Provider 外时）
const defaultContext: GameContextType = {
  unlockedLevels: [],
  unlockLevel: () => {},
  isLevelUnlocked: () => false,
  canAccessRoute: () => false,
  getRouteRequiredLevel: () => null,
  resetGame: () => {},
  collectedLetters: [],
  collectLetter: () => {},
  hasCollectedLetter: () => false,
  isAllLettersCollected: false,
  showPuzzleModal: false,
  setShowPuzzleModal: () => {},
  showToast: () => {},
  triggerLetterAnimation: () => {},
  floatingLetter: null,
  isHydrated: false,
};

const GameContext = createContext<GameContextType>(defaultContext);

// Toast 组件
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`px-4 py-2 rounded-full shadow-lg backdrop-blur-sm text-sm font-medium pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-green-500/90 text-white'
                : toast.type === 'error'
                ? 'bg-red-500/90 text-white'
                : 'bg-[#7C444F]/90 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// 浮动字母动画组件
function FloatingLetterAnimation({
  letter,
  startX,
  startY,
  onComplete,
}: {
  letter: Letter;
  startX: number;
  startY: number;
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ x: startX, y: startY, scale: 1, opacity: 1 }}
      animate={{
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : startX,
        y: typeof window !== 'undefined' ? window.innerHeight - 80 : startY,
        scale: 0.5,
        opacity: 0,
      }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="fixed z-[150] text-4xl font-bold text-[#E35D6A] pointer-events-none"
      style={{ textShadow: '0 0 20px rgba(227, 93, 106, 0.8)' }}
    >
      {letter.toUpperCase()}
    </motion.div>
  );
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  // 从 localStorage 加载状态
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const [collectedLetters, setCollectedLetters] = useState<Letter[]>([]);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [floatingLetter, setFloatingLetter] = useState<{ letter: Letter; x: number; y: number } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 客户端 hydration - 加载游戏状态
  useEffect(() => {
    const GAME_STATE_KEY = 'anniversary-game-state';

    // 加载游戏状态
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setUnlockedLevels(state.unlockedLevels || []);
        setCollectedLetters(state.collectedLetters || []);
      } catch (e) {
        console.error('Failed to parse game state:', e);
      }
    }

    setIsHydrated(true);
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        'anniversary-game-state',
        JSON.stringify({
          unlockedLevels,
          collectedLetters,
        })
      );
    }
  }, [unlockedLevels, collectedLetters, isHydrated]);

  // 解锁关卡
  const unlockLevel = useCallback((level: number) => {
    setUnlockedLevels((prev) => {
      if (prev.includes(level)) return prev;
      return [...prev, level];
    });
  }, []);

  // 检查关卡是否解锁
  const isLevelUnlocked = useCallback(
    (level: number) => unlockedLevels.includes(level),
    [unlockedLevels]
  );

  // 检查路由是否可访问
  const canAccessRoute = useCallback(
    (route: string) => {
      // 首页总是可以访问
      if (route === '/' || route === '') return true;

      // 检查该路由需要的关卡
      for (const [level, routes] of Object.entries(LEVEL_ROUTES)) {
        if (routes.some((r) => route.startsWith(r))) {
          return unlockedLevels.includes(parseInt(level));
        }
      }
      return true;
    },
    [unlockedLevels]
  );

  // 获取路由需要的关卡
  const getRouteRequiredLevel = useCallback((route: string): number | null => {
    for (const [level, routes] of Object.entries(LEVEL_ROUTES)) {
      if (routes.some((r) => route.startsWith(r))) {
        return parseInt(level);
      }
    }
    return null;
  }, []);

  // 收集字母
  const collectLetter = useCallback((letter: Letter) => {
    setCollectedLetters((prev) => {
      if (prev.includes(letter)) return prev;
      return [...prev, letter];
    });
  }, []);

  // 检查是否已收集
  const hasCollectedLetter = useCallback(
    (letter: Letter) => collectedLetters.includes(letter),
    [collectedLetters]
  );

  // 是否收集完成
  const isAllLettersCollected = collectedLetters.length === TARGET_LETTERS.length;

  // 显示所有字母收集完成后弹出解密框
  useEffect(() => {
    if (isAllLettersCollected && !unlockedLevels.includes(1) && isHydrated) {
      const timer = setTimeout(() => {
        setShowPuzzleModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAllLettersCollected, unlockedLevels, isHydrated]);

  // Toast 提示
  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // 重置游戏进度
  const resetGame = useCallback(() => {
    setUnlockedLevels([]);
    setCollectedLetters([]);
    localStorage.removeItem('anniversary-game-state');
    localStorage.removeItem('anniversary-user-letter');
    showToast('🗑️ 游戏进度已重置', 'success');
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 触发字母动画
  const triggerLetterAnimation = useCallback((letter: Letter, x: number, y: number) => {
    setFloatingLetter({ letter, x, y });
  }, []);

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <GameContext.Provider
      value={{
        unlockedLevels,
        unlockLevel,
        isLevelUnlocked,
        canAccessRoute,
        getRouteRequiredLevel,
        resetGame,
        collectedLetters,
        collectLetter,
        hasCollectedLetter,
        isAllLettersCollected,
        showPuzzleModal,
        setShowPuzzleModal,
        showToast,
        triggerLetterAnimation,
        floatingLetter,
        isHydrated,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {floatingLetter && (
        <FloatingLetterAnimation
          letter={floatingLetter.letter}
          startX={floatingLetter.x}
          startY={floatingLetter.y}
          onComplete={() => setFloatingLetter(null)}
        />
      )}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  return context;
}

export { TARGET_LETTERS, LEVEL_ROUTES };
export type { Letter };
