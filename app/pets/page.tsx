'use client';

import { motion } from 'framer-motion';

// 手绘风格爪印
const HandDrawnPaw = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <ellipse cx="12" cy="15" rx="4" ry="3.5" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5" />
    <ellipse cx="6.5" cy="9" rx="2" ry="2.5" fill="#F8AD9D" fillOpacity="0.4" stroke="#F8AD9D" strokeWidth="1.5" />
    <ellipse cx="12" cy="6" rx="2" ry="2.5" fill="#F8AD9D" fillOpacity="0.4" stroke="#F8AD9D" strokeWidth="1.5" />
    <ellipse cx="17.5" cy="9" rx="2" ry="2.5" fill="#F8AD9D" fillOpacity="0.4" stroke="#F8AD9D" strokeWidth="1.5" />
  </svg>
);

// 手绘风格心形
const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1.5"
    />
  </svg>
);

const pets = [
  {
    name: '盼盼',
    englishName: 'Panpan',
    species: '猫',
    role: '家庭长子',
    description: '从腾冲带回来的小天使，见证了我们的旅程。',
    traits: ['粘人', '会踩奶', '爱吃罐头'],
  },
  {
    name: '石榴',
    englishName: 'Shiliu',
    species: '猫',
    role: '家庭次子',
    description: '在北海加入我们的新成员，盼盼的小跟班。',
    traits: ['活泼', '爱跑酷', '喜欢追尾巴'],
  },
];

const petMoments = [
  { title: '腾冲相遇', desc: '盼盼加入我们的那一天' },
  { title: '北海新成员', desc: '石榴来到这个家' },
  { title: '日常追逐战', desc: '石榴追，盼盼跑' },
  { title: '和平共处', desc: '偶尔也能一起睡觉' },
];

export default function PetsPage() {
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
            <HandDrawnPaw />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#5D4037] mb-2 font-handwriting">
            宠物专区
          </h1>

          <p className="text-[#8D6E63]">
            盼盼和石榴，我们小窝里的两位毛孩子
          </p>
        </motion.div>

        {/* 宠物卡片 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="warm-card rounded-3xl p-6 h-full relative overflow-hidden group warm-card-hover">
                {/* 装饰背景 */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F8AD9D]/10 rounded-full blur-2xl group-hover:bg-[#F8AD9D]/20 transition-colors" />

                <div className="relative z-10">
                  {/* 头像区域 */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-[#F8AD9D]/20 flex items-center justify-center text-3xl">
                      🐱
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#5D4037]">
                        {pet.name}
                        <span className="text-sm text-[#8D6E63] font-normal ml-2">{pet.englishName}</span>
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-3 py-1 bg-[#F8AD9D]/20 rounded-full text-xs text-[#F8AD9D]">
                          {pet.species}
                        </span>
                        <span className="text-xs text-[#8D6E63]">{pet.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-[#5D4037]/80 mb-4">{pet.description}</p>

                  {/* 特点标签 */}
                  <div className="flex flex-wrap gap-2">
                    {pet.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 rounded-full bg-[#FFF0D4] text-xs text-[#5D4037]"
                      >
                        ✦ {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 日常时刻 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-xl font-medium text-[#5D4037] mb-6 flex items-center">
            <HandDrawnPaw />
            <span className="ml-2">毛孩子的日常</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {petMoments.map((moment, index) => (
              <motion.div
                key={moment.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="warm-card rounded-2xl p-4 text-center warm-card-hover"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#F8AD9D]/20 flex items-center justify-center">
                  <HandDrawnPaw />
                </div>
                <h4 className="text-sm font-medium text-[#5D4037] mb-1">{moment.title}</h4>
                <p className="text-xs text-[#8D6E63]">{moment.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 寄语 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="warm-card rounded-3xl p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HandDrawnHeart />
              <span className="text-[#F8AD9D] text-sm font-medium">给盼盼和石榴的愿望</span>
              <HandDrawnHeart />
            </div>

            <p className="text-[#5D4037] text-lg mb-4">
              给毛孩子们的承诺
            </p>

            <div className="space-y-2 text-[#8D6E63]">
              <p>✦ 给盼盼找个伴，或者让它和石榴学会和平共处</p>
              <p>✦ 换一套带超大落地窗的房子，让阳光铺满你们睡觉的地方</p>
              <p>✦ 每天都有吃不完的罐头和零食</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
