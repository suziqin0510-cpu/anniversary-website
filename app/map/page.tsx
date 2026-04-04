'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Navigation } from 'lucide-react';

// 手绘风格地图标记
const HandDrawnPin = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <path
      d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z"
      fill={active ? "#F8AD9D" : "#F8AD9D/50"}
      stroke="#F8AD9D"
      strokeWidth="1.5"
      fillOpacity={active ? 1 : 0.5}
    />
    <circle cx="12" cy="9" r="3" fill="#5D4037" />
  </svg>
);

// 手绘风格地图
const HandDrawnMap = () => (
  <svg viewBox="0 0 400 300" fill="none" className="w-full h-full opacity-30">
    <path
      d="M50 150 Q100 100 150 120 T250 100 T350 140"
      stroke="#F8AD9D"
      strokeWidth="2"
      strokeDasharray="8 4"
      fill="none"
    />
    <path
      d="M80 180 Q130 160 180 170 T280 160 T320 180"
      stroke="#FBC3B6"
      strokeWidth="1.5"
      strokeDasharray="6 3"
      fill="none"
    />
  </svg>
);

const places = [
  {
    id: '1',
    name: '昆明',
    description: '我们的基地，袁老四的麻辣，同德的初见。',
    date: '2025.05.20',
    coordinates: '24.88°N, 102.83°E',
    story: '昆明是起点。同德的那顿火锅，是我们故事的开始。',
  },
  {
    id: '2',
    name: '香格里拉',
    description: '那个没泡够的温泉食堂，遗憾的日照金山。',
    date: '2025.07',
    coordinates: '27.83°N, 99.70°E',
    story: '楼顶的温泉，远处没能看到的日照金山，留点遗憾给下次。',
  },
  {
    id: '3',
    name: '芒市',
    description: '轮椅上的落日，那是羁绊加深的地方。',
    date: '2025.07',
    coordinates: '24.43°N, 98.58°E',
    story: '车祸后的轮椅之旅，看你腿肿成馒头，我比你还疼。',
  },
  {
    id: '4',
    name: '贵阳',
    description: '没吃好的烙锅，下次一定补上！',
    date: '2025.08',
    coordinates: '26.57°N, 106.71°E',
    story: '匆匆路过，没来得及吃好的烙锅，这个账先记着。',
  },
  {
    id: '5',
    name: '北海',
    description: '码头的帐篷，石榴加入我们的前奏。',
    date: '2025.09',
    coordinates: '21.48°N, 109.10°E',
    story: '海边的帐篷，等待石榴到来的日子。',
  },
  {
    id: '6',
    name: '马来西亚',
    description: '槟城/亚庇，你的校园，我们的520约定。',
    date: '2026.02',
    coordinates: '5.42°N, 100.33°E',
    story: '跨越山海的相见，USM的校园，我们在异国的约定。',
  },
];

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState(places[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] pt-24 pb-12">
      {/* 装饰背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#F8AD9D]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FBC3B6]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <HandDrawnPin active={true} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#5D4037] mb-2 font-handwriting">
            足迹地图
          </h1>
          <p className="text-[#8D6E63]">
            从昆明到马来西亚，记录我们一起走过的每一个地方
          </p>

          {/* 统计 */}
          <div className="mt-8 inline-flex items-center space-x-8 warm-card rounded-full px-8 py-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F8AD9D]">{places.length}</div>
              <div className="text-xs text-[#8D6E63]">城市</div>
            </div>
            <div className="w-px h-8 bg-[#F8AD9D]/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F8AD9D]">2</div>
              <div className="text-xs text-[#8D6E63]">国家</div>
            </div>
          </div>
        </motion.div>

        {/* 地图展示区 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 地图占位 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="warm-card rounded-3xl p-6 h-[500px] relative overflow-hidden">
              <HandDrawnMap />

              {/* 地点标记 */}
              {places.map((place, index) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                    selectedPlace.id === place.id ? 'scale-125 z-10' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    left: `${15 + index * 14}%`,
                    top: `${40 + (index % 2) * 20}%`,
                  }}
                >
                  <HandDrawnPin active={selectedPlace.id === place.id} />
                </button>
              ))}

              {/* 提示文字 */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-[#8D6E63]/60 text-sm">
                  💡 地图功能需要接入 Mapbox/Google Maps API
                </p>
              </div>
            </div>
          </motion.div>

          {/* 地点列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-sm text-[#8D6E63] mb-4 font-medium">去过的地方</h3>
            {places.map((place, index) => (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${
                  selectedPlace.id === place.id
                    ? 'warm-card border-[#F8AD9D]/50'
                    : 'hover:bg-[#FFF0D4]/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedPlace.id === place.id
                      ? 'bg-[#F8AD9D] text-white'
                      : 'bg-[#F8AD9D]/20 text-[#8D6E63]'
                  }`}>
                    <span className="text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#5D4037] font-medium">{place.name}</h4>
                    <p className="text-xs text-[#8D6E63] truncate">{place.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        </div>

        {/* 选中地点详情 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="warm-card rounded-3xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-[#5D4037]">{selectedPlace.name}</h2>
                  <span className="px-3 py-1 rounded-full bg-[#F8AD9D]/20 text-xs text-[#F8AD9D]">
                    {selectedPlace.coordinates}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-[#8D6E63]">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedPlace.date}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => window.open(`https://map.baidu.com/search/${encodeURIComponent(selectedPlace.name)}`, '_blank')}
                className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-[#F8AD9D]/20 text-[#F8AD9D] rounded-xl hover:bg-[#F8AD9D]/30 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>导航</span>
              </button>
            </div>
            <p className="text-[#5D4037]/80">{selectedPlace.story}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
