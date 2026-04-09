'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// 底图（刮开后显示）- 专属兑换券
const REVEALED_IMAGE = 'https://i.ibb.co/Y7KMm8kD/Gemini-Generated-Image-fv8h9pfv8h9pfv8h.png';
// 涂层（刮刮层）- 温馨合影
const COVER_IMAGE = 'https://i.ibb.co/kgSsXvhP/Gemini-Generated-Image-q5nusaq5nusaq5nu.png';

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealedImageLoaded, setIsRevealedImageLoaded] = useState(false);
  const [isCoverImageLoaded, setIsCoverImageLoaded] = useState(false);
  const [coverImageError, setCoverImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const pixelsRef = useRef<ImageData | null>(null);
  // 强制熔断标记，防止重复执行
  const fallbackTriggeredRef = useRef(false);

  // 初始化画布涂层 - 严格顺序：获取Canvas→加载图片→绘制
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取容器实际尺寸
    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    // 设置画布尺寸
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctxRef.current = ctx;

    // ========== 强制熔断定时器：2秒后无论如何解除加载状态 ==========
    const fallbackTimer = setTimeout(() => {
      console.warn('【强制熔断】2秒超时，强制使用降级方案');
      if (!fallbackTriggeredRef.current) {
        fallbackTriggeredRef.current = true;

        // 降级方案：填充漂亮的粉色矩形
        ctx.fillStyle = '#fbcfe8'; // Tailwind pink-200
        ctx.fillRect(0, 0, width, height);

        // 添加装饰性圆点
        ctx.fillStyle = '#f9a8d4'; // Tailwind pink-300
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const r = Math.random() * 15 + 5;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // 绘制文字
        ctx.fillStyle = '#be185d'; // Tailwind pink-700
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('刮开有奖', width / 2, height / 2 - 15);
        ctx.font = '14px sans-serif';
        ctx.fillText('✨ 惊喜等你发现 ✨', width / 2, height / 2 + 20);

        pixelsRef.current = ctx.getImageData(0, 0, width, height);
        setCanvasReady(true);
        setIsCoverImageLoaded(true);
        setIsLoading(false);
      }
    }, 2000); // 2秒强制熔断

    // 严格顺序：创建Image → 设置onload/onerror → 设置src
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      clearTimeout(fallbackTimer);
      if (fallbackTriggeredRef.current) return; // 如果已熔断，不再绘制

      // 图片加载完成后再绘制
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        drawHeight = height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // 添加轻微遮罩使图片稍微变暗
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // 绘制提示文字
      ctx.font = 'bold 18px cursive, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText('刮开这温馨的一刻', width / 2, height / 2 - 15);
      ctx.fillText('领取惊喜 ✨', width / 2, height / 2 + 15);
      ctx.shadowBlur = 0;

      // 保存初始像素数据用于计算
      pixelsRef.current = ctx.getImageData(0, 0, width, height);
      setCanvasReady(true);
      setIsCoverImageLoaded(true);
      setIsLoading(false);
    };

    img.onerror = () => {
      clearTimeout(fallbackTimer);
      if (fallbackTriggeredRef.current) return;
      fallbackTriggeredRef.current = true;

      console.warn('封面图片加载失败，使用降级方案');
      setCoverImageError(true);

      // 降级方案：填充漂亮的粉色矩形
      ctx.fillStyle = '#fbcfe8'; // Tailwind pink-200
      ctx.fillRect(0, 0, width, height);

      // 添加装饰性圆点
      ctx.fillStyle = '#f9a8d4'; // Tailwind pink-300
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 15 + 5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 绘制文字
      ctx.fillStyle = '#be185d'; // Tailwind pink-700
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('刮开有奖', width / 2, height / 2 - 15);
      ctx.font = '14px sans-serif';
      ctx.fillText('✨ 惊喜等你发现 ✨', width / 2, height / 2 + 20);

      pixelsRef.current = ctx.getImageData(0, 0, width, height);
      setCanvasReady(true);
      setIsCoverImageLoaded(true);
      setIsLoading(false);
    };

    // 必须：先设置onload/onerror，再设置src
    img.src = COVER_IMAGE;

    return () => clearTimeout(fallbackTimer);
  }, []);

  // 初始化画布 - 组件挂载后执行
  useEffect(() => {
    // 延迟确保容器已渲染
    const timer = setTimeout(() => {
      initCanvas();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 额外的安全熔断：组件挂载后无论发生什么，3秒后强制解除加载状态
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (isLoading) {
        console.warn('【安全熔断】3秒全局超时，强制解除加载状态');
        setIsLoading(false);
        setIsCoverImageLoaded(true);
        setIsRevealedImageLoaded(true);

        // 如果 Canvas 还没有准备好，绘制一个紧急降级层
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container && !canvasReady) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const rect = container.getBoundingClientRect();
            canvas.width = Math.floor(rect.width);
            canvas.height = Math.floor(rect.height);

            // 紧急填充粉色背景
            ctx.fillStyle = '#fbcfe8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#be185d';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('刮开有奖 ✨', canvas.width / 2, canvas.height / 2);
          }
        }
      }
    }, 3000);

    return () => clearTimeout(safetyTimer);
  }, [isLoading, canvasReady]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (!isRevealed && isCoverImageLoaded) {
        // 重新初始化 Canvas
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);

        // 重新绘制粉色背景
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#be185d';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('刮开有奖 ✨', canvas.width / 2, canvas.height / 2);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isRevealed, isCoverImageLoaded]);

  // 计算已刮开百分比
  const calculateScratchedPercent = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !pixelsRef.current) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    // 每10个像素采样一次以提高性能
    for (let i = 3; i < pixels.length; i += 40) {
      if (pixels[i] < 128) {
        transparentCount++;
      }
    }

    return (transparentCount / (totalPixels / 10)) * 100;
  }, []);

  // 刮开操作
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || isRevealed || !canvasReady) return;

    ctx.globalCompositeOperation = 'destination-out';

    // 主刮开区域
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // 添加一些随机小点使边缘更自然
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * 25;
      const offsetY = (Math.random() - 0.5) * 25;
      ctx.beginPath();
      ctx.arc(x + offsetX, y + offsetY, Math.random() * 12 + 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';

    // 计算刮开百分比
    const percent = calculateScratchedPercent();
    setScratchedPercent(percent);

    // 超过50%自动揭示
    if (percent > 50) {
      setIsRevealed(true);
    }
  }, [isRevealed, canvasReady, calculateScratchedPercent]);

  // 鼠标/触摸事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsScratching(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  // 底图加载状态处理
  const handleRevealedImageLoad = () => {
    setIsRevealedImageLoaded(true);
  };

  const handleRevealedImageError = () => {
    // 即使底图加载失败，也允许刮开（显示纯色背景）
    setIsRevealedImageLoaded(true);
  };

  const bothImagesReady = isRevealedImageLoaded && isCoverImageLoaded;

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-pointer select-none bg-transparent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {/* 底层内容 - 专属兑换券（刮开后显示） */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-0">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-lg mb-3 bg-rose-100">
          <img
            src={REVEALED_IMAGE}
            alt="专属兑换券"
            className="w-full h-full object-cover"
            onLoad={handleRevealedImageLoad}
            onError={handleRevealedImageError}
          />
        </div>
        <p className="text-base sm:text-lg font-handwriting text-gray-900 text-center drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
          苏子钦的专属兑换券
        </p>
        <p className="text-xs text-gray-800 mt-1 text-center drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
          凭此券可兑换任意愿望一个
        </p>
      </div>

      {/* Canvas 刮刮涂层 - 温馨合影 */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              cursor: isScratching ? 'grabbing' : 'grab',
              touchAction: 'none',
              opacity: isLoading ? 0 : 1 // 加载中时隐藏，加载完成后显示
            }}
          />
        )}
      </AnimatePresence>

      {/* 加载中提示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center space-x-2 text-white drop-shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">加载中...</span>
          </div>
        </div>
      )}

      {/* 进度提示 */}
      {!isRevealed && scratchedPercent > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm"
        >
          {Math.round(scratchedPercent)}%
        </motion.div>
      )}

      {/* 已揭示提示 */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 bg-[#E35D6A] text-white text-xs px-2 py-1 rounded-full shadow-lg"
        >
          已刮开 ✨
        </motion.div>
      )}
    </motion.div>
  );
}
