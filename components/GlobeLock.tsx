'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/lib/game-context';
import dynamic from 'next/dynamic';

// 动态导入 react-globe.gl，禁用 SSR
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white/60">
      <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mr-3" />
      加载地球数据中...
    </div>
  ),
});

// 正确路线城市
const CORRECT_PATH = ['昆明', '会泽', '六盘水', '兴义', '百色', '南宁', '北海'];

// 所有城市数据（正确路线 + 干扰项）
const CITIES = [
  // 正确路线
  { name: '昆明', lat: 24.88, lng: 102.83, isTarget: true },
  { name: '会泽', lat: 26.42, lng: 103.30, isTarget: true },
  { name: '六盘水', lat: 26.59, lng: 104.83, isTarget: true },
  { name: '兴义', lat: 25.09, lng: 104.90, isTarget: true },
  { name: '百色', lat: 23.90, lng: 106.62, isTarget: true },
  { name: '南宁', lat: 22.82, lng: 108.32, isTarget: true },
  { name: '北海', lat: 21.48, lng: 109.10, isTarget: true },
  // 干扰项
  { name: '大理', lat: 25.61, lng: 100.27, isTarget: false },
  { name: '丽江', lat: 26.87, lng: 100.23, isTarget: false },
  { name: '重庆', lat: 29.56, lng: 106.55, isTarget: false },
  { name: '贵阳', lat: 26.57, lng: 106.71, isTarget: false },
  { name: '普洱', lat: 22.79, lng: 100.97, isTarget: false },
  { name: '桂林', lat: 25.28, lng: 110.28, isTarget: false },
  { name: '成都', lat: 30.67, lng: 104.07, isTarget: false },
  { name: '三亚', lat: 18.25, lng: 109.51, isTarget: false },
  { name: '香格里拉', lat: 27.83, lng: 99.70, isTarget: false },
  { name: '腾冲', lat: 25.02, lng: 98.49, isTarget: false },
];

// 解锁成功弹窗
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
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

            <h3 className="text-2xl font-bold text-[#7C444F] mb-3 relative z-10">成就达成！</h3>

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

// 错误提示 Toast
const ErrorToast = ({ isOpen }: { isOpen: boolean }) => {
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
          <span>走错路啦，这不是我们去北海的轨迹哦~</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 星空背景组件
const StarryBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 深邃宇宙渐变 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black" />

      {/* 星星 */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* 星云效果 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
    </div>
  );
};

export default function GlobeLock() {
  const { isLevelUnlocked, unlockLevel, showToast } = useGame();
  const [visitedCities, setVisitedCities] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 设置地球自转
  useEffect(() => {
    if (globeRef.current && isMounted) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.enableZoom = true;
        controls.enablePan = false;
      }
    }
  }, [isMounted]);

  // 检查是否已解锁
  const isAlreadyUnlocked = isLevelUnlocked(3);

  // 计算 arcs 数据（已连接的城市对）
  const arcsData = useMemo(() => {
    if (visitedCities.length < 2) return [];

    return visitedCities.slice(1).map((cityName, index) => {
      const fromCity = CITIES.find((c) => c.name === visitedCities[index])!;
      const toCity = CITIES.find((c) => c.name === cityName)!;

      return {
        startLat: fromCity.lat,
        startLng: fromCity.lng,
        endLat: toCity.lat,
        endLng: toCity.lng,
        color: ['#FFD700', '#FFA500'],
      };
    });
  }, [visitedCities]);

  // 处理城市点击
  const handleCityClick = useCallback(
    (city: typeof CITIES[0]) => {
      if (isAlreadyUnlocked || showSuccess) return;

      const currentStep = visitedCities.length;
      const expectedCity = CORRECT_PATH[currentStep];

      if (city.name === expectedCity) {
        // 正确点击
        setVisitedCities((prev) => [...prev, city.name]);

        // 注意：不干预相机视角，让用户自由缩放和拖拽

        // 检查是否完成
        if (currentStep + 1 === CORRECT_PATH.length) {
          setTimeout(() => {
            setShowSuccess(true);
            unlockLevel(3);
            showToast('🎉 星图解锁成功！成就勋章已开启', 'success');
          }, 1000);
        }
      } else {
        // 错误点击 - 触发震动和重置
        setIsError(true);
        setShowError(true);

        // 屏幕震动效果
        if (typeof document !== 'undefined') {
          document.body.style.transform = 'translateX(5px)';
          setTimeout(() => {
            document.body.style.transform = 'translateX(-5px)';
            setTimeout(() => {
              document.body.style.transform = 'translateX(5px)';
              setTimeout(() => {
                document.body.style.transform = 'translateX(0)';
              }, 50);
            }, 50);
          }, 50);
        }

        setTimeout(() => {
          setVisitedCities([]);
          setIsError(false);
        }, 800);
      }
    },
    [visitedCities, isAlreadyUnlocked, showSuccess, unlockLevel, showToast]
  );

  // 构建 htmlElementsData - 所有城市外观一致，无剧透提示
  const htmlElementsData = useMemo(() => {
    return CITIES.map((city) => ({
      lat: city.lat,
      lng: city.lng,
      name: city.name,
    }));
  }, []);

  // 渲染 HTML 标签 - 所有城市完全一致，不区分已访问/下一个
  const htmlElement = useCallback((d: any) => {
    const el = document.createElement('div');

    el.innerHTML = `
      <div class="flex flex-col items-center cursor-pointer group">
        <div class="w-3 h-3 rounded-full bg-white/70 group-hover:bg-white transition-all duration-300"></div>
        <div class="text-xs font-medium text-white/90 drop-shadow-md whitespace-nowrap mt-1 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm group-hover:bg-black/50 transition-colors">
          ${d.name}
        </div>
      </div>
    `;

    el.style.pointerEvents = 'auto';
    el.onclick = () => {
      const city = CITIES.find((c) => c.name === d.name);
      if (city) handleCityClick(city);
    };

    return el;
  }, [handleCityClick]);

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
        className="max-w-4xl mx-auto"
      >
        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Lock className="w-5 h-5 text-[#E35D6A]" />
            <h3 className="text-lg font-bold text-[#7C444F]">北海轨迹星图锁</h3>
          </div>
          <p className="text-[#9B6A6C] text-sm">
            在3D地球上找到我们去北海的正确路线
          </p>
          <p className="text-[#9B6A6C]/70 text-xs mt-1">
            提示：从昆明出发，一路向东南...
          </p>
        </div>

        {/* 3D 地球容器 */}
        <motion.div
          animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ height: '500px' }}
        >
          <StarryBackground />

          {isMounted && (
            <Globe
              ref={globeRef}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              backgroundColor="rgba(0,0,0,0)"
              atmosphereColor="rgba(100, 149, 237, 0.3)"
              atmosphereAltitude={0.25}
              arcsData={arcsData}
              arcColor="color"
              arcDashLength={0.4}
              arcDashGap={0.2}
              arcDashAnimateTime={1500}
              arcStroke={0.5}
              htmlElementsData={htmlElementsData}
              htmlElement={htmlElement}
            />
          )}

          {/* 进度指示器 - 简化为点数 */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="flex items-center space-x-1">
              {CORRECT_PATH.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index < visitedCities.length
                      ? 'bg-yellow-400'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 简洁提示 */}
        <p className="text-center text-[#9B6A6C]/70 text-xs mt-4">
          点击地球上的城市节点来连接路线
        </p>
      </motion.div>

      {/* 错误提示 */}
      <ErrorToast isOpen={showError} />

      {/* 成功弹窗 */}
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
