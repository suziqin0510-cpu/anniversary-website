'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

// 手绘风格心形 - 跳动效果
const BeatingHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1.5"
    />
  </svg>
);

// 手绘风格引号
const HandDrawnQuote = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <path d="M4 10c0-3 2-5 5-5v3c-1 0-2 1-2 2v1h3v7H4v-8zM13 10c0-3 2-5 5-5v3c-1 0-2 1-2 2v1h3v7h-6v-8z" fill="#F8AD9D" fillOpacity="0.5" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const chapters = [
  {
    id: 'chapter-1',
    number: '01',
    title: '初见',
    subtitle: '那顿打破剧本的火锅',
    date: '2025.05.20',
    location: '昆明长水机场 & 同德旁边的火锅店',
    story: `2025.05.20，长水机场。你带着一身小情绪出现在我面前。

在同德吃完火锅，你极其认真地坚持要 AA。那一刻我心里的震撼大过好奇：这个才 17 岁的小丫头，骨子里怎么会有这么酷的自尊？

从那天起，我想护着你的念头，就再也没断过。`,
    quote: '这个才 17 岁的小丫头，骨子里怎么会有这么酷的自尊？',
    highlights: ['机场初见', '同德火锅', '坚持AA'],
    tags: ['昆明', '初见', '火锅'],
  },
  {
    id: 'chapter-2',
    number: '02',
    title: '旅程',
    subtitle: '轮椅上的落日与温柔',
    date: '2025.06 - 2025.08',
    location: '香格里拉 · 芒市 · 腾冲',
    story: `我们在香格里拉顶楼温泉听歌，在腾冲接走'盼盼'。

最难忘是芒市，看你脚肿得像馒头，我推着轮椅带你走街串巷。那时候我才发现，比起看美景，我更想看你开开心心的。

只要你在副驾，这一路翻山越岭，我都不觉得累。`,
    quote: '比起看美景，我更想看你开开心心的。',
    highlights: ['香格里拉温泉', '芒市轮椅', '带走盼盼'],
    tags: ['旅行', '香格里拉', '芒市', '腾冲'],
  },
  {
    id: 'chapter-3',
    number: '03',
    title: '生活',
    subtitle: '我们的小窝与烟火气',
    date: '2025.09 - 2025.12',
    location: '我们的家',
    story: `在北海接回了石榴，我们的小窝终于整整齐齐了。

最温暖的回忆，是你妈妈硬塞给我们的那一罐猪油和土豆片——那是长辈对我们最踏实的认可。

生活就是我在卫生间给你手洗内衣裤，你在沙发刷抖音；是我们在王者峡谷并肩作战。这间屋子因为有你，才真的成了'家'。`,
    quote: '这间屋子因为有你，才真的成了"家"。',
    highlights: ['接回石榴', '妈妈的猪油', '洗内衣裤', '王者峡谷'],
    tags: ['日常', '居家', '游戏'],
  },
];

