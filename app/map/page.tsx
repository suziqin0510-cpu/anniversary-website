'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Navigation, MapPin, X } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

// 呼吸波纹光点 Marker - 焦糖色
const RippleMarker = ({ active }: { active: boolean }) => (
  <div className={`relative ${active ? 'scale-125' : ''}`}>
    {/* 波纹效果 */}
    <span className="absolute inset-0 rounded-full bg-[#E35D6A] animate-ping opacity-40" style={{ animationDuration: '2s' }} />
    <span className="absolute inset-0 rounded-full bg-[#E35D6A] animate-ping opacity-30" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
    {/* 中心光点 */}
    <div
      className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
        active
          ? 'bg-[#E35D6A] shadow-[0_0_20px_8px_rgba(184,145,111,0.5)]'
          : 'bg-[#E35D6A]/70 shadow-[0_0_12px_4px_rgba(184,145,111,0.35)]'
      }`}
    />
  </div>
);

// 拍立得组件 - 默认隐藏，hover时显示
const Polaroid = ({
  place,
  isVisible
}: {
  place: Place;
  isVisible: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 10,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: '50%',
        top: '-140px',
        transform: 'translateX(-50%)',
        marginLeft: '0px',
      }}
    >
      <div
        className="bg-white p-2 pb-4 rounded shadow-2xl"
        style={{
          width: '100px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        }}
      >
        <div className="bg-gradient-to-br from-[#E35D6A]/15 to-[#F4A460]/15 aspect-[4/3] rounded flex items-center justify-center mb-2">
          <MapPin className="w-5 h-5 text-[#E35D6A]" />
        </div>
        <p className="text-[9px] text-[#7C444F] text-center font-medium truncate">{place.name}</p>
      </div>
      {/* 小三角指示器 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid white'
        }}
      />
    </motion.div>
  );
};

interface Place {
  id: string;
  name: string;
  description: string;
  date: string;
  coordinates: string;
  story: string;
  image: string;
}

// 所有地点数据 - 全部渲染拍立得
const places: Place[] = [
  { id: '1', name: '昆明', description: '我们的基地，袁老四的麻辣，同德的初见。', date: '2025.05.20', coordinates: '24.88°N, 102.83°E', story: '昆明是起点。长水机场惊艳的初见，同德的那顿火锅，是我们故事的开始。', image: '/photos/kunming.jpg' },
  { id: '2', name: '大理', description: '洱海的风，古城的慢时光。', date: '2025.06', coordinates: '25.61°N, 100.27°E', story: '大理的微风，吹过你的发梢。我们在古城漫步，在洱海边看云卷云舒。', image: '/photos/dali.jpg' },
  { id: '3', name: '丽江', description: '后果酒与果酒，醉人的夜晚。', date: '2025.06', coordinates: '26.87°N, 100.23°E', story: '丽江的后果酒让你睡了一路，但那个夜晚的歌声和笑声，我一直记得。', image: '/photos/lijiang.jpg' },
  { id: '4', name: '香格里拉', description: '那个没泡够的温泉食堂，遗憾的日照金山。', date: '2025.07', coordinates: '27.83°N, 99.70°E', story: '楼顶的温泉，远处没能看到的日照金山，留点遗憾给下次。', image: '/photos/shangri-la.jpg' },
  { id: '5', name: '芒市', description: '轮椅上的落日，那是羁绊加深的地方。', date: '2025.07', coordinates: '24.43°N, 98.58°E', story: '车祸后的轮椅之旅，看你腿肿成馒头，我比你还疼。', image: '/photos/mangshi.jpg' },
  { id: '6', name: '腾冲', description: '接走盼盼的地方，我们的第一个毛孩子。', date: '2025.07', coordinates: '25.02°N, 98.49°E', story: '在腾冲，我们接走了盼盼，从此开始了有毛孩子的生活。', image: '/photos/tengchong.jpg' },
  { id: '7', name: '百色', description: '游牧民族的帐篷夜，广西的野趣。', date: '2025.08', coordinates: '23.90°N, 106.62°E', story: '在百色市搭帐篷，像游牧民族一样，那是最特别的野趣经历。', image: '/photos/baise.jpg' },
  { id: '8', name: '桂林', description: '码头基地旁的帐篷，山水甲天下。', date: '2025.08', coordinates: '25.28°N, 110.28°E', story: '在桂林码头基地旁边搭帐篷，看着甲天下的山水入睡。', image: '/photos/guilin.jpg' },
  { id: '9', name: '贵阳', description: '没吃好的烙锅，六盘水的美味。', date: '2025.08', coordinates: '26.57°N, 106.71°E', story: '匆匆路过贵阳，但在六盘水吃到了超棒的烙锅。', image: '/photos/guiyang.jpg' },
  { id: '10', name: '重庆', description: '火锅与山城，火辣辣的回忆。', date: '2025.08', coordinates: '29.56°N, 106.55°E', story: '重庆的火辣，不仅仅是火锅，还有这座城市的热情。', image: '/photos/chongqing.jpg' },
  { id: '11', name: '北海', description: '住酒店吹海风，石榴加入我们的前奏。', date: '2025.09', coordinates: '21.48°N, 109.10°E', story: '在北海住酒店吹海风，等待石榴到来，我们的小窝要整整齐齐了。', image: '/photos/beihai.jpg' },
  { id: '12', name: '普洱', description: '景迈山古茶林，空气都是甜的。', date: '2025.10', coordinates: '22.79°N, 100.97°E', story: '景迈山的古茶林风景好美，我们在那里吃到了超棒的美食，连空气都是甜的。', image: '/photos/puer.jpg' },
  { id: '13', name: '马来西亚', description: '槟城/亚庇，你的校园，我们的520约定。', date: '2026.02', coordinates: '5.42°N, 100.33°E', story: '跨越山海的相见，USM的校园，我们在异国的约定。', image: '/photos/malaysia.jpg' },
];

// 计算地图上的位置
const getMapPosition = (index: number, total: number) => {
  // 使用更分散的布局算法
  const cols = 5;
  const col = index % cols;
  const row = Math.floor(index / cols);

  // 添加随机偏移，让布局更自然
  const baseLeft = 8 + col * 18;
  const baseTop = 15 + row * 22;
  const offsetLeft = (index % 3) * 3; // 轻微偏移避免对齐
  const offsetTop = (index % 2) * 4;

  return {
    left: `${baseLeft + offsetLeft}%`,
    top: `${baseTop + offsetTop}%`
  };
};

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place>(places[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPlace, setPopupPlace] = useState<Place | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  const handleMarkerClick = (place: Place, e: React.MouseEvent) => {
    e.stopPropagation();
    setPopupPlace(place);
    setShowPopup(true);
  };

  const handleMarkerHover = (placeId: string | null) => {
    setHoveredPlaceId(placeId);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-card mb-6">
            <MapPin className="w-10 h-10 text-[#E35D6A]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#7C444F] mb-2 font-handwriting">足迹地图</h1>
          <p className="text-[#9B6A6C]">从昆明到马来西亚，记录我们一起走过的每一个地方</p>
          <div className="mt-8 inline-flex items-center space-x-8 glass-card rounded-full px-8 py-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E35D6A]">{places.length}</div>
              <div className="text-xs text-[#9B6A6C]">足迹</div>
            </div>
            <div className="w-px h-8 bg-[#E35D6A]/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E35D6A]">2</div>
              <div className="text-xs text-[#9B6A6C]">国家</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.01} glareEnable={false} style={{ borderRadius: '1.5rem' }}>
              <div className="glass-card rounded-3xl p-6 h-[500px] relative overflow-hidden">
                <svg viewBox="0 0 800 600" className="w-full h-full opacity-15">
                  <path d="M200,300 Q250,250 300,280 T400,260 T500,280 T600,300 T650,350" fill="none" stroke="#E35D6A" strokeWidth="2" strokeDasharray="5,5" />
                </svg>

                {/* 所有地点的拍立得 - 默认隐藏，hover时显示 */}
                {places.map((place, index) => {
                  const pos = getMapPosition(index, places.length);
                  return (
                    <div
                      key={`polaroid-${place.id}`}
                      className="absolute"
                      style={{
                        left: pos.left,
                        top: pos.top,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Polaroid
                        place={place}
                        isVisible={hoveredPlaceId === place.id}
                      />
                    </div>
                  );
                })}

                {/* 呼吸波纹光点 Marker */}
                {places.map((place, index) => {
                  const pos = getMapPosition(index, places.length);
                  return (
                    <motion.button
                      key={place.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={(e) => handleMarkerClick(place, e)}
                      onMouseEnter={() => handleMarkerHover(place.id)}
                      onMouseLeave={() => handleMarkerHover(null)}
                      className="absolute z-10"
                      style={{
                        left: pos.left,
                        top: pos.top,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <RippleMarker active={selectedPlace.id === place.id} />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#7C444F] whitespace-nowrap bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                        {place.name}
                      </span>
                    </motion.button>
                  );
                })}

                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-[#9B6A6C]/60 text-sm">💡 Hover光点查看拍立得，点击光点查看详情</p>
                </div>
              </div>
            </Tilt>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-sm text-[#9B6A6C] mb-4 font-medium">去过的地方</h3>
            <div className="glass-card rounded-3xl p-4 h-[460px] overflow-y-auto">
              <div className="space-y-2">
                {places.map((place, index) => (
                  <motion.button
                    key={place.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedPlace(place)}
                    onMouseEnter={() => handleMarkerHover(place.id)}
                    onMouseLeave={() => handleMarkerHover(null)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedPlace.id === place.id
                        ? 'bg-white/50 backdrop-blur-sm border border-[#E35D6A]/30'
                        : 'hover:bg-white/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        selectedPlace.id === place.id ? 'bg-[#E35D6A] text-white' : 'bg-[#E35D6A]/20 text-[#9B6A6C]'
                      }`}>
                        <span className="text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#7C444F] font-medium text-sm">{place.name}</h4>
                        <p className="text-xs text-[#9B6A6C] truncate">{place.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
          <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.01} glareEnable={false} style={{ borderRadius: '1.5rem' }}>
            <div className="glass-card rounded-3xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#7C444F]">{selectedPlace.name}</h2>
                    <span className="px-3 py-1 rounded-full glass-card text-xs text-[#E35D6A]">{selectedPlace.coordinates}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-[#9B6A6C]">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedPlace.date}</span>
                    </span>
                  </div>
                </div>
                <button onClick={() => window.open(`https://map.baidu.com/search/${encodeURIComponent(selectedPlace.name)}`, '_blank')} className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-4 py-2 glass-card text-[#E35D6A] rounded-xl hover:bg-white/50 transition-colors">
                  <Navigation className="w-4 h-4" />
                  <span>导航</span>
                </button>
              </div>
              <p className="text-[#7C444F]/80">{selectedPlace.story}</p>
            </div>
          </Tilt>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPopup && popupPlace && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPopup(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card rounded-3xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="h-48 bg-gradient-to-br from-[#E35D6A]/20 to-[#F4A460]/20 flex items-center justify-center relative">
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 mx-auto text-[#E35D6A]">
                    <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <p className="text-sm text-[#9B6A6C] mt-2">{popupPlace.name}</p>
                </div>
                <button onClick={() => setShowPopup(false)} className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-[#7C444F]" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#7C444F] mb-1">{popupPlace.name}</h3>
                <p className="text-sm text-[#9B6A6C] mb-3">{popupPlace.date} · {popupPlace.coordinates}</p>
                <p className="text-[#7C444F]/80 text-sm mb-4">{popupPlace.story}</p>
                <div className="flex space-x-3">
                  <button onClick={() => { setSelectedPlace(popupPlace); setShowPopup(false); }} className="flex-1 py-2 bg-[#E35D6A] text-white rounded-xl text-sm font-medium hover:bg-[#A68060] transition-colors">查看详情</button>
                  <button onClick={() => window.open(`https://map.baidu.com/search/${encodeURIComponent(popupPlace.name)}`, '_blank')} className="flex-1 py-2 border border-[#E35D6A] text-[#E35D6A] rounded-xl text-sm font-medium hover:bg-[#E35D6A]/10 transition-colors">导航</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
