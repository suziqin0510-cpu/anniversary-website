'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Calendar, Clock } from 'lucide-react';

// 示例视频数据
const videos = [
  {
    id: '1',
    title: '我们的第一年',
    description: '从相识到相恋，记录我们共同走过的365天',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // 示例视频
    duration: '05:20',
    date: '2027-05-20',
    views: 520,
  },
];

export default function VideoPage() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFAF8] to-[#FFF8F5] pt-24 pb-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-8 h-8 text-[#E8A598] mx-auto mb-4 fill-[#E8A598]" />
          <h1 className="text-4xl md:text-5xl font-light text-[#2D2D2D] mb-4">
            纪念视频
          </h1>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto">
            用影像记录我们的爱情故事
          </p>
        </motion.div>
      </div>

      {/* Main Video Player */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
        >
          {isPlaying ? (
            <iframe
              src={selectedVideo.url}
              title={selectedVideo.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setIsPlaying(true)}
            >
              {/* Thumbnail */}
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
              />
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-[#E8A598] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </motion.div>
              </div>
              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-full text-white text-sm">
                {selectedVideo.duration}
              </div>
            </div>
          )}
        </motion.div>

        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-medium text-[#2D2D2D] mb-2">
            {selectedVideo.title}
          </h2>
          <p className="text-[#6B6B6B] mb-4">{selectedVideo.description}</p>

          <div className="flex items-center space-x-6 text-sm text-[#6B6B6B]">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{selectedVideo.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{selectedVideo.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-[#E8A598]" />
              <span>{selectedVideo.views} 次观看</span>
            </div>
          </div>
        </motion.div>

        {/* Video List */}
        {videos.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-4">更多视频</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    setIsPlaying(false);
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    selectedVideo.id === video.id
                      ? 'border-[#E8A598]'
                      : 'border-transparent hover:border-[#E8A598]/50'
                  }`}
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-white text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-[#2D2D2D] truncate">
                      {video.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State / Upload Hint */}
        {videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Heart className="w-12 h-12 text-[#E8A598]/30 mx-auto mb-4" />
            <p className="text-[#6B6B6B] mb-2">还没有上传视频</p>
            <p className="text-sm text-[#6B6B6B]/60">
              请在管理后台上传你们的纪念视频
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
