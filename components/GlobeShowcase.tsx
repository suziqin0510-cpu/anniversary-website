'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
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

// 所有旅行过的城市
const TRAVEL_CITIES = [
  { name: '昆明', lat: 24.88, lng: 102.83, date: '2025.05' },
  { name: '大理', lat: 25.61, lng: 100.27, date: '2025.06' },
  { name: '丽江', lat: 26.87, lng: 100.23, date: '2025.06' },
  { name: '香格里拉', lat: 27.83, lng: 99.70, date: '2025.07' },
  { name: '芒市', lat: 24.43, lng: 98.58, date: '2025.07' },
  { name: '腾冲', lat: 25.02, lng: 98.49, date: '2025.07' },
  { name: '泸沽湖', lat: 27.71, lng: 100.75, date: '2025.07' },
  { name: '贵阳', lat: 26.57, lng: 106.71, date: '2025.08' },
  { name: '重庆', lat: 29.56, lng: 106.55, date: '2025.08' },
  { name: '会泽', lat: 26.42, lng: 103.30, date: '2025.08' },
  { name: '六盘水', lat: 26.59, lng: 104.83, date: '2025.08' },
  { name: '兴义', lat: 25.09, lng: 104.90, date: '2025.09' },
  { name: '百色', lat: 23.90, lng: 106.62, date: '2025.08' },
  { name: '南宁', lat: 22.82, lng: 108.32, date: '2025.08' },
  { name: '北海', lat: 21.48, lng: 109.10, date: '2025.09' },
  { name: '普者黑', lat: 24.05, lng: 103.98, date: '2025.09' },
  { name: '普洱', lat: 22.79, lng: 100.97, date: '2025.10' },
  { name: '景迈山', lat: 22.16, lng: 100.03, date: '2025.10' },
  { name: '槟城', lat: 5.42, lng: 100.33, date: '2026.02' },
  { name: '吉隆坡', lat: 3.14, lng: 101.69, date: '2026.02' },
];

// 航线连接 - 按时间顺序
const FLIGHT_ROUTES = [
  { from: '昆明', to: '大理' },
  { from: '大理', to: '丽江' },
  { from: '丽江', to: '香格里拉' },
  { from: '香格里拉', to: '泸沽湖' },
  { from: '泸沽湖', to: '昆明' },
  { from: '昆明', to: '芒市' },
  { from: '芒市', to: '腾冲' },
  { from: '腾冲', to: '昆明' },
  { from: '昆明', to: '贵阳' },
  { from: '贵阳', to: '重庆' },
  { from: '重庆', to: '昆明' },
  { from: '昆明', to: '会泽' },
  { from: '会泽', to: '六盘水' },
  { from: '六盘水', to: '兴义' },
  { from: '兴义', to: '百色' },
  { from: '百色', to: '南宁' },
  { from: '南宁', to: '北海' },
  { from: '北海', to: '南宁' },
  { from: '南宁', to: '昆明' },
  { from: '昆明', to: '普者黑' },
  { from: '普者黑', to: '昆明' },
  { from: '昆明', to: '普洱' },
  { from: '普洱', to: '景迈山' },
  { from: '景迈山', to: '昆明' },
  { from: '昆明', to: '槟城' },
  { from: '槟城', to: '吉隆坡' },
];

export default function GlobeShowcase() {
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
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.enablePan = false;
      }
    }
  }, [isMounted]);

  // 构建 arcs 数据
  const arcsData = useMemo(() => {
    return FLIGHT_ROUTES.map((route) => {
      const fromCity = TRAVEL_CITIES.find((c) => c.name === route.from)!;
      const toCity = TRAVEL_CITIES.find((c) => c.name === route.to)!;

      return {
        startLat: fromCity.lat,
        startLng: fromCity.lng,
        endLat: toCity.lat,
        endLng: toCity.lng,
        color: ['#F4A460', '#E35D6A'],
      };
    });
  }, []);

  // 构建 htmlElementsData
  const htmlElementsData = useMemo(() => {
    return TRAVEL_CITIES.map((city) => ({
      lat: city.lat,
      lng: city.lng,
      name: city.name,
      date: city.date,
    }));
  }, []);

  // 渲染 HTML 标签
  const htmlElement = (d: any) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="flex flex-col items-center group cursor-pointer">
        <div class="w-2 h-2 rounded-full bg-gradient-to-r from-[#F4A460] to-[#E35D6A] shadow-[0_0_8px_rgba(227,93,106,0.6)] group-hover:scale-125 transition-transform"></div>
        <div class="text-[10px] font-medium text-white/90 drop-shadow-md whitespace-nowrap mt-1 px-1.5 py-0.5 rounded-full bg-[#E35D6A]/60 backdrop-blur-sm group-hover:bg-[#E35D6A]/80 transition-colors">
          ${d.name}
        </div>
      </div>
    `;
    el.style.pointerEvents = 'auto';
    return el;
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ height: '550px' }}
      >
        {/* 粉色/橘色氛围光晕背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 via-slate-900 to-orange-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-orange-500/20" />

        {/* 外层光晕效果 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[90%] h-[90%] rounded-full bg-gradient-to-r from-rose-400/10 via-transparent to-orange-400/10 blur-3xl" />
        </div>

        {/* 星星背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {isMounted && (
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="rgba(244, 164, 96, 0.4)"
            atmosphereAltitude={0.3}
            arcsData={arcsData}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={4}
            arcDashAnimateTime={1500}
            arcStroke={0.3}
            arcAltitudeAutoScale={0.4}
            htmlElementsData={htmlElementsData}
            htmlElement={htmlElement}
          />
        )}

        {/* 装饰性标题覆盖层 */}
        <div className="absolute top-6 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-rose-200/60 text-xs tracking-[0.3em] uppercase">Our Journey</p>
            <p className="text-white/80 text-lg font-handwriting mt-1">苏子钦 & 李丹</p>
            <p className="text-rose-300/50 text-xs mt-1">2025-2026</p>
          </motion.div>
        </div>

        {/* 统计信息 */}
        <div className="absolute bottom-6 right-6 z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10"
          >
            <div className="flex items-center space-x-4 text-white/80 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-300">{TRAVEL_CITIES.length}</p>
                <p className="text-[10px] text-white/50">足迹</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-300">{FLIGHT_ROUTES.length}</p>
                <p className="text-[10px] text-white/50">航线</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
