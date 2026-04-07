'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, Lock, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/lib/game-context';

// 北海轨迹的正确顺序
const CORRECT_PATH = ['昆明', '会泽', '六盘水', '兴义', '百色', '南宁', '北海'];

interface City {
  name: string;
  x: number;
  y: number;
}

// 城市坐标（基于地图百分比位置）
const CITIES: City[] = [
  { name: '昆明', x: 48, y: 58 },
  { name: '会泽', x: 42, y: 42 },
  { name: '六盘水', x: 52, y: 45 },
  { name: '兴义', x: 55, y: 55 },
  { name: '百色', x: 72, y: 68 },
  { name: '南宁', x: 82, y: 72 },
  { name: '北海', x: 78, y: 78 },
];

// 金色流光连线组件
const GoldenTrail = ({
  from,
  to,
  index,
  isError,
}: {
  from: City;
  to: City;
  index: number;
  isError: boolean;
}) => {
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isError ? 0 : 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex: 5 }}
    >
      <defs>
        <linearGradient id={`goldenGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFA500" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
        </linearGradient>
        <filter id={`glow-${index}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 发光背景线 */}
      <motion.line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke={`url(#goldenGradient-${index})`}
        strokeWidth="4"
        strokeLinecap="round"
        filter={`url(#glow-${index})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeInOut' }}
      />

      {/* 主金色线 */}
      <motion.line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke={`url(#goldenGradient-${index})`}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeInOut' }}
      />

      {/* 流光动画 */}
      <motion.circle r="3" fill="#FFD700">
        <animateMotion
          dur="1.5s"
          repeatCount="indefinite"
          path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
        />
      </motion.circle>
    </motion.svg>
  );
};

// 城市锚点
const CityAnchor = ({
  city,
  index,
  isVisited,
  isNext,
  onClick,
  isShaking,
}: {
  city: City;
  index: number;
  isVisited: boolean;
  isNext: boolean;
  onClick: () => void;
  isShaking: boolean;
}) => {
  return (
    <motion.button
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ left: `${city.x}%`, top: `${city.y}%` }}
      onClick={onClick}
      animate={isShaking ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* 下一个提示光环 */}
      {isNext && (
        <motion.div
          className="absolute inset-0 -m-3 rounded-full border-2 border-yellow-400"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* 已访问的发光环 */}
      {isVisited && (
        <motion.div
          className="absolute inset-0 -m-2 rounded-full bg-yellow-400/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}

      {/* 锚点图标 */}
      <div
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isVisited
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50'
            : isNext
            ? 'bg-white border-2 border-yellow-400 shadow-md'
            : 'bg-white/80 border border-gray-300'
        }`}
      >
        {isVisited ? (
          <Sparkles className="w-5 h-5 text-white" />
        ) : (
          <MapPin className={`w-5 h-5 ${isNext ? 'text-yellow-500' : 'text-gray-400'}`} />
        )}
      </div>

      {/* 城市名称 */}
      <motion.span
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded-full ${
          isVisited
            ? 'text-yellow-600 bg-yellow-100'
            : isNext
            ? 'text-yellow-600 bg-white shadow-sm'
            : 'text-gray-500 bg-white/80'
        }`}
      >
        {city.name}
        {isVisited && <span className="ml-1">✓</span>}
      </motion.span>

      {/* 序号标记 */}
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E35D6A] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
        {index + 1}
      </span>
    </motion.button>
  );
};

