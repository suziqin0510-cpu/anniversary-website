'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Ticket } from 'lucide-react';
import BoardingPass from '@/components/BoardingPass';
import GlobeLock from '@/components/GlobeLock';
import GlobeShowcase from '@/components/GlobeShowcase';

interface Place {
  id: string;
  name: string;
  description: string;
  date: string;
  coordinates: string;
  story: string;
  image: string;
  x: number; // 地图上的百分比位置
  y: number;
}

// 地点数据 - 已绑定18个地点专属实景照片
const places: Place[] = [
  { id: '1', name: '昆明', description: '我们的基地，袁老四的麻辣，同德的初见。', date: '2025.05.20', coordinates: '24.88°N, 102.83°E', story: '昆明是起点。长水机场惊艳的初见，同德的那顿火锅，是我们故事的开始。', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400', x: 48, y: 58 },
  { id: '2', name: '大理', description: '洱海的风，古城的慢时光。', date: '2025.06', coordinates: '25.61°N, 100.27°E', story: '大理的微风，吹过你的发梢。我们在古城漫步，在洱海边看云卷云舒。', image: 'https://i.ibb.co/mrPKbFGj/8e0d275db8fc8f52d4cba7763388bb3f.jpg', x: 35, y: 48 },
  { id: '3', name: '丽江', description: '后果酒与果酒，醉人的夜晚。', date: '2025.06', coordinates: '26.87°N, 100.23°E', story: '丽江的后果酒让你睡了一路，但那个夜晚的歌声和笑声，我一直记得。', image: 'https://i.ibb.co/FMFZZ7F/9051412ddae22e48e83557c1cf4482ae.jpg', x: 32, y: 38 },
  { id: '4', name: '香格里拉', description: '雪山下的私汤，属于两人的私密时光。', date: '2025.07', coordinates: '27.83°N, 99.70°E', story: '在香格里拉的雪山脚下，泡在温暖的私汤里，看着窗外的雪山和星空，世界仿佛只剩下我们两个人。', image: 'https://i.ibb.co/MdrTZCn/44066b2886e775e6ae02dc3820ac703f.jpg', x: 28, y: 28 },
  { id: '5', name: '芒市', description: '轮椅上的落日，那是羁绊加深的地方。', date: '2025.07', coordinates: '24.43°N, 98.58°E', story: '车祸后的轮椅之旅，看你腿肿成馒头，我比你还疼。', image: 'https://i.ibb.co/WpBS5PTk/a2652e7046674cd935bfd7f78843f098.jpg', x: 22, y: 62 },
  { id: '6', name: '腾冲', description: '接走盼盼的地方，我们的第一个毛孩子。', date: '2025.07', coordinates: '25.02°N, 98.49°E', story: '在腾冲，我们接走了盼盼，从此开始了有毛孩子的生活。', image: 'https://i.ibb.co/x86tfYLQ/d7ac0ec18943cd7209910b78d11e1632.jpg', x: 20, y: 55 },
  { id: '7', name: '百色', description: '游牧民族的帐篷夜，广西的野趣。', date: '2025.08', coordinates: '23.90°N, 106.62°E', story: '在百色市搭帐篷，像游牧民族一样，那是最特别的野趣经历。', image: 'https://i.ibb.co/twGPF8JH/5d1e28d5507acb6ea4083c774824db8b.jpg', x: 72, y: 68 },
  { id: '9', name: '贵阳', description: '没吃好的烙锅，但六盘水的美味难忘。', date: '2025.08', coordinates: '26.57°N, 106.71°E', story: '匆匆路过贵阳，但在六盘水吃到了超棒的烙锅。', image: 'https://i.ibb.co/tMnkKmmT/12f8b8537e8a029fbd937a5cd1d5c2c6.jpg', x: 58, y: 48 },
  { id: '10', name: '重庆', description: '火锅与山城，火辣辣的回忆。', date: '2025.08', coordinates: '29.56°N, 106.55°E', story: '重庆的火辣，不仅仅是火锅，还有这座城市的热情。', image: 'https://i.ibb.co/yBf9T1Q9/08c36546183c2c4aa99016b92bd383f7.jpg', x: 62, y: 38 },
  { id: '11', name: '北海', description: '住酒店吹海风，石榴加入我们的前奏。', date: '2025.09', coordinates: '21.48°N, 109.10°E', story: '在北海住酒店吹海风，等待石榴到来，我们的小窝要整整齐齐了。', image: 'https://i.ibb.co/Nd6qbK7K/773a99925ec2a5935e0cbcc26c87ecd6.jpg', x: 78, y: 78 },
  { id: '12', name: '普洱', description: '景迈山古茶林，空气都是甜的。', date: '2025.10', coordinates: '22.79°N, 100.97°E', story: '景迈山的古茶林风景好美，我们在那里吃到了超棒的美食，连空气都是甜的。', image: 'https://i.ibb.co/C3vRfsqH/10c193401967e22fde1147d935e06450.jpg', x: 38, y: 72 },
  { id: '13', name: '槟城', description: 'USM校园，南洋风情的约定。', date: '2026.02', coordinates: '5.42°N, 100.33°E', story: '跨越山海的相见，USM的校园，我们在异国的约定。', image: 'https://i.ibb.co/mrmRnyk0/d3dfe4117e975480ecf8c3f91f562656.jpg', x: 42, y: 90 },
  { id: '14', name: '南宁', description: '绿城风情，广西的首府记忆。', date: '2025.08', coordinates: '22.82°N, 108.32°E', story: '南宁的绿城风情，让我们在这座城市留下了美好的回忆。', image: 'https://i.ibb.co/gFhSNQCW/ed48e6b0b30e6d9ef176e71fd5206753.jpg', x: 82, y: 72 },
  { id: '15', name: '普者黑', description: '荷花盛开的世外桃源。', date: '2025.09', coordinates: '24.05°N, 103.98°E', story: '普者黑的荷花与山水，仿佛走进了陶渊明笔下的世外桃源。', image: 'https://i.ibb.co/chGkhW6c/4bcd88f16b54ec0094efe0f943dac5b9.jpg', x: 52, y: 52 },
  { id: '16', name: '泸沽湖', description: '女儿国的神秘与浪漫。', date: '2025.07', coordinates: '27.71°N, 100.75°E', story: '泸沽湖的蓝天白云，猪槽船上的悠然时光，这里是东方女儿国。', image: 'https://i.ibb.co/wrsRfJyB/50e6fcce7c495c470135b80362434fac.jpg', x: 30, y: 32 },
  { id: '17', name: '吉隆坡', description: '双子塔下的都市繁华。', date: '2026.02', coordinates: '3.14°N, 101.69°E', story: '吉隆坡的双子塔在夜色中闪耀，那是异国都市的独特记忆。', image: 'https://i.ibb.co/399jHHGR/195b290c3092ff898b06c23f11da251f.jpg', x: 55, y: 92 },
  { id: '18', name: '会泽', description: '钱王之乡的古朴宁静。', date: '2025.08', coordinates: '26.42°N, 103.30°E', story: '会泽古城的每一块青石板，都诉说着岁月的故事。', image: 'https://i.ibb.co/mCqmh8Qq/d7664cc6bc583b660211c1e79e5a0827.jpg', x: 42, y: 42 },
  { id: '19', name: '兴义', description: '万峰林的壮美奇观。', date: '2025.09', coordinates: '25.09°N, 104.90°E', story: '兴义的万峰林，群峰如林，那是大自然的鬼斧神工。', image: 'https://i.ibb.co/BK6wVf8F/2cccd1ef43a8cec2006a27fff2fb0e32.jpg', x: 55, y: 55 },
  { id: '20', name: '六盘水', description: '中国凉都的清爽夏日。', date: '2025.08', coordinates: '26.59°N, 104.83°E', story: '六盘水的烙锅香味四溢，中国凉都的夏日格外清爽。', image: 'https://i.ibb.co/67hCV9sf/859f51243f2a7ee7598480afa5567db4.jpg', x: 52, y: 45 },
  { id: '21', name: '景迈山', description: '千年茶林的清香岁月。', date: '2025.10', coordinates: '22.16°N, 100.03°E', story: '景迈山的千年古茶林，每一片茶叶都承载着时光的味道。', image: 'https://images.unsplash.com/photo-1564430142-22643f5856ab?w=400', x: 35, y: 75 },
];

// 手绘风格中国/东南亚地图背景
const HandDrawnMapBackground = () => (

<div className="absolute inset-0 pointer-events-none overflow-hidden">

{/* 网格背景 */}

<div className="absolute inset-0 opacity-[0.03]" style={{

backgroundImage: `

linear-gradient(#E35D6A 1px, transparent 1px),

linear-gradient(90deg, #E35D6A 1px, transparent 1px)

`,

backgroundSize: '40px 40px'

}} />



{/* 手绘风格中国+东南亚地图轮廓 - 增强可见度 */}

<svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.25]" preserveAspectRatio="xMidYMid meet">

{/* 中国大陆轮廓 - 手绘风格加粗描边 */}

<path

d="M18,28

Q22,22 32,24

T48,22

T65,20

T78,26

T82,36

T80,48

T76,62

T70,75

T58,82

T42,85

T28,82

T20,72

T16,58

T14,44

T16,32

Z"

fill="none"

stroke="#D4847C"

strokeWidth="0.6"

strokeLinecap="round"

strokeLinejoin="round"

/>



{/* 海南岛 */}

<ellipse cx="58" cy="88" rx="4" ry="3" fill="none" stroke="#D4847C" strokeWidth="0.4" />



{/* 台湾岛 */}

<ellipse cx="85" cy="68" rx="2.5" ry="5" fill="none" stroke="#D4847C" strokeWidth="0.4" />



{/* 东南亚半岛轮廓 */}

<path

d="M42,86

Q45,88 50,89

T58,90

T66,88

T72,84

T78,88

T82,92"

fill="none"

stroke="#D4847C"

strokeWidth="0.4"

strokeLinecap="round"

/>



{/* 云南区域高亮 */}

<path

d="M28,55

Q32,50 40,52

T45,62

T40,75

T32,78

T26,70

T25,60

Z"

fill="none"

stroke="#E35D6A"

strokeWidth="0.35"

opacity="0.7"

/>



{/* 广西区域高亮 */}

<path

d="M58,72

Q65,68 72,72

T75,82

T68,86

T60,82

T58,75

Z"

fill="none"

stroke="#E35D6A"

strokeWidth="0.35"

opacity="0.6"

/>



{/* 贵州区域高亮 */}

<path

d="M52,48

Q58,45 64,48

T66,58

T60,64

T52,60

T50,52

Z"

fill="none"

stroke="#E35D6A"

strokeWidth="0.35"

opacity="0.6"

/>



{/* 四川盆地示意 */}

<ellipse cx="42" cy="42" rx="6" ry="5" fill="none" stroke="#D4847C" strokeWidth="0.25" opacity="0.5" />



{/* 马来西亚/新加坡区域 */}

<path

d="M50,92

Q55,94 62,92

T70,94"

fill="none"

stroke="#D4847C"

strokeWidth="0.3"

opacity="0.6"

/>



{/* 手绘海洋波浪纹理 - 底部区域 */}

<g opacity="0.3">

<path d="M10,88 Q15,85 20,88 T30,88 T40,88" fill="none" stroke="#D4847C" strokeWidth="0.25" strokeLinecap="round" />

<path d="M15,92 Q20,89 25,92 T35,92 T45,92" fill="none" stroke="#D4847C" strokeWidth="0.25" strokeLinecap="round" />

<path d="M70,90 Q75,87 80,90 T90,90 T95,90" fill="none" stroke="#D4847C" strokeWidth="0.25" strokeLinecap="round" />

</g>



{/* 航线连接 - 虚线 + 小飞机图标 */}

<path

id="flightPath"

d="M48,58

Q42,52 35,48

T32,38

T28,28

T22,62

T20,55

T72,68

T58,48

T62,38

T78,78

T38,72

T42,90

T82,72

T52,52

T30,32

T55,92

T42,42

T55,55

T52,45"

fill="none"

stroke="#E35D6A"

strokeWidth="0.2"

strokeDasharray="2,2"

opacity="0.4"

/>



{/* 手绘小飞机 - 沿航线分布 */}

<g opacity="0.5">

{/* 飞机1 - 昆明到大理方向 */}

<g transform="translate(42, 52) rotate(-30)">

<path d="M0,0 L4,0 M2,-2 L2,2 M1,-1 L3,-1" stroke="#E35D6A" strokeWidth="0.4" strokeLinecap="round" fill="none" />

</g>

{/* 飞机2 - 丽江到香格里拉方向 */}

<g transform="translate(30, 32) rotate(-20)">

<path d="M0,0 L4,0 M2,-2 L2,2 M1,-1 L3,-1" stroke="#E35D6A" strokeWidth="0.4" strokeLinecap="round" fill="none" />

</g>

{/* 飞机3 - 昆明到百色方向 */}

<g transform="translate(62, 62) rotate(45)">

<path d="M0,0 L4,0 M2,-2 L2,2 M1,-1 L3,-1" stroke="#E35D6A" strokeWidth="0.4" strokeLinecap="round" fill="none" />

</g>

{/* 飞机4 - 昆明到槟城方向 */}

<g transform="translate(48, 76) rotate(80)">

<path d="M0,0 L4,0 M2,-2 L2,2 M1,-1 L3,-1" stroke="#E35D6A" strokeWidth="0.4" strokeLinecap="round" fill="none" />

</g>

</g>



{/* 手绘复古指南针 - 左下角 */}

<g transform="translate(8, 82)">

{/* 指南针外圆 */}

<circle cx="6" cy="6" r="5" fill="none" stroke="#D4847C" strokeWidth="0.3" opacity="0.5" />

<circle cx="6" cy="6" r="4" fill="none" stroke="#D4847C" strokeWidth="0.2" opacity="0.4" />

{/* 指南针指针 - N */}

<path d="M6,2 L7,6 L6,10 L5,6 Z" fill="#E35D6A" fillOpacity="0.4" stroke="#E35D6A" strokeWidth="0.2" />

{/* 方向标记 */}

<text x="6" y="1.5" textAnchor="middle" fontSize="2" fill="#D4847C" opacity="0.6">N</text>

<text x="11" y="6.5" textAnchor="middle" fontSize="1.5" fill="#D4847C" opacity="0.5">E</text>

<text x="6" y="11.5" textAnchor="middle" fontSize="1.5" fill="#D4847C" opacity="0.5">S</text>

<text x="1" y="6.5" textAnchor="middle" fontSize="1.5" fill="#D4847C" opacity="0.5">W</text>

{/* 装饰性刻度 */}

<line x1="6" y1="1" x2="6" y2="1.5" stroke="#D4847C" strokeWidth="0.15" opacity="0.4" />

<line x1="11" y1="6" x2="10.5" y2="6" stroke="#D4847C" strokeWidth="0.15" opacity="0.4" />

<line x1="6" y1="11" x2="6" y2="10.5" stroke="#D4847C" strokeWidth="0.15" opacity="0.4" />

<line x1="1" y1="6" x2="1.5" y2="6" stroke="#D4847C" strokeWidth="0.15" opacity="0.4" />

</g>

</svg>

</div>

);

