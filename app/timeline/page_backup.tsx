'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, X, Sparkles, Lock, Unlock, Heart, Quote } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

// ==================== 背景装饰组件 ====================

// 斜纹背景
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* 基础渐变 */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-white/50 to-rose-100/20" />
    
    {/* 斜纹网格 */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(45deg, #E35D6A 25%, transparent 25%),
          linear-gradient(-45deg, #E35D6A 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #E35D6A 75%),
          linear-gradient(-45deg, transparent 75%, #E35D6A 75%)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
      }}
    />
    
    {/* 微光粒子 */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-rose-300/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
    
    {/* 柔和光斑 */}
    <div className="absolute top-20 left-10 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-rose-50/40 via-transparent to-transparent rounded-full" />
  </div>
);

// 粒子爆炸效果
const ParticleBurst = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 360;
        const distance = 40 + Math.random() * 20;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? '#E35D6A' : '#F472B6',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * distance,
              y: Math.sin((angle * Math.PI) / 180) * distance,
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
};

// ==================== 彩蛋组件 ====================

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
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 shadow-2xl overflow-hidden border border-amber-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center mb-6">
              <div className="text-4xl mb-2">👑</div>
              <h3 className="text-2xl font-bold text-amber-400 tracking-wider">苏记专属洗衣坊</h3>
              <p className="text-amber-300/80 text-sm">SUJI EXCLUSIVE LAUNDRY</p>
              <div className="mt-2 inline-block px-4 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                <span className="text-amber-400 text-xs font-semibold tracking-widest">终身黑卡 · BLACK VIP</span>
              </div>
            </div>

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

            <div className="relative z-10 bg-gradient-to-r from-amber-500/10 to-transparent p-4 rounded-lg border-l-4 border-amber-400 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-amber-400 font-semibold block mb-2">尊贵的李丹女士：</span>
                您的贴身衣物已被本洗衣坊<span className="text-rose-400 font-semibold">终身承包</span>。本店唯一指定金牌服务生：<span className="text-amber-300">99年苏子钦</span>。
              </p>
              <p className="text-gray-400 text-xs mt-3 italic">
                营业时间：全天候待命，随叫随到，永不打烊。
              </p>
            </div>

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
        {isOpen && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: [0, Math.cos((i * 45 * Math.PI) / 180) * 150],
                  y: [0, Math.sin((i * 45 * Math.PI) / 180) * 150],
                  opacity: [1, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute text-3xl"
                style={{ left: '50%', top: '50%' }}
              >
                ⭐
              </motion.div>
            ))}
          </>
        )}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex flex-col items-center justify-center shadow-2xl border-4 border-yellow-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border-2 border-dashed border-white/20"
            />
            <div className="text-5xl mb-2">🏆</div>
            <div className="text-3xl font-black text-white drop-shadow-lg">MVP</div>
            <div className="text-xs text-white/80 mt-1 font-bold tracking-wider">国服最强法师</div>
            <div className="absolute -bottom-1 bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-0.5 rounded-full">LV.99</div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AABillModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#E35D6A] p-4 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🧾</div>
              <div>
                <h3 className="font-bold">那年火锅 AA 账单</h3>
                <p className="text-xs text-white/80">The First Dinner Receipt</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200">
              <span className="text-gray-500 text-sm">时间</span>
              <span className="text-[#7C444F] font-medium">2025年5月20日</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200">
              <span className="text-gray-500 text-sm">地点</span>
              <span className="text-[#7C444F] font-medium">昆明 · 某家见证历史的火锅店</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200">
              <span className="text-gray-500 text-sm">消费金额</span>
              <span className="text-[#7C444F] font-bold text-lg">¥520.00</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b-2 border-[#E35D6A]">
              <span className="text-gray-500 text-sm">AA 后每人应付</span>
              <span className="text-[#E35D6A] font-bold text-xl">¥260.00</span>
            </div>
            <div className="bg-rose-50 p-3 rounded-lg text-sm text-[#7C444F]">
              <p className="italic">"你说这顿必须AA，但那一刻你眼里的光，早把这顿饭标成了无价。"</p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span>已支付 ✅</span>
              <span>|</span>
              <span>已记账 💕</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);


// ==================== 类型定义 ====================

interface Photo {
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
  tags: string[];
  highlights: string[];
  photos: Photo[];
  hiddenMessage: string;
}

// ==================== 数据 ====================

const RedHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#E35D6A"
      stroke="#E35D6A"
      strokeWidth="1.5"
    />
  </svg>
);

