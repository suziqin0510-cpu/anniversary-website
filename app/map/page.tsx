'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Calendar, Terminal } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0F0F13] pt-24 pb-12">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,165,116,0.05)_0%,_transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass-effect rounded-full mb-4">
            <MapPin className="w-4 h-4 text-[#D4A574]" />
            <span className="text-xs text-[#8A8A92] font-mono">LOCATION_DATA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            足迹地图
          </h1>
          <p className="text-[#8A8A92]">
            从昆明到马来西亚，记录我们一起走过的每一个地方
          </p>

          {/* 统计 */}
          <div className="mt-8 inline-flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4A574]">{places.length}</div>
              <div className="text-xs text-[#8A8A92]">城市</div>
            </div>
            <div className="w-px h-8 bg-[#2A2A32]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4A574]">2</div>
              <div className="text-xs text-[#8A8A92]">国家</div>
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
            <div className="glass-effect rounded-2xl p-6 h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-[#D4A574]/30 mx-auto mb-4" />
                  <p className="text-[#8A8A92]">地图功能需要接入 Mapbox/Google Maps API</p>
                  <p className="text-[#8A8A92]/60 text-sm mt-2">部署前配置 API Key 即可显示</p>
                </div>
              </div>

              {/* 装饰性路线 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 200 300 Q 250 250 300 280 T 400 260 T 500 300 T 600 280"
                  stroke="#D4A574"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8 4"
                  className="opacity-30"
                />
              </svg>

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
                  <div className={`w-4 h-4 rounded-full ${selectedPlace.id === place.id ? 'bg-[#D4A574]' : 'bg-[#D4A574]/50'} border-2 border-[#0F0F13]`} />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4A574]/30 rounded-full" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* 地点列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-mono text-[#8A8A92] mb-4">// LOCATIONS</h3>
            {places.map((place, index) => (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedPlace.id === place.id
                    ? 'glass-effect border-[#D4A574]/50'
                    : 'hover:bg-[#1A1A1F]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedPlace.id === place.id
                      ? 'bg-[#D4A574] text-[#0F0F13]'
                      : 'bg-[#2A2A32] text-[#8A8A92]'
                  }`}>
                    <span className="text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#E8E8EC] font-medium">{place.name}</h4>
                    <p className="text-xs text-[#8A8A92] truncate">{place.description}</p>
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
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-[#E8E8EC]">{selectedPlace.name}</h2>
                  <span className="px-2 py-0.5 rounded bg-[#D4A574]/20 text-xs text-[#D4A574] font-mono">
                    {selectedPlace.coordinates}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-[#8A8A92]">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedPlace.date}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => window.open(`https://map.baidu.com/search/${encodeURIComponent(selectedPlace.name)}`, '_blank')}
                className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] rounded-lg hover:bg-[#D4A574]/30 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>导航</span>
              </button>
            </div>
            <p className="text-[#E8E8EC]/80">{selectedPlace.story}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
