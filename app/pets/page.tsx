'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const HandDrawnPaw = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <ellipse cx="12" cy="15" rx="4" ry="3.5" fill="#E35D6A" fillOpacity="0.3" stroke="#E35D6A" strokeWidth="1.5" />
    <ellipse cx="6.5" cy="9" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#E35D6A" strokeWidth="1.5" />
    <ellipse cx="12" cy="6" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#E35D6A" strokeWidth="1.5" />
    <ellipse cx="17.5" cy="9" rx="2" ry="2.5" fill="#E35D6A" fillOpacity="0.4" stroke="#E35D6A" strokeWidth="1.5" />
  </svg>
);

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

const petsData = [
  {
    id: 'panpan',
    name: '盼盼',
    englishName: 'Panpan',
    species: '猫',
    role: '家庭长子',
    description: '从腾冲带回来的小天使，见证了我们的旅程。',
    traits: ['粘人', '会踩奶', '爱吃罐头'],
    isShiliu: false
  },
  {
    id: 'shiliu',
    name: '石榴',
    englishName: 'Shiliu',
    species: '猫',
    role: '家庭次子',
    description: '在北海加入我们的新成员，盼盼的小跟班。',
    traits: ['活泼', '爱跑酷', '喜欢追尾巴'],
    isShiliu: true
  },
];

const petMoments = [
  { title: '腾冲相遇', desc: '盼盼加入我们的那一天' },
  { title: '北海新成员', desc: '石榴来到这个家' },
  { title: '日常追逐战', desc: '石榴追，盼盼跑' },
  { title: '和平共处', desc: '偶尔也能一起睡觉' },
];

export default function PetsPage() {
  const [shiliuClicks, setShiliuClicks] = useState(0);
  const [isShiliuShaking, setIsShiliuShaking] = useState(false);
  const [showShiliuResponse, setShowShiliuResponse] = useState(false);

  const handleShiliuClick = () => {
    const newCount = shiliuClicks + 1;
    setShiliuClicks(newCount);

    if (newCount >= 3) {
      setIsShiliuShaking(true);
      setShowShiliuResponse(true);

      setTimeout(() => {
        setIsShiliuShaking(false);
      }, 500);

      setTimeout(() => {
        setShowShiliuResponse(false);
        setShiliuClicks(0);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-4"><HandDrawnPaw /></div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-sunset mb-2 font-handwriting">宠物专区</h1>
          <p className="text-[#9B6A6C]">盼盼和石榴，我们小窝里的两位毛孩子</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {petsData.map((pet, index) => (
            <motion.div key={pet.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem' }}>
                <div className="glass-card rounded-3xl p-6 h-full relative overflow-hidden group glass-card-hover">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E35D6A]/10 rounded-full blur-2xl group-hover:bg-[#E35D6A]/20 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                      {/* 头像区域 - 石榴有点击彩蛋 */}
                      <div
                        onClick={pet.isShiliu ? handleShiliuClick : undefined}
                        className={`relative w-20 h-20 rounded-2xl glass-card-highlight flex items-center justify-center text-3xl cursor-pointer select-none ${
                          pet.isShiliu && isShiliuShaking ? 'animate-shake' : ''
                        }`}
                      >
                        🐱

                        {/* 石榴的对话气泡彩蛋 */}
                        {pet.isShiliu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute -top-2 -right-16 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-rose-200 shadow-lg whitespace-nowrap"
                          >
                            <p className="text-xs text-rose-600 font-medium">
                              {showShiliuResponse ? "喵！救命！(╬▔皿▔)凸" : "点我点我...喵"}
                            </p>
                            <div className="absolute bottom-0 left-2 w-2 h-2 bg-white/80 border-r border-b border-rose-200 transform rotate-45 translate-y-1" />
                          </motion.div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-[#7C444F]">
                          {pet.name}
                          <span className="text-sm text-[#9B6A6C] font-normal ml-2">{pet.englishName}</span>
                        </h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-3 py-1 glass-card-highlight rounded-full text-xs text-[#E35D6A]">{pet.species}</span>
                          <span className="text-xs text-[#9B6A6C]">{pet.role}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[#7C444F]/80 mb-4">{pet.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {pet.traits.map((trait) => (
                        <span key={trait} className="px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm text-xs text-[#7C444F] border border-white/50">
                          ✦ {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
          <h3 className="text-xl font-medium text-[#7C444F] mb-6 flex items-center">
            <HandDrawnPaw />
            <span className="ml-2">毛孩子的日常</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {petMoments.map((moment, index) => (
              <motion.div key={moment.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + index * 0.1 }}>
                <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} scale={1.05} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1rem" style={{ borderRadius: '1rem' }}>
                  <div className="glass-card rounded-2xl p-4 text-center glass-card-hover">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl glass-card-highlight flex items-center justify-center">
                      <HandDrawnPaw />
                    </div>
                    <h4 className="text-sm font-medium text-[#7C444F] mb-1">{moment.title}</h4>
                    <p className="text-xs text-[#9B6A6C]">{moment.desc}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.01} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem' }}>
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <RedHeart />
                <span className="text-[#E35D6A] text-sm font-medium">给盼盼和石榴的愿望</span>
                <RedHeart />
              </div>
              <p className="text-[#7C444F] text-lg mb-4">给毛孩子们的承诺</p>
              <div className="space-y-2 text-[#9B6A6C]">
                <p>✦ 给盼盼找个伴，或者让它和石榴学会和平共处</p>
                <p>✦ 换一套带超大落地窗的房子，让阳光铺满你们睡觉的地方</p>
                <p>✦ 每天都有吃不完的罐头和零食</p>
              </div>
            </div>
          </Tilt>
        </motion.div>
      </div>
    </div>
  );
}