const HandDrawnQuote = () => (
  <svg viewBox="0 0 40 40" className="w-10 h-10 text-[#E35D6A]/30">
    <path d="M10 20 Q5 15 10 10 Q15 5 20 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M25 15 Q20 10 25 5 Q30 0 35 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const chapters: Chapter[] = [
  {
    id: 'chapter1',
    number: '01',
    title: '初见',
    subtitle: '一切的开始',
    date: '2025年5月20日',
    location: '昆明 · 长水机场',
    story: '在那顿打破剧本的火锅之前，更早发生的是在长水机场的出口。\\n\\n在见到你之前，我只听过你的声音。但当那个叫李丹的07年女孩出现在我面前时，那一刻，我整个人都被惊艳住了。\\n\\n哪怕你脸上带着一点点小情绪，但那一刻的你，真的好美。就像在这个充满变数的世界里，突然亮起了一束光。\\n\\n我记得你坚持要AA的样子，那份独立和自尊，是我见过最美的风景。',
    quote: '李丹，那天你坚持要AA的样子，真的让我心动。那份独立和自尊，是我见过最美的风景。',
    tags: ['初见', '心动', '火锅', 'AA'],
    highlights: ['长水机场初见', '那顿AA的火锅', '你脸上的小情绪'],
    photos: [
      { url: 'https://i.ibb.co/tPMMwB9m/0f6bfd0b3ebf2e1b6f511b3d57c1ac18.jpg', caption: '初见 · 那一刻的心动' },
      { url: 'https://i.ibb.co/5XLrpK0Z/2a54d4b9369ec1e1723aaf83a2a010f6.jpg', caption: '第一次见面' },
      { url: 'https://i.ibb.co/Y7N384YN/2c5e55fa6950ba7a692f11abad9e67cb.jpg', caption: '长水机场出口' },
      { url: 'https://i.ibb.co/Vc4qFmPH/9e0e23b8b9ec3b0b36a7ba6f59f436f6.jpg', caption: '你的笑容' },
      { url: 'https://i.ibb.co/svn9dTSz/27fbce0e16ce2bb023ff5fc878f1082f.jpg', caption: '那顿火锅' },
      { url: 'https://i.ibb.co/mrdKyzmF/031b8547ec8c53796412d74d9f0948f7.jpg', caption: 'AA的记忆' },
      { url: 'https://i.ibb.co/GvwgSydN/803b5cae5f06ebbd084dbf09c66f9c4e.jpg', caption: '第一次并肩' },
      { url: 'https://i.ibb.co/qF281dx9/bd6bce7c4f27173b8a66b7a470b0b4ea.jpg', caption: '心动的开始' },
      { url: 'https://i.ibb.co/395z4SNH/cbdbaf26128bd62d05d7c0b6362c3dcb.jpg', caption: '记住这一刻' },
      { url: 'https://i.ibb.co/BHrcYyg6/d563e36f3ae370b8cf2458f077517b8e.jpg', caption: '我们的起点' }
    ],
    hiddenMessage: '李丹，那天你坚持要AA的样子，真的让我心动。那份独立和自尊，是我见过最美的风景。'
  },
  {
    id: 'chapter2',
    number: '02',
    title: '旅程',
    subtitle: '一起看过的风景',
    date: '2025年6月-8月',
    location: '腾冲 · 芒市 · 大理 · 丽江',
    story: '从腾冲的火山热海，到芒市的金色佛塔，再到大理的洱海苍山...\\n\\n这一年我们跑过那么多地方，但只要你在副驾，再远的路我都不觉得累。你是我最想炫耀的风景。',
    quote: '这一年我们跑过那么多地方，但只要你在副驾，再远的路我都不觉得累。',
    tags: ['旅行', '风景', '回忆'],
    highlights: ['腾冲热气球', '芒市大金塔', '洱海环行'],
    photos: [
      { url: 'https://i.ibb.co/V0HGznW9/8cd8a5421b0e1b234e414b91242fe4ca.jpg', caption: '腾冲 · 火山热海' },
      { url: 'https://i.ibb.co/7tZfmJnn/3b444c494a1e0d129058b64687e58a7f.jpg', caption: '芒市金塔' },
      { url: 'https://i.ibb.co/wFXh8kRz/56db544296ca941306d3f1659e865822.jpg', caption: '大理古城' },
      { url: 'https://i.ibb.co/ZpHkvyzs/59f65df50dfb060f63e404c57ea2f1aa.jpg', caption: '洱海骑行' },
      { url: 'https://i.ibb.co/yBK7F57H/84c22aadc0cc194c4075918a19fb4b48.jpg', caption: '丽江雪山' },
      { url: 'https://i.ibb.co/fVH8zFFs/157f6b9e0e696cc9b4ff26bd2ff66ca8.jpg', caption: '一起看世界' },
      { url: 'https://i.ibb.co/BKB9z4WV/476e3cea29abec8f9ddc1ddbda98894a.jpg', caption: '风景与你' },
      { url: 'https://i.ibb.co/q3YWYvyz/647eef9d9cff88e131883f373f308f07.jpg', caption: '旅途记忆' },
      { url: 'https://i.ibb.co/TM4q6PKN/756fc89ec20441c5d2923f0b3742c8df.jpg', caption: '漫步古城' },
      { url: 'https://i.ibb.co/wrgTKTtf/8946b2f2a6a1430fd45603461f915fdc.jpg', caption: '山间小路' },
      { url: 'https://i.ibb.co/tw90PtBK/89212be6e16339f295d00242fc724a5b.jpg', caption: '热气球下' },
      { url: 'https://i.ibb.co/Z6kZfqRC/98765ef7f5b814d0bbb242e362e3755f.jpg', caption: '金色时光' },
      { url: 'https://i.ibb.co/jvX1HswF/a5b7edc5e26c63e1e66b7b3f951bcfb4.jpg', caption: '夕阳西下' },
      { url: 'https://i.ibb.co/8nPd2kmQ/d37eeee59148ffb4128c53be984d28af.jpg', caption: '海边漫步' },
      { url: 'https://i.ibb.co/3mqDFXc9/dd7266290b23000fa186baf6061f79cf.jpg', caption: '蓝天白云' },
      { url: 'https://i.ibb.co/C3S8yYBP/db00aeca6f152a30e54b2c3e3b2b33da.jpg', caption: '留住美好' },
      { url: 'https://i.ibb.co/whz3ZYMF/e5f1e3b690eaf9ec968f3c74d22b1b99.jpg', caption: '旅行日记' },
      { url: 'https://i.ibb.co/r2rh9WzY/ec692692a48e84069a8b5631ef839520.jpg', caption: '一路有你' },
      { url: 'https://i.ibb.co/3m5DdXyK/ee1a4de3dbb68a3aeb7ac5fa6f8b403d.jpg', caption: '最美的风景' },
      { url: 'https://i.ibb.co/1t6dtXLh/f0bffa324bf1eeb3ac7818bc7f20b697.jpg', caption: '旅途终点也是起点' }
    ],
    hiddenMessage: '这一年我们跑过那么多地方，但只要你在副驾，再远的路我都不觉得累。你是我最想炫耀的风景。'
  },
  {
    id: 'chapter3',
    number: '03',
    title: '生活',
    subtitle: '平凡日子里的小确幸',
    date: '2025年9月-12月',
    location: '昆明 · 我们的小窝',
    story: '洗衣服、做饭、遛狗、撸猫...这些平凡的日常因为有你和盼盼石榴而变得闪闪发光。\\n\\n苏记专属洗衣坊，终身VIP黑卡持有者：李丹。',
    quote: '洗衣服、做饭、遛狗、撸猫，这些平凡的日常因为有你和盼盼石榴而变得闪闪发光。',
    tags: ['日常', '洗衣坊', '毛孩子'],
    highlights: ['苏记洗衣坊开业', '盼盼石榴的日常', '一起做饭'],
    photos: [
      { url: 'https://i.ibb.co/w51McS7/e891af2299e0b14a295389af09dd45e9.jpg', caption: '我们的小窝' },
      { url: 'https://i.ibb.co/0j1Xqmyw/ca868b0fb890186dfa790228ea953759.jpg', caption: '苏记洗衣坊' },
      { url: 'https://i.ibb.co/ksVFNtp3/537949c818dbf1601c2c1f1b67787a93.jpg', caption: '一起做饭' },
      { url: 'https://i.ibb.co/G3PTVB0y/065616b50fc79b7a0913712275f51518.jpg', caption: '平凡日常' },
      { url: 'https://i.ibb.co/r2HNHmCD/34a53bfbaf8b5771ee1c8f4c526025b7.jpg', caption: '盼盼和石榴' },
      { url: 'https://i.ibb.co/CsBxLFW2/14dbcf9ff980409efacdb9a38ad459cd.jpg', caption: '毛孩子时光' },
      { url: 'https://i.ibb.co/xSq1VKZm/8d1be945ff0d41c06b69d37c02841667.jpg', caption: '温馨午后' },
      { url: 'https://i.ibb.co/SwCYRb1c/7c6a6857883d78cff675f3684f1100c9.jpg', caption: '家的味道' },
      { url: 'https://i.ibb.co/KcCjppLf/2af65a81a2b97f7e91d50b4d867728a2.jpg', caption: '生活碎片' },
      { url: 'https://i.ibb.co/v6z4TLXv/0f4fbd691dc3071b1504909653f6c19e.jpg', caption: '幸福时刻' }
    ],
    hiddenMessage: '洗衣服、做饭、遛狗、撸猫，这些平凡的日常因为有你和盼盼石榴而变得闪闪发光。这就是我想要的生活。'
  },
  {
    id: 'chapter4',
    number: '04',
    title: '跨越山海',
    subtitle: '异地的考验与期待',
    date: '2026年1月-至今',
    location: '云南 · 江苏',
    story: '2500公里的距离，是考验也是期待。\\n\\n但你只管安心做你的小公主。等我回血，第一站我们就去亚庇看海，然后牵手走向全世界。',
    quote: '2500公里的距离确实不近，但你只管安心做你的小公主。',
    tags: ['异地', '承诺', '未来'],
    highlights: ['2500公里的思念', '视频通话日常', '亚庇之约'],
    photos: [
      { url: 'https://i.ibb.co/63W1h7S/707b919c76bbf47bacdc5a009925983b.jpg', caption: '2500公里的距离' },
      { url: 'https://i.ibb.co/YFBKpy4T/f0842dd457739f24a331264ff74938d7.jpg', caption: '异地思念' },
      { url: 'https://i.ibb.co/k6hpTZxz/c62c1e499d5586cfe219237939d8aa27.jpg', caption: '视频通话日常' },
      { url: 'https://i.ibb.co/xqK75D9C/c7dbf646615a1c4b1718b511c5d2f6c3.jpg', caption: '隔空陪伴' },
      { url: 'https://i.ibb.co/4nN7rsfr/c5cf02e6d1d49f8e9989c878a380d427.jpg', caption: '等你回来' },
      { url: 'https://i.ibb.co/mr8wj8M5/b2869be74c77b34436a1ffb3f0437c3d.jpg', caption: '山海相隔' },
      { url: 'https://i.ibb.co/mVkNcKjR/a3c79520011417976a2fd640d0095382.jpg', caption: '心系彼此' },
      { url: 'https://i.ibb.co/wNqqX0pq/2017686713292d6462b5dec8b2a393aa.jpg', caption: '期待重逢' },
      { url: 'https://i.ibb.co/SXBZj91t/539942c8120efbed00234f6d92ccc497.jpg', caption: '亚庇之约' },
      { url: 'https://i.ibb.co/7N4mNZLS/3296f0f61ef08ae888bd534876d32f4d.jpg', caption: '未来可期' },
      { url: 'https://i.ibb.co/TB8vygTD/560fb51208744ccf20b9242ad229a7f8.jpg', caption: '一起看海' },
      { url: 'https://i.ibb.co/RT5fcqhQ/523b72e900d3daddf1c3ed7a406718bf.jpg', caption: '牵手旅行' },
      { url: 'https://i.ibb.co/sJkYZDjK/457cdd7152fa578555229e24ad7ffbb2.jpg', caption: '承诺' },
      { url: 'https://i.ibb.co/Kvwrfj4/95a4bbefd95968c0f6ca60960a345d35.jpg', caption: '小公主' },
      { url: 'https://i.ibb.co/j90XxBmd/25e9c69eeabede70a1f645cdc51ecf61.jpg', caption: '爱你' },
      { url: 'https://i.ibb.co/Q7gYR0ZK/6e01cd7df697d685e60c56e3c032b74a.jpg', caption: '永远' },
      { url: 'https://i.ibb.co/5xnmZwwX/6dfd0de729d6e4a570a12f594f1f714b.jpg', caption: '坚持' },
      { url: 'https://i.ibb.co/MyTkHwNM/4a68995732e984011f195da001d926df.jpg', caption: '信念' },
      { url: 'https://i.ibb.co/gMkmW9DK/2b0c2638a82692bb056caec1c121e889.jpg', caption: '奔赴' },
      { url: 'https://i.ibb.co/nMyjhmPb/3fe013b5351f01758bc99767051740b4.jpg', caption: '只为见你一面' }
    ],
    hiddenMessage: '2500公里的距离确实不近，但你只管安心做你的小公主。等我回血，第一站我们就去亚庇看海，然后牵手走向全世界。'
  }
];


