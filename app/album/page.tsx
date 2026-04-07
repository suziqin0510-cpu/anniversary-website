'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar } from 'lucide-react';

// 相册照片数据
const ALBUM_PHOTOS = [
  { id: 1, src: "/album/IMG_7660.jpg", title: "", date: "", location: "", story: "" },
  { id: 2, src: "/album/IMG_7765.jpg", title: "", date: "", location: "", story: "" },
  { id: 3, src: "/album/IMG_7785.jpg", title: "", date: "", location: "", story: "" },
  { id: 4, src: "/album/IMG_7953.jpg", title: "", date: "", location: "", story: "" },
  { id: 5, src: "/album/IMG_7983.jpg", title: "", date: "", location: "", story: "" },
  { id: 6, src: "/album/IMG_8246.jpg", title: "", date: "", location: "", story: "" },
  { id: 7, src: "/album/IMG_8254.jpg", title: "", date: "", location: "", story: "" },
  { id: 8, src: "/album/IMG_8352.jpg", title: "", date: "", location: "", story: "" },
  { id: 9, src: "/album/IMG_8356.jpg", title: "", date: "", location: "", story: "" },
  { id: 10, src: "/album/IMG_8378.jpg", title: "", date: "", location: "", story: "" },
  { id: 11, src: "/album/IMG_8390.jpg", title: "", date: "", location: "", story: "" },
  { id: 12, src: "/album/IMG_8402.jpg", title: "", date: "", location: "", story: "" },
  { id: 13, src: "/album/IMG_8467.jpg", title: "", date: "", location: "", story: "" },
  { id: 14, src: "/album/IMG_8613.jpg", title: "", date: "", location: "", story: "" },
  { id: 15, src: "/album/IMG_8680.jpg", title: "", date: "", location: "", story: "" },
  { id: 16, src: "/album/IMG_8760.jpg", title: "", date: "", location: "", story: "" },
  { id: 17, src: "/album/IMG_8814.jpg", title: "", date: "", location: "", story: "" },
  { id: 18, src: "/album/IMG_8842.jpg", title: "", date: "", location: "", story: "" },
  { id: 19, src: "/album/IMG_8856.jpg", title: "", date: "", location: "", story: "" },
  { id: 20, src: "/album/fxn 2025-06-17 183643.526.JPG", title: "", date: "", location: "", story: "" },
  { id: 21, src: "/album/fxn 2025-06-17 183755.274.JPG", title: "", date: "", location: "", story: "" },
  { id: 22, src: "/album/fxn 2025-06-20 171234.554.JPG", title: "", date: "", location: "", story: "" },
  { id: 23, src: "/album/fxn 2025-06-22 152536.764.JPG", title: "", date: "", location: "", story: "" },
  { id: 24, src: "/album/fxn 2025-06-22 152626.269.JPG", title: "", date: "", location: "", story: "" },
];

// 和纸胶带颜色
const WASHI_TAPES = [
  'bg-rose-200/60',
  'bg-amber-200/60',
  'bg-pink-200/60',
  'bg-orange-200/60',
];

// 单张照片组件 - 极简展示
const HangingPhoto = ({
  photo,
  onClick,
  index,
}: {
  photo: (typeof ALBUM_PHOTOS)[0];
  onClick: (photo: (typeof ALBUM_PHOTOS)[0]) => void;
  index: number;
}) => {
  // 随机旋转角度，营造自然感
  const rotation = (index % 3 - 1) * 2;
  const washiColor = WASHI_TAPES[index % WASHI_TAPES.length];

  return (
    <motion.div
      className="relative cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={() => onClick(photo)}
    >
      {/* 悬挂绳 - 极细拉线 */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-rose-300 to-rose-300" />

      {/* 夹子 */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-rose-300 rounded-sm shadow-sm" />

      {/* 照片容器 - 白边拍立得风格 */}
      <div
        className="relative bg-white p-3 pb-16 shadow-md hover:shadow-xl transition-all duration-500 ease-out group-hover:scale-[1.02]"
        style={{ aspectRatio: '4/5' }}
      >
        {/* 照片内容区 - 直接显示彩色清晰图片 */}
        <div className="relative w-full h-0 pb-[100%] overflow-hidden bg-rose-50">
          <img
            src={photo.src}
            alt={photo.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* 照片标题 */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-rose-800 font-medium text-sm">
            {photo.title}
          </p>
          <p className="text-rose-400 text-xs mt-0.5">
            点击查看详情
          </p>
        </div>

        {/* 和纸胶带效果 */}
        <div
          className={`absolute -top-1 left-2 w-12 h-5 -rotate-6 ${washiColor} rounded-sm shadow-sm`}
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 6px)',
          }}
        />

        {/* 火漆印章效果 - 右下角 */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-300 to-rose-400 shadow-md flex items-center justify-center border-2 border-rose-200">
            <span className="text-white text-[10px]">✦</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 详情弹窗组件
const PhotoModal = ({
  photo,
  isOpen,
  onClose,
}: {
  photo: (typeof ALBUM_PHOTOS)[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!photo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-rose-950/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 和纸装饰 - 顶部 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div
                className="w-24 h-6 bg-rose-200/70 rounded-sm -rotate-1 shadow-sm"
                style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)',
                }}
              />
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-rose-400 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 照片 */}
            <div className="relative aspect-[4/3]">
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 信息区 */}
            <div className="p-6 bg-gradient-to-b from-white to-rose-50/30">
              <h2 className="text-2xl font-bold text-rose-800 mb-3">
                {photo.title}
              </h2>

              <div className="flex items-center space-x-4 text-sm text-rose-500 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{photo.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{photo.date}</span>
                </div>
              </div>

              <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                <p className="text-rose-700 leading-relaxed italic">
                  "{photo.story}"
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center space-x-2 text-rose-400 text-sm">
                <span>✦</span>
                <span className="font-medium">苏子钦 & 李丹</span>
                <span>✦</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function AlbumPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof ALBUM_PHOTOS)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhotoClick = useCallback((photo: (typeof ALBUM_PHOTOS)[0]) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white pt-20 pb-12 relative overflow-hidden">
      {/* 背景装饰 - 极淡 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose-100 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-100 rounded-full blur-3xl" />
      </div>

      {/* 顶部拉线装饰 */}
      <div className="absolute top-28 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
      </div>
      <div className="absolute top-[28rem] left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-rose-200/50 to-transparent" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区 - 极简 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-rose-800 tracking-wider">
            我们的相册
          </h1>
        </motion.div>

        {/* 照片网格 - 时光晾晒架 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 pt-8">
          {ALBUM_PHOTOS.map((photo, index) => (
            <HangingPhoto
              key={photo.id}
              photo={photo}
              onClick={handlePhotoClick}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      <PhotoModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