// 发光的爱心锚点
const HeartAnchor = ({
  place,
  isActive,
  onClick,
}: {
  place: Place;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${place.x}%`, top: `${place.y}%` }}
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* 外发光环 */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isActive ? 'animate-ping bg-rose-400/30' : ''}`} style={{ width: '40px', height: '40px', margin: '-8px' }} />

      {/* 爱心图标 */}
      <div className={`relative w-6 h-6 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_10px_rgba(227,93,106,0.8)]' : 'drop-shadow-[0_0_5px_rgba(227,93,106,0.4)]'}`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={isActive ? '#E35D6A' : '#F4A4A4'}
            stroke="#E35D6A"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 地点名称 - 默认隐藏，hover显示 */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap"
      >
        <span className="text-[10px] text-[#7C444F] bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
          {place.name}
        </span>
      </motion.div>
    </motion.button>
  );
};

// 胶片边框拍立得弹窗
const PolaroidModal = ({
  place,
  isOpen,
  onClose,
}: {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!place) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* 拍立得照片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-[101] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ originX: 0.5, originY: 0.5 }}
          >
            {/* 胶片边框容器 */}
            <div className="bg-white p-3 pb-6 rounded-sm shadow-2xl" style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.1)',
              maxWidth: '340px'
            }}>
              {/* 胶片齿孔装饰 */}
              <div className="flex justify-between px-1 mb-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-sm bg-gray-100 border border-gray-200" />
                ))}
              </div>

              {/* 照片区域 - 实景照片展示 */}
              <div className="relative overflow-hidden bg-gray-100 rounded-sm" style={{ aspectRatio: '4/3', width: '300px' }}>
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* 胶片颗粒感叠加 */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />
              </div>

              {/* 手写体标题 */}
              <div className="mt-4 text-center">
                <h3 className="font-handwriting text-2xl text-[#7C444F] mb-1" style={{ fontFamily: 'cursive' }}>
                  {place.name}
                </h3>
                <p className="text-xs text-[#9B6A6C] font-light">{place.date}</p>
                <p className="text-xs text-[#9B6A6C]/80 mt-2 px-4 leading-relaxed">{place.description}</p>
              </div>

              {/* 导航按钮 */}
              <button
                onClick={() => window.open(`https://map.baidu.com/search/${encodeURIComponent(place.name)}`, '_blank')}
                className="mt-4 w-full py-2 flex items-center justify-center space-x-2 text-xs text-[#E35D6A] border border-[#E35D6A]/30 rounded-full hover:bg-[#E35D6A]/10 transition-colors"
              >
                <Navigation className="w-3 h-3" />
                <span>导航到{place.name}</span>
              </button>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-[#7C444F] hover:bg-[#E35D6A] hover:text-white transition-colors"
            >
              ×
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/map_bg.png')" }}
      />
      <div className="absolute inset-0 bg-rose-50/10 pointer-events-none" />
      <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#7C444F] mb-2 font-handwriting">
            我们的航线图
          </h1>
          <p className="text-[#9B6A6C]">3D地球展示我们的足迹</p>
        </motion.div>

        {/* 3D 地球展示 */}
        <GlobeShowcase />

        {/* 复古地图容器 - 保留用于查看照片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-b from-rose-50/20 to-white/30 rounded-3xl border border-rose-100 shadow-xl overflow-hidden mt-8"
          style={{ height: '400px' }}
        >
          <HandDrawnMapBackground />

          {/* 标题装饰 */}
          <div className="absolute top-6 left-6 z-0">
            <p className="text-[#E35D6A]/20 text-xs tracking-[0.3em] uppercase">Travel Journal</p>
            <p className="text-[#E35D6A]/30 text-[10px] mt-1">S & L 2025-2026</p>
          </div>

          {/* 爱心锚点 */}
          {places.map((place) => (
            <HeartAnchor
              key={place.id}
              place={place}
              isActive={selectedPlace?.id === place.id}
              onClick={() => handlePlaceClick(place)}
            />
          ))}

          {/* 图例 */}
          <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-rose-100">
            <div className="flex items-center space-x-2 text-xs text-[#7C444F]">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E35D6A" stroke="#E35D6A" strokeWidth="1" />
              </svg>
              <span>点击爱心查看照片</span>
            </div>
          </div>
        </motion.div>

        {/* 地点列表 - 横向滚动导航 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide whitespace-nowrap">
            {places.map((place, index) => (
              <motion.button
                key={place.id}
                onClick={() => handlePlaceClick(place)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all border ${
                  selectedPlace?.id === place.id
                    ? 'bg-[#E35D6A] text-white border-[#E35D6A]'
                    : 'bg-white/50 text-[#7C444F] border-rose-200 hover:border-[#E35D6A] hover:bg-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.03 }}
              >
                <span className="font-handwriting">{place.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 未来登机牌入口 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={() => setIsBoardingPassOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white rounded-full shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Ticket className="w-5 h-5" />
            <span className="font-medium">领取未来机票</span>
          </motion.button>
          <p className="text-xs text-[#9B6A6C] mt-2">一段旅程的终点，是另一段旅程的起点 ✈️</p>
        </motion.div>
      </div>

      {/* 拍立得弹窗 */}
      <PolaroidModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 登机牌弹窗 */}
      <BoardingPass
        isOpen={isBoardingPassOpen}
        onClose={() => setIsBoardingPassOpen(false)}
      />

      {/* 星图锁 - 关卡3 */}
      <GlobeLock />
    </div>
  </>
  );
}