// 解锁成功弹窗
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      // 强烈的光芒爆发效果
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#E35D6A'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#E35D6A'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-gradient-to-br from-yellow-50 via-orange-50 to-rose-50 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border-2 border-yellow-400/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 光芒背景 */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(255, 215, 0, 0.3)',
                  '0 0 60px rgba(255, 215, 0, 0.6)',
                  '0 0 30px rgba(255, 215, 0, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 360] }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg relative z-10"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-[#7C444F] mb-3 relative z-10">
              成就达成！
            </h3>

            <p className="text-[#9B6A6C] mb-6 relative z-10">
              我们走过的每一公里，都刻在了星图里。🏅
            </p>

            <div className="flex items-center justify-center space-x-2 text-lg text-yellow-600 mb-6 relative z-10">
              {CORRECT_PATH.map((city, i) => (
                <span key={city} className="flex items-center">
                  <span className="font-medium">{city}</span>
                  {i < CORRECT_PATH.length - 1 && (
                    <span className="mx-1 text-yellow-400">→</span>
                  )}
                </span>
              ))}
            </div>

            <motion.a
              href="/achievements"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-medium shadow-lg relative z-10"
            >
              <Trophy className="w-5 h-5" />
              <span>查看成就勋章</span>
              <span>→</span>
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 错误提示弹窗
const ErrorToast = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-[#E35D6A] text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
        >
          <span className="text-xl">💫</span>
          <span>路线不对哦，再回想一下我们去北海的轨迹~</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function StarChartLock() {
  const { isLevelUnlocked, unlockLevel, showToast } = useGame();
  const [visitedCities, setVisitedCities] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isShaking, setIsShaking] = useState<number | null>(null);

  // 检查是否已解锁
  const isAlreadyUnlocked = isLevelUnlocked(3);

  const handleCityClick = useCallback(
    (city: City, index: number) => {
      if (isAlreadyUnlocked || showSuccess) return;

      const currentStep = visitedCities.length;
      const expectedCity = CORRECT_PATH[currentStep];

      if (city.name === expectedCity) {
        // 正确点击
        setVisitedCities((prev) => [...prev, city.name]);

        // 检查是否完成
        if (currentStep + 1 === CORRECT_PATH.length) {
          setTimeout(() => {
            setShowSuccess(true);
            unlockLevel(3);
            showToast('🎉 星图解锁成功！成就勋章已开启', 'success');
          }, 800);
        }
      } else {
        // 错误点击 - 触发震动和重置
        setIsShaking(index);
        setIsError(true);
        setShowError(true);

        setTimeout(() => {
          setIsShaking(null);
          setVisitedCities([]);
          setIsError(false);
        }, 600);
      }
    },
    [visitedCities, isAlreadyUnlocked, showSuccess, unlockLevel, showToast]
  );

  // 如果已解锁，显示简化版本
  if (isAlreadyUnlocked) {
    return (
      <div className="mt-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-lg border border-yellow-200 p-8 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
            >
              <Trophy className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-[#7C444F] mb-2">星图已解锁</h3>
            <p className="text-[#9B6A6C] mb-4">你们已经走过了这段美好的旅程</p>
            <motion.a
              href="/achievements"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-medium shadow-lg"
            >
              <Trophy className="w-5 h-5" />
              <span>查看成就勋章</span>
              <span>→</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Lock className="w-5 h-5 text-[#E35D6A]" />
            <h3 className="text-lg font-bold text-[#7C444F]">北海轨迹星图锁</h3>
          </div>
          <p className="text-[#9B6A6C] text-sm">
            按照我们当初去北海的路线，依次点击城市锚点
          </p>
          <p className="text-[#9B6A6C]/70 text-xs mt-1">
            提示：从昆明出发，一路向东南...
          </p>
        </div>

        {/* 星图地图 */}
        <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl overflow-hidden" style={{ height: '400px' }}>
          {/* 星空背景 */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* 星座连线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.3)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* 金色流光连线 */}
          <AnimatePresence>
            {visitedCities.map((cityName, index) => {
              if (index === 0) return null;
              const fromCity = CITIES.find((c) => c.name === visitedCities[index - 1])!;
              const toCity = CITIES.find((c) => c.name === cityName)!;
              return (
                <GoldenTrail
                  key={`${cityName}-${index}`}
                  from={fromCity}
                  to={toCity}
                  index={index - 1}
                  isError={isError}
                />
              );
            })}
          </AnimatePresence>

          {/* 城市锚点 */}
          {CITIES.map((city, index) => {
            const isVisited = visitedCities.includes(city.name);
            const isNext =
              !isVisited &&
              visitedCities.length < CORRECT_PATH.length &&
              city.name === CORRECT_PATH[visitedCities.length];

            return (
              <CityAnchor
                key={city.name}
                city={city}
                index={index}
                isVisited={isVisited}
                isNext={isNext}
                isShaking={isShaking === index}
                onClick={() => handleCityClick(city, index)}
              />
            );
          })}

          {/* 进度指示 */}
          <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm">
              进度: {visitedCities.length} / {CORRECT_PATH.length}
            </span>
          </div>
        </div>

        {/* 路线提示 */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {CORRECT_PATH.map((city, index) => (
            <div key={city} className="flex items-center">
              <span
                className={`text-sm px-3 py-1 rounded-full transition-all ${
                  visitedCities.includes(city)
                    ? 'bg-yellow-100 text-yellow-700 font-medium'
                    : index === visitedCities.length
                    ? 'bg-yellow-50 text-yellow-600 border border-yellow-300 animate-pulse'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {city}
              </span>
              {index < CORRECT_PATH.length - 1 && (
                <span className="mx-1 text-gray-300">→</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 错误提示 */}
      <ErrorToast isOpen={showError} onClose={() => setShowError(false)} />

      {/* 成功弹窗 */}
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
