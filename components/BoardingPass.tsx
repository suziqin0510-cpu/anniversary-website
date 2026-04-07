'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Compass } from 'lucide-react';

interface BoardingPassProps {
  isOpen: boolean;
  onClose: () => void;
}

// 生成条形码的随机宽度
const generateBarcode = () => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    width: Math.random() * 4 + 1,
    height: Math.random() * 30 + 25,
    opacity: Math.random() * 0.5 + 0.5,
  }));
};

const BARCODE_DATA = generateBarcode();

export default function BoardingPass({ isOpen, onClose }: BoardingPassProps) {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      alert('机票已保存！愿我们的旅程永远甜蜜 💕');
      setIsPressed(false);
    }, 1500);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          {/* 外围文字 - 发光标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-amber-100 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)] tracking-wider">
              苏子钦 & 李丹
            </h1>
            <p className="text-rose-200/70 text-sm mt-2 font-light tracking-[0.3em] italic">
              祝我们一周年快乐, 永远幸福!
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, y: 50, rotateX: -15 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, y: 50, rotateX: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 机票卡片 - 深邃星空曜石黑 */}
            <div className="relative overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(251,113,133,0.3)] border border-rose-900/50">
              {/* 背景渐变 */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />

              {/* 微弱纹理覆盖 */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* 主内容 - Flex布局 */}
              <div className="relative flex">
                {/* 左侧主信息区 - 70% */}
                <div className="flex-[70] p-6 md:p-8">
                  {/* 顶部标识 */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] md:text-xs text-amber-400/80 tracking-[0.2em] font-medium">
                      ★ LIFETIME FIRST CLASS ★
                    </span>
                    <Plane className="w-4 h-4 text-rose-400/60" />
                  </div>

                  {/* 核心航线 - 视觉中心 */}
                  <div className="flex items-center justify-center mb-8">
                    {/* 左侧 - 现在 */}
                    <div className="text-center">
                      <motion.p
                        className="text-3xl md:text-4xl font-bold text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        现在
                      </motion.p>
                      <p className="text-[10px] text-gray-500 tracking-widest mt-1">NOW</p>
                    </div>

                    {/* 中间 - 连接线与图标 */}
                    <div className="flex-1 mx-4 md:mx-6 relative">
                      <div className="h-px bg-gradient-to-r from-amber-500/50 via-rose-400/50 to-amber-500/50" />
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-400/20 flex items-center justify-center border border-amber-400/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Compass className="w-5 h-5 text-amber-300" />
                      </motion.div>
                    </div>

                    {/* 右侧 - 一辈子 */}
                    <div className="text-center">
                      <motion.p
                        className="text-3xl md:text-4xl font-bold text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                      >
                        一辈子
                      </motion.p>
                      <p className="text-[10px] text-gray-500 tracking-widest mt-1">FOREVER</p>
                    </div>
                  </div>

                  {/* 网格信息区 */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs md:text-sm">
                    <div>
                      <p className="text-[10px] text-gray-500 tracking-wider mb-1">PASSENGER</p>
                      <p className="text-amber-100/90 font-medium">苏子钦 & 李丹</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 tracking-wider mb-1">FLIGHT</p>
                      <p className="text-amber-100/90 font-medium">LOVE-0520</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 tracking-wider mb-1">SEAT</p>
                      <p className="text-rose-300/90 font-medium">副驾专属</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 tracking-wider mb-1">CLASS</p>
                      <p className="text-yellow-500/90 font-medium">终身头等舱</p>
                    </div>
                  </div>
                </div>

                {/* 撕裂线 - 中间虚线+半圆缺口 */}
                <div className="relative w-px">
                  {/* 上半圆缺口 */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 bg-black rounded-b-full" />

                  {/* 虚线 */}
                  <div className="h-full border-r-2 border-dashed border-gray-700/50" />

                  {/* 下半圆缺口 */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-3 bg-black rounded-t-full" />
                </div>

                {/* 右侧票根区 - 30% */}
                <div className="flex-[30] p-4 md:p-6 flex flex-col justify-between bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                  {/* 竖向核心信息 */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-[8px] text-gray-500 tracking-wider mb-1">FLIGHT</p>
                      <p className="text-amber-100/80 text-sm font-bold">0520</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-gray-500 tracking-wider mb-1">SEAT</p>
                      <p className="text-rose-300/80 text-sm font-bold">S❤L</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-gray-500 tracking-wider mb-1">DATE</p>
                      <p className="text-amber-100/60 text-xs">2025.05.20</p>
                    </div>
                  </div>

                  {/* 条形码 */}
                  <div className="mt-4">
                    <div className="flex items-end justify-center space-x-0.5 h-12">
                      {BARCODE_DATA.map((bar) => (
                        <div
                          key={bar.id}
                          className="bg-amber-100/70"
                          style={{
                            width: `${bar.width}px`,
                            height: `${bar.height}%`,
                            opacity: bar.opacity,
                          }}
                        />
                      ))}
                    </div>

                    {/* 防伪水印 */}
                    <p className="text-[6px] text-gray-600 tracking-[0.3em] text-center mt-2 font-mono">
                      LOVE FOUNDATION • SINCE 20250520
                    </p>
                  </div>
                </div>
              </div>

              {/* 底部保存按钮 */}
              <div className="relative px-6 pb-6 pt-2">
                <motion.button
                  onMouseDown={handlePressStart}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  onTouchStart={handlePressStart}
                  onTouchEnd={handlePressEnd}
                  animate={{
                    scale: isPressed ? 0.98 : 1,
                  }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/30 text-amber-100 font-medium flex items-center justify-center space-x-2 relative overflow-hidden group"
                >
                  {/* 进度条 */}
                  {isPressed && (
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, ease: 'linear' }}
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400/30 to-rose-400/30"
                    />
                  )}

                  {/* 按钮文字 */}
                  <span className="relative z-10 text-sm tracking-wider">
                    {isPressed ? '保存中...' : '长按保存这张专属机票'}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* 装饰元素 */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -left-6 text-3xl opacity-60"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -right-4 text-2xl opacity-60"
            >
              💫
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
