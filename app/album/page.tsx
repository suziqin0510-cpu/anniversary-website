'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar } from 'lucide-react';

// 相册照片数据
const ALBUM_PHOTOS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    title: '初遇昆明',
    date: '2025.05.20',
    location: '昆明长水机场',
    story: '那个夏天，我们在机场出口第一眼相遇。你说我比照片上看起来更害羞，我说你比想象中更耀眼。',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    title: '大理的风',
    date: '2025.06.15',
    location: '大理古城',
    story: '苍山洱海旁，我们一起骑单车环海。你说风里有自由的味道，我说风里有你的味道。',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    title: '星空露营',
    date: '2025.07.20',
    location: '丽江玉龙雪山',
    story: '帐篷外是满天繁星，帐篷内是你熟睡的脸庞。那一刻我觉得，拥有你就拥有了整个宇宙。',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    title: '雨中漫步',
    date: '2025.08.08',
    location: '香格里拉',
    story: '突如其来的雨，我们没有躲，反而在雨中跳起舞。你说浪漫就是和喜欢的人一起发疯。',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    title: '海边日落',
    date: '2025.09.12',
    location: '北海银滩',
    story: '夕阳把整个海面染成金色，你靠在我肩头说希望时间静止。我说好，那我们就定格在这一秒。',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    title: '烟火大会',
    date: '2025.10.01',
    location: '桂林阳朔',
    story: '漫天烟花绽放时，你闭上眼睛许愿。我问你许了什么，你说希望每年都能和你一起看烟花。',
  },
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