// ==================== 解密游戏组件 ====================

type GameType = 'password' | 'line' | 'click';

const HandwrittenText = ({ text, isVisible }: { text: string; isVisible: boolean }) => {
  const characters = text.split('');
  return (
    <p className="text-lg text-[#7C444F] leading-relaxed font-handwriting">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.03, delay: index * 0.03, ease: "easeOut" }}
        >
          {char}
        </motion.span>
      ))}
    </p>
  );
};

const PasswordGame = ({ onSuccess }: { onSuccess: () => void }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  
  const handleSubmit = () => {
    if (input === '0520') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };
  
  return (
    <div className="text-center space-y-4">
      <div className="text-5xl">🔐</div>
      <h4 className="text-lg font-bold text-[#7C444F]">输入解锁密码</h4>
      <p className="text-xs text-[#9B6A6C]">提示：我们第一次见面的日期（MMDD）</p>
      
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${
              error ? 'border-red-400 bg-red-50' : 'border-rose-300 bg-white'
            }`}
          >
            {input[i] || ''}
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '→'].map((num) => (
          <button
            key={num}
            onClick={() => {
              if (num === 'C') setInput('');
              else if (num === '→') handleSubmit();
              else if (input.length < 4) setInput(prev => prev + num);
            }}
            className="w-12 h-12 rounded-lg bg-white hover:bg-rose-50 border border-rose-200 text-[#7C444F] font-bold transition-colors active:scale-95 text-sm"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

// 头像连线游戏 - 带爱心动画
const LineGame = ({ onSuccess }: { onSuccess: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [avatarsMoved, setAvatarsMoved] = useState(false);

  // 头像位置
  const leftPos = { x: 60, y: 75 };
  const rightPos = { x: 240, y: 75 };
  const avatarSize = 50;
  const hitRadius = 40;

  // 头像图片URL (使用情侣头像或默认头像)
  const maleAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf&clothing=blazerAndShirt';
  const femaleAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf&clothing=blazerAndShirt';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 加载头像图片
    const loadImages = async () => {
      const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.src = src;
      });

      const [maleImg, femaleImg] = await Promise.all([
        loadImage(maleAvatar),
        loadImage(femaleAvatar)
      ]);

      drawScene(ctx, maleImg, femaleImg, leftPos, rightPos);
    };

    loadImages();
  }, []);

  const drawScene = (
    ctx: CanvasRenderingContext2D,
    maleImg: HTMLImageElement,
    femaleImg: HTMLImageElement,
    left: { x: number, y: number },
    right: { x: number, y: number }
  ) => {
    ctx.clearRect(0, 0, 300, 150);

    // 绘制虚线提示
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#E35D6A40';
    ctx.lineWidth = 2;
    ctx.moveTo(left.x + avatarSize/2, left.y);
    ctx.lineTo(right.x - avatarSize/2, right.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // 绘制发光边框
    const drawGlow = (x: number, y: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, avatarSize/2 + 3, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 呼吸灯效果
      ctx.beginPath();
      ctx.arc(x, y, avatarSize/2 + 6, 0, Math.PI * 2);
      ctx.strokeStyle = color + '40';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // 绘制苏子钦头像
    drawGlow(left.x, left.y, '#3B82F6');
    ctx.save();
    ctx.beginPath();
    ctx.arc(left.x, left.y, avatarSize/2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(maleImg, left.x - avatarSize/2, left.y - avatarSize/2, avatarSize, avatarSize);
    ctx.restore();

    // 绘制李丹头像
    drawGlow(right.x, right.y, '#EC4899');
    ctx.save();
    ctx.beginPath();
    ctx.arc(right.x, right.y, avatarSize/2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(femaleImg, right.x - avatarSize/2, right.y - avatarSize/2, avatarSize, avatarSize);
    ctx.restore();

    // 绘制名字标签
    ctx.fillStyle = '#7C444F';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('苏子钦', left.x, left.y + avatarSize/2 + 18);
    ctx.fillText('李丹', right.x, right.y + avatarSize/2 + 18);
  };

  const redrawCanvas = (currentX?: number, currentY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 重新加载图片并绘制
    const loadImages = async () => {
      const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.src = src;
      });

      const [maleImg, femaleImg] = await Promise.all([
        loadImage(maleAvatar),
        loadImage(femaleAvatar)
      ]);

      // 计算新位置（头像向中间靠拢）
      const newLeft = avatarsMoved
        ? { x: 100, y: 75 }  // 向中间移动
        : leftPos;
      const newRight = avatarsMoved
        ? { x: 200, y: 75 }  // 向中间移动
        : rightPos;

      drawScene(ctx, maleImg, femaleImg, newLeft, newRight);

      // 绘制连线
      if (currentX !== undefined && currentY !== undefined) {
        ctx.beginPath();
        ctx.strokeStyle = '#E35D6A';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.moveTo(newLeft.x, newLeft.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      }
    };

    loadImages();
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const startX = avatarsMoved ? 100 : leftPos.x;
    const startY = avatarsMoved ? 75 : leftPos.y;

    const distToStart = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
    if (distToStart < hitRadius) setIsDrawing(true);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    redrawCanvas(x, y);

    const endX = avatarsMoved ? 200 : rightPos.x;
    const endY = avatarsMoved ? 75 : rightPos.y;

    const distToEnd = Math.sqrt(Math.pow(x - endX, 2) + Math.pow(y - endY, 2));
    if (distToEnd < hitRadius && !completed) {
      setCompleted(true);
      setAvatarsMoved(true);
      setShowHeart(true);
      setTimeout(() => onSuccess(), 1500);
    }
  };

  const handleEnd = () => {
    if (!completed) {
      setIsDrawing(false);
      redrawCanvas();
    }
  };

  return (
    <div className="text-center space-y-3 relative">
      <div className="text-4xl">💕</div>
      <h4 className="text-lg font-bold text-[#7C444F]">心动连线</h4>
      <p className="text-xs text-[#9B6A6C]">从苏子钦画一条线到李丹</p>

      <div className="relative w-full max-w-[300px] h-[150px] mx-auto">
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="w-full h-full bg-white/60 rounded-xl border border-rose-200 touch-none cursor-crosshair"
        />

        {/* 爱心动画 */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <div className="text-6xl filter drop-shadow-lg">❤️</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 头像靠拢动画提示 */}
        <AnimatePresence>
          {avatarsMoved && !showHeart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="text-rose-500 text-xs font-medium bg-white/80 px-2 py-1 rounded-full">
                靠近中...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
const ClickGame = ({ onSuccess }: { onSuccess: () => void }) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const targetClicks = 10;
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActive && timeLeft === 0) {
      if (clicks >= targetClicks) {
        onSuccess();
      } else {
        setIsActive(false);
        setClicks(0);
        setTimeLeft(3);
      }
    }
  }, [isActive, timeLeft, clicks, onSuccess]);
  
  const handleClick = () => {
    if (!isActive) setIsActive(true);
    setClicks(c => c + 1);
  };
  
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl">💓</div>
      <h4 className="text-lg font-bold text-[#7C444F]">狂戳屏幕</h4>
      <p className="text-xs text-[#9B6A6C]">{targetClicks}次点击 · {timeLeft}秒</p>
      
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#E35D6A]">{clicks}</div>
          <div className="text-xs text-[#9B6A6C]">点击</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#E35D6A]">{timeLeft}</div>
          <div className="text-xs text-[#9B6A6C]">秒</div>
        </div>
      </div>
      
      <motion.button
        onClick={handleClick}
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.1 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-400/40 flex items-center justify-center text-white text-3xl active:scale-95 transition-transform mx-auto"
      >
        💖
      </motion.button>
      
      {!isActive && clicks === 0 && (
        <p className="text-xs text-[#9B6A6C] animate-pulse">点击开始！</p>
      )}
    </div>
  );
};


// ==================== 解密弹窗组件 ====================

const DecryptionModal = ({
  isOpen,
  onClose,
  chapter,
  isUnlocked,
  onUnlock
}: {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
  isUnlocked: boolean;
  onUnlock: () => void;
}) => {
  const [currentGame, setCurrentGame] = useState<GameType>('password');
  const [gameWon, setGameWon] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    if (isOpen && !isUnlocked) {
      const games: GameType[] = ['password', 'line', 'click'];
      setCurrentGame(games[Math.floor(Math.random() * games.length)]);
      setGameWon(false);
      setShowMessage(false);
    } else if (isOpen && isUnlocked) {
      setShowMessage(true);
    }
  }, [isOpen, isUnlocked]);
  
  const handleGameSuccess = () => {
    setGameWon(true);
    setTimeout(() => {
      setShowMessage(true);
      onUnlock();
    }, 400);
  };
  
  const games = {
    password: <PasswordGame onSuccess={handleGameSuccess} />,
    line: <LineGame onSuccess={handleGameSuccess} />,
    click: <ClickGame onSuccess={handleGameSuccess} />
  };
  
  return (
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/60 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-rose-200/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-rose-300/20 rounded-full blur-2xl" />
              
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative z-10">
                {!showMessage ? (
                  <>
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-rose-500" />
                      </div>
                      <h3 className="text-lg font-bold text-[#7C444F] mb-1">解密专属留言</h3>
                      <p className="text-xs text-[#9B6A6C]">完成小游戏解锁隐藏消息</p>
                    </div>
                    
                    {gameWon ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center py-6"
                      >
                        <div className="text-5xl mb-3">🎉</div>
                        <p className="text-base font-bold text-[#E35D6A]">解锁成功！</p>
                      </motion.div>
                    ) : (
                      games[currentGame]
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                      <Unlock className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#7C444F] mb-3">来自苏子钦的留言</h3>
                    
                    <div className="bg-rose-50/80 rounded-xl p-4 border border-rose-100">
                      <HandwrittenText text={chapter.hiddenMessage} isVisible={showMessage} />
                    </div>
                    
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 px-5 py-2 bg-[#E35D6A] text-white rounded-full text-sm font-medium hover:bg-[#d54d5a] transition-colors"
                    >
                      收到 💝
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==================== 照片轮播组件 (修复版) ====================

const PhotoGallery = ({ photos, onPhotoClick }: { photos: Photo[]; onPhotoClick: (photo: Photo) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  if (photos.length === 0) return null;
  
  return (
    <div className="relative w-full">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 to-rose-100 shadow-xl">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => onPhotoClick(photos[currentIndex])}
          >
            {/* 毛玻璃背景 */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
              style={{ backgroundImage: `url(${photos[currentIndex].url})` }}
            />
            
            {/* 实际图片 - object-contain 确保完整显示 */}
            <img
              src={photos[currentIndex].url}
              alt={photos[currentIndex].caption}
              className="absolute inset-0 w-full h-full object-contain p-2 z-10"
              loading="lazy"
            />
            
            {/* 渐变遮罩 */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent z-20" />
            
            {/* 标题 */}
            <div className="absolute bottom-3 left-3 right-3 z-30">
              <p className="text-white text-sm font-medium text-center drop-shadow-md">
                {photos[currentIndex].caption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* 导航按钮 */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              disabled={currentIndex === 0}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all z-30 ${
                currentIndex === 0 ? 'opacity-30' : 'opacity-100 hover:bg-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-[#E35D6A]" />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              disabled={currentIndex === photos.length - 1}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all z-30 ${
                currentIndex === photos.length - 1 ? 'opacity-30' : 'opacity-100 hover:bg-white'
              }`}
            >
              <ChevronRight className="w-4 h-4 text-[#E35D6A]" />
            </button>
            
            {/* 指示器 */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* 照片计数 */}
      <div className="absolute -bottom-6 left-0 right-0 text-center">
        <span className="text-xs text-[#9B6A6C] bg-white/80 px-3 py-1 rounded-full">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>
    </div>
  );
};