export default function TimelinePage() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [direction, setDirection] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] pt-24 pb-12 overflow-hidden">
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
          <h1 className="text-4xl md:text-5xl font-bold text-[#5D4037] mb-2 font-handwriting">
            我们的故事
          </h1>
          <p className="text-[#8D6E63]">从昆明开始，到一起的未来</p>
        </motion.div>

        {/* 章节导航 - 横向时间轴 */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative px-4">
            {/* 连接线 - 点状虚线 */}
            <div className="absolute top-1/2 left-4 right-4 h-0 border-t-2 border-dashed border-[#F8AD9D]/40" />

            {/* 进度线 */}
            <div
              className="absolute top-1/2 left-4 h-0 border-t-2 border-[#F8AD9D] transition-all duration-500"
              style={{ width: `${(currentChapter / (chapters.length - 1)) * 100}%` }}
            />

            {chapters.map((ch, index) => (
              <button
                key={ch.id}
                onClick={() => {
                  setDirection(index > currentChapter ? 1 : -1);
                  setCurrentChapter(index);
                }}
                className="relative z-10 flex flex-col items-center"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    index <= currentChapter
                      ? 'bg-[#F8AD9D] border-[#F8AD9D]'
                      : 'bg-[#FFFBF0] border-[#F8AD9D]/40'
                  }`}
                />
                <span
                  className={`mt-3 text-sm font-medium transition-colors ${
                    index === currentChapter ? 'text-[#F8AD9D]' : 'text-[#8D6E63]'
                  }`}
                >
                  {ch.number}
                </span>
              </button>
            ))}

            {/* 末尾的跳动小心 */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 transform translate-x-0">
              <div className="flex flex-col items-center">
                <BeatingHeart />
              </div>
            </div>
          </div>
        </div>

        {/* 章节内容 */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* 左侧：章节信息 */}
              <div className="space-y-6">
                {/* 章节编号和标题 */}
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-6xl font-bold text-[#F8AD9D]/30 font-handwriting">
                      {chapter.number}
                    </span>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#5D4037]">
                        {chapter.title}
                      </h2>
                      <p className="text-[#F8AD9D] text-lg">{chapter.subtitle}</p>
                    </div>
                  </div>

                  {/* 元信息 */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2 px-4 py-2 warm-card rounded-full">
                      <Calendar className="w-4 h-4 text-[#F8AD9D]" />
                      <span className="text-sm text-[#5D4037]">{chapter.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 warm-card rounded-full">
                      <MapPin className="w-4 h-4 text-[#F8AD9D]" />
                      <span className="text-sm text-[#5D4037]">{chapter.location}</span>
                    </div>
                  </div>
                </div>

                {/* 故事内容 */}
                <div className="warm-card rounded-3xl p-6">
                  <p className="text-[#5D4037] leading-relaxed whitespace-pre-line text-lg">
                    {chapter.story}
                  </p>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {chapter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full bg-[#F8AD9D]/10 text-sm text-[#5D4037] border border-[#F8AD9D]/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 右侧：引用和亮点 */}
              <div className="space-y-6">
                {/* 引用卡片 */}
                <div className="warm-card rounded-3xl p-6 border-l-4 border-[#F8AD9D]">
                  <HandDrawnQuote />
                  <p className="text-xl text-[#5D4037] italic leading-relaxed mt-4 font-light">
                    "{chapter.quote}"
                  </p>
                  <div className="mt-4 flex items-center space-x-2 text-[#8D6E63] text-sm">
                    <BeatingHeart />
                    <span>苏子钦</span>
                  </div>
                </div>

                {/* 高光时刻 */}
                <div className="warm-card rounded-3xl p-6">
                  <h3 className="text-sm text-[#8D6E63] mb-4 flex items-center font-medium">
                    <span className="w-2 h-2 bg-[#F8AD9D] rounded-full mr-2" />
                    高光时刻
                  </h3>
                  <div className="space-y-3">
                    {chapter.highlights.map((highlight, index) => (
                      <div
                        key={highlight}
                        className="flex items-center space-x-3 text-[#5D4037]"
                      >
                        <span className="text-[#F8AD9D] font-handwriting text-lg">
                          {String(index + 1)}.
                        </span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 照片占位 */}
                <div className="warm-card rounded-3xl p-6 text-center">
                  <div className="aspect-video bg-[#FFF0D4]/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-[#F8AD9D]/30">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#F8AD9D]/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                          <rect x="3" y="6" width="18" height="15" rx="2" stroke="#F8AD9D" strokeWidth="1.5" fill="none"/>
                          <circle cx="12" cy="13" r="3" stroke="#F8AD9D" strokeWidth="1.5"/>
                          <path d="M8 6L9 3h6l1 3" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="text-[#8D6E63] text-sm">这里可以放你们的照片</p>
                      <p className="text-[#8D6E63]/60 text-xs mt-1">上传后替换链接</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 导航按钮 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-0 md:-mx-4">
            <button
              onClick={handlePrev}
              disabled={currentChapter === 0}
              className={`pointer-events-auto p-3 rounded-full warm-card warm-card-hover transition-all ${
                currentChapter === 0
                  ? 'opacity-0'
                  : 'opacity-100'
              }`}
            >
              <ChevronLeft className="w-6 h-6 text-[#F8AD9D]" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentChapter === chapters.length - 1}
              className={`pointer-events-auto p-3 rounded-full warm-card warm-card-hover transition-all ${
                currentChapter === chapters.length - 1
                  ? 'opacity-0'
                  : 'opacity-100'
              }`}
            >
              <ChevronRight className="w-6 h-6 text-[#F8AD9D]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
