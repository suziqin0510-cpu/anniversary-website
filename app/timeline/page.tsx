'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronLeft, ChevronRight, MapPin, Calendar, Heart, Quote } from 'lucide-react';

const chapters = [
  {
    id: 'chapter-1',
    number: '01',
    title: '初见',
    subtitle: '那顿被打破剧本的火锅',
    date: '2025.05.20',
    location: '昆明长水机场 & 同德旁边的火锅店',
    story: `从三亚回昆明的你，在机场见到了那个有点小情绪的女孩。

在同德吃完火锅，你本以为这只是又一次普通的面基，结果17岁的她执意要AA。

那一刻我觉得你真酷，不是那种装出来的酷，而是骨子里的自尊。

我当时想：这个女孩，我得护着。`,
    quote: '那一刻我觉得你真酷，不是那种装出来的酷，而是骨子里的自尊。',
    highlights: ['机场初见', '同德火锅', '坚持AA'],
    tags: ['昆明', '初见', '火锅'],
  },
  {
    id: 'chapter-2',
    number: '02',
    title: '热恋',
    subtitle: '在路上的风与痛',
    date: '2025.06 - 2025.08',
    location: '香格里拉 · 芒市 · 腾冲',
    story: `香格里拉的楼顶温泉，没看到的日照金山，芒市街头我推着的轮椅。

丽江的果酒让你睡了一路，我在芒市为你奔波索赔，在腾冲我们带走了盼盼。

在芒市看你腿肿得像个馒头，我比你还疼。

但我那时候确认了，只要你在副驾，去哪儿我都不累。`,
    quote: '只要你在副驾，去哪儿我都不累。',
    highlights: ['香格里拉温泉', '芒市轮椅', '带走盼盼'],
    tags: ['旅行', '香格里拉', '芒市', '腾冲'],
  },
  {
    id: 'chapter-3',
    number: '03',
    title: '日常',
    subtitle: '150平米的烟火气',
    date: '2025.09 - 2025.12',
    location: '我们的家',
    story: `我在卫生间洗着你的内衣裤，你在沙发上刷着抖音，盼盼在屋里跑，石榴在它屁股后面追。

打王者时虽然你总因为"段位拉开"而不开心，但我知道，只要你拿了MVP并且赢了，你就会笑得像个孩子。

生活不是天天看雪山，而是我愿意在这个租来的房子里，为你打一辈子杂。`,
    quote: '生活不是天天看雪山，而是我愿意在这个租来的房子里，为你打一辈子杂。',
    highlights: ['洗内衣裤', '刷抖音', '打王者', '盼盼石榴'],
    tags: ['日常', '居家', '游戏'],
  },
  {
    id: 'chapter-4',
    number: '04',
    title: '一周年',
    subtitle: '跨越山海的笃定',
    date: '2026.05.20',
    location: '匈牙利 · 马来西亚',
    story: `这一年，我们吵了无数次架，砸过车门，也有过委屈。

但从匈牙利到马来西亚，我们都没放手。

老婆，我正在学AI，正在拼命回款，我在给我们的"石榴"和"盼盼"建一个更稳的家。

等我回血，带你去走遍世界。`,
    quote: '等我回血，带你去走遍世界。',
    highlights: ['匈牙利', '马来西亚', 'USM', '没放手'],
    tags: ['一周年', '跨国', '未来'],
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
    <div className="min-h-screen bg-[#0F0F13] pt-24 pb-12 overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,165,116,0.08)_0%,_transparent_50%)]" />
        <div className="absolute top-1/2 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#D4A574]/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass-effect rounded-full mb-4">
            <Terminal className="w-4 h-4 text-[#D4A574]" />
            <span className="text-xs text-[#8A8A92] font-mono">TIMELINE_DATA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
            时间线
          </h1>
          <p className="text-[#8A8A92]">我们的故事，从昆明开始</p>
        </motion.div>

        {/* 章节导航 - 横向时间轴 */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* 连接线 */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2A2A32]" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#D4A574] to-[#E8843C] transition-all duration-500"
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
                      ? 'bg-[#D4A574] border-[#D4A574]'
                      : 'bg-[#0F0F13] border-[#2A2A32]'
                  }`}
                />
                <span
                  className={`mt-2 text-xs font-mono transition-colors ${
                    index === currentChapter ? 'text-[#D4A574]' : 'text-[#8A8A92]'
                  }`}
                >
                  {ch.number}
                </span>
              </button>
            ))}
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
                    <span className="text-6xl font-bold text-[#D4A574]/20 font-mono">
                      {chapter.number}
                    </span>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#E8E8EC]">
                        {chapter.title}
                      </h2>
                      <p className="text-[#D4A574] text-lg">{chapter.subtitle}</p>
                    </div>
                  </div>

                  {/* 元信息 */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2 px-3 py-1.5 glass-effect rounded-full">
                      <Calendar className="w-4 h-4 text-[#D4A574]" />
                      <span className="text-sm text-[#8A8A92]">{chapter.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 glass-effect rounded-full">
                      <MapPin className="w-4 h-4 text-[#D4A574]" />
                      <span className="text-sm text-[#8A8A92]">{chapter.location}</span>
                    </div>
                  </div>
                </div>

                {/* 故事内容 */}
                <div className="glass-effect rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-4 text-[#D4A574]">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-mono">STORY_LOG</span>
                  </div>
                  <p className="text-[#E8E8EC] leading-relaxed whitespace-pre-line">
                    {chapter.story}
                  </p>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {chapter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#D4A574]/10 text-xs text-[#D4A574] border border-[#D4A574]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 右侧：引用和亮点 */}
              <div className="space-y-6">
                {/* 引用卡片 */}
                <div className="glass-effect rounded-2xl p-6 border-l-4 border-[#D4A574]">
                  <Quote className="w-6 h-6 text-[#D4A574] mb-4" />
                  <p className="text-xl text-[#E8E8EC] italic leading-relaxed">
                    "{chapter.quote}"
                  </p>
                  <div className="mt-4 flex items-center space-x-2 text-[#8A8A92] text-sm">
                    <Heart className="w-4 h-4 text-[#D4A574] fill-[#D4A574]" />
                    <span>苏子钦的内心独白</span>
                  </div>
                </div>

                {/* 高光时刻 */}
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-sm font-mono text-[#8A8A92] mb-4 flex items-center">
                    <span className="w-2 h-2 bg-[#D4A574] rounded-full mr-2" />
                    HIGHLIGHTS
                  </h3>
                  <div className="space-y-3">
                    {chapter.highlights.map((highlight, index) => (
                      <div
                        key={highlight}
                        className="flex items-center space-x-3 text-[#E8E8EC]"
                      >
                        <span className="text-[#D4A574] font-mono text-sm">
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 照片占位 */}
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="aspect-video bg-[#1A1A1F] rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#D4A574]/10 flex items-center justify-center">
                        <span className="text-3xl">📸</span>
                      </div>
                      <p className="text-[#8A8A92] text-sm">这里可以放你们的照片</p>
                      <p className="text-[#8A8A92]/60 text-xs mt-1">上传至图床后替换链接</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 导航按钮 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
            <button
              onClick={handlePrev}
              disabled={currentChapter === 0}
              className={`pointer-events-auto p-3 rounded-full glass-effect transition-all ${
                currentChapter === 0
                  ? 'opacity-0'
                  : 'opacity-100 hover:bg-[#D4A574]/20'
              }`}
            >
              <ChevronLeft className="w-6 h-6 text-[#D4A574]" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentChapter === chapters.length - 1}
              className={`pointer-events-auto p-3 rounded-full glass-effect transition-all ${
                currentChapter === chapters.length - 1
                  ? 'opacity-0'
                  : 'opacity-100 hover:bg-[#D4A574]/20'
              }`}
            >
              <ChevronRight className="w-6 h-6 text-[#D4A574]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