// ==================== 主页面组件 ====================

export default function TimelinePage() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [unlockedChapters, setUnlockedChapters] = useState<Set<string>>(new Set());
  const [decryptionModalOpen, setDecryptionModalOpen] = useState(false);
  const [showVIPCard, setShowVIPCard] = useState(false);
  const [showMVPBadge, setShowMVPBadge] = useState(false);
  const [showAABill, setShowAABill] = useState(false);

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
  const isUnlocked = unlockedChapters.has(chapter.id);

  // 故事内容处理
  const renderStory = () => {
    if (chapter.id === 'chapter1') {
      return (
        <>
          在那顿打破剧本的火锅之前，更早发生的是在长水机场的出口。
          <br /><br />
          在见到你之前，我只听过你的声音。但当那个叫李丹的07年女孩出现在我面前时，那一刻，我整个人都被
          <span 
            onClick={() => setShowAABill(true)}
            className="relative cursor-pointer font-bold text-[#E35D6A] mx-1 hover:underline decoration-wavy"
          >
            惊艳
            <motion.span
              animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1 -right-2"
            >
              ✨
            </motion.span>
          </span>
          住了。
          <br /><br />
          哪怕你脸上带着一点点小情绪，但那一刻的你，真的好美。就像在这个充满变数的世界里，突然亮起了一束光。
          <br /><br />
          我记得你坚持要AA的样子，那份独立和自尊，是我见过最美的风景。
        </>
      );
    } else if (chapter.id === 'chapter3') {
      return (
        <>
          洗衣服、做饭、遛狗、撸猫...这些平凡的日常因为有你和盼盼石榴而变得闪闪发光。
          <br /><br />
          <span
            onClick={() => setShowVIPCard(true)}
            className="relative cursor-pointer font-bold text-amber-600 mx-1 hover:underline decoration-wavy"
          >
            苏记专属洗衣坊
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-3"
            >
              👑
            </motion.span>
          </span>
          ，终身VIP黑卡持有者：李丹。
        </>
      );
    } else if (chapter.id === 'chapter4') {
      return (
        <>
          2500公里的距离，是考验也是期待。
          <br /><br />
          我知道你打游戏时总爱说自己是
          <span 
            onClick={() => setShowMVPBadge(true)}
            className="relative cursor-pointer font-bold text-purple-600 mx-1 hover:underline decoration-wavy"
          >
            <motion.span
              animate={{
                textShadow: ['0 0 5px #A855F7', '0 0 15px #A855F7', '0 0 5px #A855F7'],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              MVP
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute -right-3 -top-2 text-yellow-400 text-xs"
            >
              ✨
            </motion.span>
          </span>
          ，那一刻的你，比任何国服法师都要耀眼。
          <br /><br />
          但你只管安心做你的小公主。等我回血，第一站我们就去亚庇看海，然后牵手走向全世界。
        </>
      );
    }
    return chapter.story;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
      <GridBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#7C444F] mb-2 font-handwriting">
            我们的故事
          </h1>
          <p className="text-[#9B6A6C] text-sm">从昆明开始，到一起的未来</p>
        </motion.div>

        {/* 章节进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-rose-200/50 -translate-y-1/2" />
            <motion.div 
              className="absolute top-1/2 left-2 h-0.5 bg-gradient-to-r from-[#E35D6A] to-rose-400 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(currentChapter / (chapters.length - 1)) * 100}%` }}
            />
            
            {chapters.map((ch, index) => (
              <button 
                key={ch.id} 
                onClick={() => { 
                  setDirection(index > currentChapter ? 1 : -1); 
                  setCurrentChapter(index); 
                }} 
                className="relative z-10 flex flex-col items-center group"
              >
                <div className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  index <= currentChapter 
                    ? 'bg-[#E35D6A] border-[#E35D6A] text-white' 
                    : 'bg-white/80 border-rose-300 text-[#9B6A6C] hover:border-[#E35D6A]'
                }`}>
                  <span className="text-xs font-bold">{ch.number}</span>
                </div>
                <span className={`mt-1.5 text-xs font-medium transition-colors ${
                  index === currentChapter ? 'text-[#E35D6A]' : 'text-[#9B6A6C]'
                }`}>
                  {ch.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 主内容区域 - 双栏布局 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid lg:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* 左栏：文字内容 */}
            <div className="space-y-4">
              {/* 标题栏 + 解密按钮 */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-4xl font-bold text-[#E35D6A]/30 font-handwriting">
                      {chapter.number}
                    </span>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-[#7C444F]">
                        {chapter.title}
                      </h2>
                      <p className="text-[#E35D6A] text-sm">{chapter.subtitle}</p>
                    </div>
                  </div>                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs text-[#7C444F] shadow-sm">
                      <Calendar className="w-3 h-3 text-[#E35D6A]" />
                      <span>{chapter.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs text-[#7C444F] shadow-sm">
                      <MapPin className="w-3 h-3 text-[#E35D6A]" />
                      <span>{chapter.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* 解密按钮 - 整合到标题栏 */}
                <div className="relative">
                  <motion.button
                    onClick={() => setDecryptionModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg"
                    style={{
                      background: isUnlocked 
                        ? 'linear-gradient(135deg, #F472B6 0%, #E35D6A 100%)' 
                        : 'rgba(255,255,255,0.9)',
                      border: isUnlocked ? 'none' : '2px solid #FBCFE8'
                    }}
                  >
                    {isUnlocked ? (
                      <Heart className="w-6 h-6 text-white fill-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-rose-400" />
                    )}
                  </motion.button>
                  
                  <ParticleBurst isActive={isUnlocked} />
                  
                  {!isUnlocked && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                    >
                      ?
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* 故事文字块 - 解锁前模糊 */}
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} perspective={1000} scale={1.01}>                <div 
                  className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-rose-100/50 transition-all duration-500 ${
                    !isUnlocked ? 'blur-[2px]' : ''
                  }`}
                >
                  <div className="max-w-2xl">
                    <p className="text-[#7C444F] leading-relaxed whitespace-pre-line text-base">
                      {renderStory()}
                    </p>
                  </div>
                </div>
              </Tilt>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {chapter.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm text-xs text-[#7C444F] border border-rose-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* 引用块 - 带引号装饰和粉色边框 */}
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} perspective={1000} scale={1.02}>
                <div className="relative bg-gradient-to-r from-rose-50/80 to-white/80 rounded-2xl p-5 shadow-sm border-l-4 border-[#E35D6A] overflow-hidden">
                  <Quote className="absolute top-3 right-3 w-8 h-8 text-[#E35D6A]/20" />
                  <div className="relative z-10">
                    <p className="text-lg text-[#7C444F] italic leading-relaxed font-light">
                      "{chapter.quote}"
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[#9B6A6C] text-xs">
                      <RedHeart />
                      <span>苏子钦</span>
                    </div>
                  </div>
                </div>
              </Tilt>
              
              {/* 高光时刻 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-medium text-[#7C444F] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E35D6A]" />
                  高光时刻
                </h3>                
                <div className="space-y-2">
                  {chapter.highlights.map((highlight, index) => (
                    <div key={highlight} className="flex items-center gap-2 text-[#7C444F] text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#E35D6A]/10 flex items-center justify-center text-xs text-[#E35D6A] font-handwriting">
                        {index + 1}
                      </span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 右栏：照片画廊 */}
            <div className="lg:pt-8">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.01}>
                <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-4 shadow-lg border border-white/50"
                >
                  <PhotoGallery photos={chapter.photos} onPhotoClick={setSelectedPhoto} />
                </div>
              </Tilt>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* 章节导航按钮 */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={handlePrev} 
            disabled={currentChapter === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all ${
              currentChapter === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-4 h-4 text-[#E35D6A]" />
            <span className="text-sm text-[#7C444F]">上一章</span>
          </button>
          
          <button 
            onClick={handleNext} 
            disabled={currentChapter === chapters.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all ${
              currentChapter === chapters.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-md'
            }`}
          >
            <span className="text-sm text-[#7C444F]">下一章</span>
            <ChevronRight className="w-4 h-4 text-[#E35D6A]" />
          </button>
        </div>
      </div>

      {/* 照片预览弹窗 */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="bg-rose-50 rounded-2xl p-3 aspect-[4/3] flex items-center justify-center overflow-hidden"
              >
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>              
              <h3 className="text-lg font-bold text-white mt-4 text-center">
                {selectedPhoto.caption}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 解密弹窗 */}
      <DecryptionModal
        isOpen={decryptionModalOpen}
        onClose={() => setDecryptionModalOpen(false)}
        chapter={chapter}
        isUnlocked={isUnlocked}
        onUnlock={() => {
          setUnlockedChapters(prev => new Set([...prev, chapter.id]));
        }}
      />

      {/* 彩蛋弹窗 */}
      <AABillModal isOpen={showAABill} onClose={() => setShowAABill(false)} />
      <BlackGoldVIPCard isOpen={showVIPCard} onClose={() => setShowVIPCard(false)} />
      <MVPBadge isOpen={showMVPBadge} onClose={() => setShowMVPBadge(false)} />
    </div>
  );
}
