'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronLeft, ChevronRight, Grid3X3, LayoutGrid } from 'lucide-react';
import Image from 'next/image';

// 示例照片数据 - 后续可从 JSON 文件加载
const samplePhotos = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80',
    title: '第一次见面',
    date: '2026-05-20',
    category: 'first-meet',
    description: '在咖啡厅的第一次约会',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    title: '第一次牵手',
    date: '2026-05-25',
    category: 'first-meet',
    description: '在公园散步时牵起了手',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    title: '夏日海边',
    date: '2026-07-15',
    category: 'travel',
    description: '第一次一起去看海',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd9a70?w=800&q=80',
    title: '日常碎片',
    date: '2026-08-20',
    category: 'daily',
    description: '一起做饭的周末',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1516589086657-713c824a7325?w=800&q=80',
    title: '看电影',
    date: '2026-09-10',
    category: 'daily',
    description: '第一次一起看电影',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    title: '秋日旅行',
    date: '2026-10-01',
    category: 'travel',
    description: '国庆假期的短途旅行',
  },
];

const categories = [
  { id: 'all', name: '全部' },
  { id: 'first-meet', name: '初见' },
  { id: 'travel', name: '旅行' },
  { id: 'daily', name: '日常' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof samplePhotos[0] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');

  const filteredPhotos = selectedCategory === 'all'
    ? samplePhotos
    : samplePhotos.filter(photo => photo.category === selectedCategory);

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFAF8] to-[#FFF8F5] pt-24 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-8 h-8 text-[#E8A598] mx-auto mb-4 fill-[#E8A598]" />
          <h1 className="text-4xl md:text-5xl font-light text-[#2D2D2D] mb-4">
            我们的照片
          </h1>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto">
            每一张照片都是一段美好的回忆，记录着我们共同的时光
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#E8A598] text-white'
                    : 'bg-white text-[#6B6B6B] hover:bg-[#FFE4E1]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2 bg-white rounded-full p-1">
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-full transition-all ${
                viewMode === 'masonry' ? 'bg-[#E8A598] text-white' : 'text-[#6B6B6B]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-all ${
                viewMode === 'grid' ? 'bg-[#E8A598] text-white' : 'text-[#6B6B6B]'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl ${
                  viewMode === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''
                }`}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className={`relative ${
                  viewMode === 'masonry' && index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'
                }`}>
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium">{photo.title}</p>
                      <p className="text-white/80 text-sm">{photo.date}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-24">
            <Heart className="w-12 h-12 text-[#E8A598]/30 mx-auto mb-4" />
            <p className="text-[#6B6B6B]">暂无照片</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[80vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                width={1200}
                height={800}
                className="w-full h-full object-contain rounded-lg"
              />
              {/* Info */}
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-medium">{selectedPhoto.title}</h3>
                <p className="text-white/60 text-sm mt-1">{selectedPhoto.date}</p>
                <p className="text-white/80 mt-2">{selectedPhoto.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
