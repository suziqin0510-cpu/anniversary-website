'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, X, Sparkles } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

// 黑金VIP卡片组件 - 苏记专属洗衣坊
const BlackGoldVIPCard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, rotateY: -30 }}
          animate={{ scale: 1, y: 0, rotateY: 0 }}
          exit={{ scale: 0.8, y: 50, rotateY: 30 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: '1000px' }}
        >
          {/* 黑金卡片主体 */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 shadow-2xl overflow-hidden border border-amber-500/30">
            {/* 反光效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />

            {/* 卡片头部 */}
            <div className="relative z-10 text-center mb-6">
              <div className="text-4xl mb-2">👑</div>
              <h3 className="text-2xl font-bold text-amber-400 tracking-wider">苏记专属洗衣坊</h3>
              <p className="text-amber-300/80 text-sm">SUJI EXCLUSIVE LAUNDRY</p>
              <div className="mt-2 inline-block px-4 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                <span className="text-amber-400 text-xs font-semibold tracking-widest">终身黑卡 · BLACK VIP</span>
              </div>
            </div>

            {/* 卡片编号 */}
            <div className="relative z-10 flex justify-between items-center mb-6 px-4 py-3 bg-black/40 rounded-lg border border-amber-500/20">
              <div>
                <p className="text-gray-500 text-xs">CARD NO.</p>
                <p className="text-amber-400 font-mono text-lg">20250520</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">HOLDER</p>
                <p className="text-white font-semibold">李丹</p>
              </div>
            </div>

            {/* 特权内容 */}
            <div className="relative z-10 bg-gradient-to-r from-amber-500/10 to-transparent p-4 rounded-lg border-l-4 border-amber-400 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-amber-400 font-semibold block mb-2">尊贵的李丹女士：</span>
                您的贴身衣物已被本洗衣坊<span className="text-rose-400 font-semibold">终身承包</span>。本店唯一指定金牌服务生：<span className="text-amber-300">99年苏子钦</span>。
              </p>
              <p className="text-gray-400 text-xs mt-3 italic">
                营业时间：全天候待命，随叫随到，永不打烊。
              </p>
            </div>

            {/* 底部装饰 */}
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-amber-400 text-xs">ACTIVE</span>
              </div>
              <div className="text-amber-500/50 text-4xl font-serif">VIP</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// MVP徽章组件 - 国服最强法师
const MVPBadge = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* 星星爆炸效果 */}
        {isOpen && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: [0, (i % 2 === 0 ? 100 : -100) * Math.random()],
                  y: [0, (i % 3 === 0 ? -100 : 100) * Math.random()],
                  opacity: [1, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{ duration: 1, delay: i * 0.05 }}
                className="absolute text-4xl"
              >
                🌟
              </motion.div>
            ))}
          </>
        )}

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 游戏风格徽章 */}
          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-1 shadow-2xl">
            <div className="bg-gray-900 rounded-3xl p-8 text-center relative overflow-hidden">
              {/* 背景动画 */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 animate-pulse" />

              {/* TIMI标识 */}
              <div className="relative z-10 mb-4">
                <span className="text-gray-500 text-sm tracking-widest">TIMI~</span>
              </div>

              {/* 皇冠图标 */}
              <div className="relative z-10 text-6xl mb-4 animate-bounce">👑</div>

              {/* 称号 */}
              <h3 className="relative z-10 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mb-2">
                苏子钦专属
              </h3>
              <div className="relative z-10 inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <span className="text-white font-bold text-xl">国服最强法师</span>
              </div>

              {/* 战绩 */}
              <div className="relative z-10 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-gray-300 text-sm mb-2">恭喜李丹荣获此称号！</p>
                <div className="flex justify-center items-center space-x-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">100%</p>
                    <p className="text-gray-500 text-xs">胜率</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-amber-400">拿捏</p>
                    <p className="text-gray-500 text-xs">老男人</p>
                  </div>
                </div>
              </div>

              {/* MVP标识 */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-lg">MVP</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// AA账单收据组件
const AABillModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, rotate: -5 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.8, y: 50, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #f0f0f0 31px, #f0f0f0 32px)',
            backgroundSize: '100% 32px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 收据头部 */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-4xl absolute" style={{ left: `${i * 25}%`, top: '10%', transform: 'rotate(-15deg)' }}>
                  🧾
                </div>
              ))}
            </div>
            <h3 className="text-2xl font-bold relative z-10">同德火锅专属收据</h3>
            <p className="text-sm opacity-90 relative z-10">YUAN LAO SI HOTPOT</p>
          </div>

          {/* 收据内容 */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
              <span className="text-gray-600">消费项目</span>
              <span className="font-medium text-gray-800">初见火锅大餐</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">原价</span>
              <span className="line-through text-gray-400">¥ 288.00</span>
            </div>

            <div className="flex justify-between items-center text-2xl font-bold text-rose-500">
              <span>实付</span>
              <span>¥ 0.00</span>
            </div>

            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <p className="text-sm text-rose-700 text-center">
                <span className="font-semibold">苏子钦</span> 已用一生买单
              </p>
            </div>

            <div className="text-center space-y-2 pt-2">
              <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">❤️</span>
              </div>
              <p className="text-xs text-gray-500">
                凭此小票，终身免费兑换袁老四
              </p>
              <p className="text-xs text-gray-400">
                有效期：永久 ❤️ 编号：20250520
              </p>
            </div>
          </div>

          {/* 底部撕边效果 */}
          <div className="h-4 bg-gray-100 relative">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-[#FFF5F5] to-[#FFE4E1] rounded-full"
                style={{ left: `${i * 5}%`, top: '-4px' }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// 手绘风格心形 - 跳动效果
const RedHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#DC2626"
      stroke="#DC2626"
      strokeWidth="1.5"
    />
  </svg>
);

// 手绘风格引号
const HandDrawnQuote = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <path d="M4 10c0-3 2-5 5-5v3c-1 0-2 1-2 2v1h3v7H4v-8zM13 10c0-3 2-5 5-5v3c-1 0-2 1-2 2v1h3v7h-6v-8z" fill="#B8916F" fillOpacity="0.5" stroke="#B8916F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 照片数据接口定义
interface Photo {
  id: string;
  url: string;
  caption: string;
}

interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  story: string;
  quote: string;
  highlights: string[];
  tags: string[];
  photos: Photo[];
}

// 每节点10张照片
const chapters: Chapter[] = [
  {
    id: 'chapter-1',
    number: '01',
    title: '初见',
    subtitle: '惊艳了苏子钦的初见',
    date: '2025.05.20',
    location: '昆明长水机场',
    story: `在那顿打破剧本的火锅之前，更早发生的是在长水机场的出口。

在见到你之前，我只听过你的声音。但当那个叫李丹的07年女孩出现在我面前时，那一刻，我整个人都被惊艳住了。

哪怕你脸上带着一点点小情绪，但那一刻的你，真的好美。就像在这个充满变数的世界里，突然亮起了一束光。

我记得你坚持要AA的倔强，那份独立让我更加心动。

从那天起，我想护着你的念头，就再也没断过。`,
    quote: '那一刻的你，真的好美。就像在这个充满变数的世界里，突然亮起了一束光。',
    highlights: ['机场惊艳初见', '打破剧本的火锅', '坚持要AA的自尊'],
    tags: ['昆明', '初见', '长水机场'],
    photos: [
      { id: '1-1', url: '/photos/airport-1.jpg', caption: '机场出口的第一眼' },
      { id: '1-2', url: '/photos/hotpot-1.jpg', caption: '同德火锅' },
      { id: '1-3', url: '/photos/first-meet.jpg', caption: '初见时刻' },
      { id: '1-4', url: '/photos/kunming-1.jpg', caption: '昆明印象' },
      { id: '1-5', url: '/photos/memory-1.jpg', caption: '难忘瞬间' },
      { id: '1-6', url: '/photos/airport-2.jpg', caption: '长水机场' },
      { id: '1-7', url: '/photos/tongde-1.jpg', caption: '同德广场' },
      { id: '1-8', url: '/photos/kunming-night.jpg', caption: '昆明夜色' },
      { id: '1-9', url: '/photos/first-day.jpg', caption: '第一天' },
      { id: '1-10', url: '/photos/yuanlaosi.jpg', caption: '袁老四火锅' },
    ],
  },
  {
    id: 'chapter-2',
    number: '02',
    title: '旅程',
    subtitle: '翻山越岭，副驾始终是你',
    date: '2025.06 - 2025.12',
    location: '云南 · 广西 · 贵州 · 重庆',
    story: `这一年，我们跑过大理、丽江、香格里拉，在芒市的轮椅上看落日，在腾冲接走盼盼。

我们在百色市、桂林码头基地旁边搭帐篷，像游牧民族一样。走过会泽和兴义、还去了重庆和六盘水。

最难忘是去了普洱，走进了景迈山。景迈山的古茶林风景好美，我们在那里吃到了超棒的美食，连空气都是甜的。

只要你在副驾，这一路山海，我都不觉得累。`,
    quote: '只要你在副驾，这一路山海，我都不觉得累。',
    highlights: ['大理洱海', '芒市轮椅落日', '腾冲接盼盼', '景迈山古茶林'],
    tags: ['旅行', '云南', '广西', '游牧'],
    photos: [
      { id: '2-1', url: '/photos/dali-1.jpg', caption: '大理的风' },
      { id: '2-2', url: '/photos/lijiang-1.jpg', caption: '丽江的夜晚' },
      { id: '2-3', url: '/photos/tengchong-1.jpg', caption: '腾冲接盼盼' },
      { id: '2-4', url: '/photos/beihai-1.jpg', caption: '北海的海风' },
      { id: '2-5', url: '/photos/jingmai-1.jpg', caption: '景迈山古茶林' },
      { id: '2-6', url: '/photos/guizhou-1.jpg', caption: '贵州烙锅' },
      { id: '2-7', url: '/photos/chongqing-1.jpg', caption: '重庆火锅' },
      { id: '2-8', url: '/photos/mangshi-1.jpg', caption: '芒市落日' },
      { id: '2-9', url: '/photos/baise-1.jpg', caption: '百色帐篷' },
      { id: '2-10', url: '/photos/guilin-1.jpg', caption: '桂林山水' },
    ],
  },
  {
    id: 'chapter-3',
    number: '03',
    title: '生活',
    subtitle: '柴米油盐，有你们就是甜',
    date: '2025.09 - 至今',
    location: '北海 · 昆明',
    story: `在北海住酒店吹海风，等待石榴到来。我们的小窝要整整齐齐了。

盼盼和石榴，一猫一狗，再加上你和我，这就是我们完整的家。

洗衣服、为你手洗内衣裤、做饭、遛狗、撸猫，这些平凡的日常因为有你们而变得闪闪发光。

对了，还记得那次你打王者荣耀拿了MVP吗？那一刻的你，比任何国服法师都要耀眼。

我知道你爱说狠话，爱试探我，但那都是因为你在乎。在这个充满变数的世界里，我为你撑起一个永远恒温的小窝。`,
    quote: '柴米油盐，有你们就是甜。',
    highlights: ['接回石榴', '盼盼石榴双全', '恒温小窝', '手洗内衣裤专属服务'],
    tags: ['生活', '盼盼', '石榴', '家'],
    photos: [
      { id: '3-1', url: '/photos/pets-1.jpg', caption: '盼盼和石榴' },
      { id: '3-2', url: '/photos/home-1.jpg', caption: '我们的小窝' },
      { id: '3-3', url: '/photos/daily-1.jpg', caption: '日常生活' },
      { id: '3-4', url: '/photos/cooking-1.jpg', caption: '为你做饭' },
      { id: '3-5', url: '/photos/panpan-1.jpg', caption: '盼盼的日常' },
      { id: '3-6', url: '/photos/shiliu-1.jpg', caption: '石榴来了' },
      { id: '3-7', url: '/photos/bath-1.jpg', caption: '洗澡时间' },
      { id: '3-8', url: '/photos/sleep-1.jpg', caption: '一起睡觉' },
      { id: '3-9', url: '/photos/play-1.jpg', caption: '玩耍时光' },
      { id: '3-10', url: '/photos/snuggle-1.jpg', caption: '依偎在一起' },
    ],
  },
  {
    id: 'chapter-4',
    number: '04',
    title: '跨越山海，只为见你一面',
    subtitle: '异国求学，我们各自努力',
    date: '2026.02 - 未来',
    location: '马来西亚 · USM · 亚庇',
    story: `陪你飞到马来西亚，你在 USM 念书，我在国内死磕 AI 拼回款。2500 公里的距离确实不近，每天只能通过屏幕看着你吃盼盼和石榴的醋，我既心疼又觉得可爱。但我会是你永远的头号粉丝。

在这个充满变数的世界里，我已经为你撑起了一个永远恒温的小窝。你只管安心做你的小公主，等我回血，第一站我们就去亚庇看海，然后再牵手走向全世界。`,
    quote: '跨越山海，只为见你一面。',
    highlights: ['USM校园', '亚庇落日约定', '牵手看世界'],
    tags: ['异国', '马来西亚', '未来', '约定'],
    photos: [
      { id: '4-1', url: '/photos/malaysia-1.jpg', caption: '马来西亚' },
      { id: '4-2', url: '/photos/usm-1.jpg', caption: 'USM校园' },
      { id: '4-3', url: '/photos/sunset-1.jpg', caption: '亚庇落日' },
      { id: '4-4', url: '/photos/future-1.jpg', caption: '未来约定' },
      { id: '4-5', url: '/photos/penang-1.jpg', caption: '槟城' },
      { id: '4-6', url: '/photos/kk-1.jpg', caption: '亚庇海滩' },
      { id: '4-7', url: '/photos/usm-library.jpg', caption: 'USM图书馆' },
      { id: '4-8', url: '/photos/malaysia-food.jpg', caption: '大马美食' },
      { id: '4-9', url: '/photos/island-1.jpg', caption: '海岛游' },
      { id: '4-10', url: '/photos/travel-1.jpg', caption: '一起看世界' },
    ],
  },
];

// 3D Coverflow 照片轮播组件 - 10张照片
const PhotoCoverflow = ({ photos, onPhotoClick }: { photos: Photo[]; onPhotoClick: (photo: Photo) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const getPhotoStyle = (index: number) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + photos.length) % photos.length);
    const adjustedDiff = normalizedDiff > photos.length / 2 ? normalizedDiff - photos.length : normalizedDiff;

    if (adjustedDiff === 0) {
      return { transform: 'translateX(0) translateZ(100px) rotateY(0deg)', zIndex: 10, opacity: 1, scale: 1 };
    } else if (adjustedDiff === -1 || (adjustedDiff === photos.length - 1 && photos.length > 2)) {
      return { transform: 'translateX(-120px) translateZ(-50px) rotateY(35deg)', zIndex: 5, opacity: 0.7, scale: 0.85 };
    } else if (adjustedDiff === 1 || (adjustedDiff === -(photos.length - 1) && photos.length > 2)) {
      return { transform: 'translateX(120px) translateZ(-50px) rotateY(-35deg)', zIndex: 5, opacity: 0.7, scale: 0.85 };
    } else {
      return { transform: 'translateX(0) translateZ(-200px) rotateY(0deg)', zIndex: 0, opacity: 0, scale: 0.5 };
    }
  };

  return (
    <div className="relative">
      <div className="relative h-56 overflow-visible rounded-2xl" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {photos.map((photo, index) => {
            const style = getPhotoStyle(index);
            return (
              <motion.div
                key={photo.id}
                className="absolute w-40 h-32 cursor-pointer"
                animate={{
                  x: style.transform.includes('translateX(-120)') ? -120 : style.transform.includes('translateX(120)') ? 120 : 0,
                  z: style.transform.includes('translateZ(100)') ? 100 : style.transform.includes('translateZ(-50)') ? -50 : -200,
                  rotateY: style.transform.includes('rotateY(35)') ? 35 : style.transform.includes('rotateY(-35)') ? -35 : 0,
                  opacity: style.opacity,
                  scale: style.scale,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ zIndex: style.zIndex, transformStyle: 'preserve-3d' }}
                onClick={() => index === currentIndex ? onPhotoClick(photo) : setCurrentIndex(index)}
              >
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={500}
                  scale={1}
                  transitionSpeed={300}
                  glareEnable={index === currentIndex}
                  glareMaxOpacity={0.15}
                  glareColor="#E35D6A"
                  glarePosition="all"
                  glareBorderRadius="12px"
                  style={{ borderRadius: '12px', overflow: 'hidden' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/50 shadow-lg">
                    <div className="text-center p-2">
                      <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 mx-auto mb-1 text-[#E35D6A]">
                        <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <p className="text-[10px] text-[#9B6A6C] truncate">{photo.caption}</p>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>

        <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-colors z-20" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <ChevronLeft className="w-4 h-4 text-[#7C444F]" />
        </button>
        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-colors z-20" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <ChevronRight className="w-4 h-4 text-[#7C444F]" />
        </button>
      </div>

      <div className="flex justify-center space-x-1 mt-4">
        {photos.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-[#E35D6A]' : 'bg-[#E35D6A]/30'}`} />
        ))}
      </div>

      <p className="text-center text-xs text-[#9B6A6C]/60 mt-2">💡 点击照片可放大查看，左右滑动切换</p>
    </div>
  );
};

export default function TimelinePage() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAABill, setShowAABill] = useState(false);
  const [showVIPCard, setShowVIPCard] = useState(false);
  const [showMVPBadge, setShowMVPBadge] = useState(false);

  const handlePrev = () => {
    if (currentChapter > 0) {
      setDirection(-1);
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNext = () => {
    if (currentChapter < chapters.length - 1) {
      setDirection(1);
      setCurrentChapter(currentChapter + 1);
    }
  };

  const chapter = chapters[currentChapter];

  return (
    <div className="min-h-screen pt-24 pb-12 overflow-hidden relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#7C444F] mb-2 font-handwriting">我们的故事</h1>
          <p className="text-[#9B6A6C]">从昆明开始，到一起的未来</p>
        </motion.div>

        <div className="mb-12">
          <div className="flex items-center justify-between relative px-4">
            <div className="absolute top-1/2 left-4 right-4 h-0 border-t-2 border-dashed border-[#E35D6A]/40" />
            <div className="absolute top-1/2 left-4 h-0 border-t-2 border-[#E35D6A] transition-all duration-500" style={{ width: `${(currentChapter / (chapters.length - 1)) * 100}%` }} />
            {chapters.map((ch, index) => (
              <button key={ch.id} onClick={() => { setDirection(index > currentChapter ? 1 : -1); setCurrentChapter(index); }} className="relative z-10 flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${index <= currentChapter ? 'bg-[#E35D6A] border-[#E35D6A]' : 'bg-white/60 border-[#E35D6A]/40'}`} />
                <span className={`mt-3 text-sm font-medium transition-colors ${index === currentChapter ? 'text-[#E35D6A]' : 'text-[#9B6A6C]'}`}>{ch.number}</span>
              </button>
            ))}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center"><RedHeart /></div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-6xl font-bold text-[#E35D6A]/40 font-handwriting">{chapter.number}</span>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#7C444F]">{chapter.title}</h2>
                      <p className="text-[#E35D6A] text-lg">{chapter.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-white/60">
                      <Calendar className="w-4 h-4 text-[#E35D6A]" />
                      <span className="text-sm text-[#7C444F]">{chapter.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-white/60">
                      <MapPin className="w-4 h-4 text-[#E35D6A]" />
                      <span className="text-sm text-[#7C444F]">{chapter.location}</span>
                    </div>
                  </div>
                </div>

                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.01} glareEnable={false} style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                  <div className="bg-white/95 backdrop-blur-sm p-6 shadow-sm border border-white/60">
                    <p className="text-[#7C444F] leading-relaxed whitespace-pre-line text-lg">
                      {currentChapter === 0 ? (
                        <>
                          在那顿打破剧本的火锅之前，更早发生的是在长水机场的出口。
                          {'\n\n'}
                          在见到你之前，我只听过你的声音。但当那个叫李丹的07年女孩出现在我面前时，那一刻，我整个人都被惊艳住了。
                          {'\n\n'}
                          哪怕你脸上带着一点点小情绪，但那一刻的你，真的好美。就像在这个充满变数的世界里，突然亮起了一束光。
                          {'\n\n'}
                          我记得你
                          <span
                            onClick={() => setShowAABill(true)}
                            className="relative cursor-pointer font-semibold"
                            style={{
                              textDecoration: 'underline wavy #E35D6A',
                              textUnderlineOffset: '4px'
                            }}
                          >
                            坚持要AA
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute -right-4 -top-1 text-amber-400"
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.span>
                          </span>
                          {' '}的倔强，那份独立让我更加心动。
                          {'\n\n'}
                          从那天起，我想护着你的念头，就再也没断过。
                        </>
                      ) : currentChapter === 2 ? (
                        <>
                          在北海住酒店吹海风，等待石榴到来。我们的小窝要整整齐齐了。
                          {'\n\n'}
                          盼盼和石榴，一猫一狗，再加上你和我，这就是我们完整的家。
                          {'\n\n'}
                          洗衣服、为你手洗
                          <span
                            onClick={() => setShowVIPCard(true)}
                            className="relative cursor-pointer font-bold text-amber-600"
                            style={{
                              textDecoration: 'underline wavy #F59E0B',
                              textUnderlineOffset: '4px'
                            }}
                          >
                            内衣裤
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute -right-8 -top-2 text-xs text-amber-500 bg-amber-100 px-1.5 py-0.5 rounded-full"
                            >
                              点我
                            </motion.span>
                          </span>
                          、做饭、遛狗、撸猫，这些平凡的日常因为有你们而变得闪闪发光。
                          {'\n\n'}
                          对了，还记得那次你打王者荣耀拿了
                          <span
                            onClick={() => setShowMVPBadge(true)}
                            className="relative cursor-pointer font-bold text-purple-600 mx-1"
                          >
                            <motion.span
                              animate={{
                                textShadow: ['0 0 5px #A855F7', '0 0 20px #A855F7', '0 0 5px #A855F7'],
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              MVP
                            </motion.span>
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="absolute -right-3 -top-2 text-yellow-400 text-xs"
                            >
                              ✨
                            </motion.span>
                          </span>
                          吗？那一刻的你，比任何国服法师都要耀眼。
                          {'\n\n'}
                          我知道你爱说狠话，爱试探我，但那都是因为你在乎。在这个充满变数的世界里，我为你撑起一个永远恒温的小窝。
                        </>
                      ) : (
                        chapter.story
                      )}
                    </p>
                  </div>
                </Tilt>

                <div className="flex flex-wrap gap-2">
                  {chapter.tags.map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-sm text-sm text-[#7C444F] border border-white/50">#{tag}</span>
                  ))}
                </div>

                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.01} glareEnable={false} style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                  <div className="bg-white/95 backdrop-blur-sm p-4 shadow-sm border border-white/60">
                    <h3 className="text-sm text-[#9B6A6C] mb-3 flex items-center font-medium">
                      <span className="w-2 h-2 bg-[#E35D6A] rounded-full mr-2" />
                      回忆相册 ({chapter.photos.length} 张照片)
                    </h3>
                    <PhotoCoverflow photos={chapter.photos} onPhotoClick={setSelectedPhoto} />
                  </div>
                </Tilt>
              </div>

              <div className="space-y-6 relative">
                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} glareEnable={true} glareMaxOpacity={0.15} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                  <div className="glass-card p-6 border-l-4 border-[#E35D6A]/50 bg-white/95 backdrop-blur-sm shadow-sm">
                    <HandDrawnQuote />
                    <p className="text-xl text-[#7C444F] italic leading-relaxed mt-4 font-light">"{chapter.quote}"</p>
                    <div className="mt-4 flex items-center space-x-2 text-[#9B6A6C] text-sm">
                      <RedHeart />
                      <span>苏子钦</span>
                    </div>
                  </div>
                </Tilt>

                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.01} glareEnable={false} style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                  <div className="bg-white/95 backdrop-blur-sm p-6 shadow-sm border border-white/60">
                    <h3 className="text-sm text-[#9B6A6C] mb-4 flex items-center font-medium">
                      <span className="w-2 h-2 bg-[#E35D6A] rounded-full mr-2" />
                      高光时刻
                    </h3>
                    <div className="space-y-3">
                      {chapter.highlights.map((highlight, index) => (
                        <div key={highlight} className="flex items-center space-x-3 text-[#7C444F]">
                          <span className="text-[#E35D6A] font-handwriting text-lg">{String(index + 1)}.</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tilt>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-0 md:-mx-4">
            <button onClick={handlePrev} disabled={currentChapter === 0} className={`pointer-events-auto p-3 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-white/60 hover:shadow-md transition-all ${currentChapter === 0 ? 'opacity-0' : 'opacity-100'}`}>
              <ChevronLeft className="w-6 h-6 text-[#E35D6A]" />
            </button>
            <button onClick={handleNext} disabled={currentChapter === chapters.length - 1} className={`pointer-events-auto p-3 rounded-full glass-card glass-card-hover transition-all ${currentChapter === chapters.length - 1 ? 'opacity-0' : 'opacity-100'}`}>
              <ChevronRight className="w-6 h-6 text-[#E35D6A]" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedPhoto(null)} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="glass-card-highlight rounded-2xl p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-20 h-20 mx-auto mb-4 text-[#E35D6A]">
                    <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <h3 className="text-xl font-bold text-[#E35D6A] mb-2">{selectedPhoto.caption}</h3>
                  <p className="text-[#9B6A6C]">照片占位 - 请替换为实际图片URL</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AA账单彩蛋弹窗 */}
      <AABillModal isOpen={showAABill} onClose={() => setShowAABill(false)} />

      {/* 黑金VIP卡片彩蛋 */}
      <BlackGoldVIPCard isOpen={showVIPCard} onClose={() => setShowVIPCard(false)} />

      {/* MVP徽章彩蛋 */}
      <MVPBadge isOpen={showMVPBadge} onClose={() => setShowMVPBadge(false)} />
    </div>
  );
}
