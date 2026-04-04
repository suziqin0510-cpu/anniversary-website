'use client';

import { motion } from 'framer-motion';
import { Heart, PawPrint, Sparkles, Camera } from 'lucide-react';

const pets = [
  {
    name: '盼盼',
    englishName: 'Panpan',
    species: '猫',
    role: '家庭长子',
    description: '从腾冲带回来的小天使，见证了我们的旅程。',
    traits: ['粘人', '会踩奶', '爱吃罐头'],
    color: 'from-[#D4A574] to-[#E8843C]',
  },
  {
    name: '石榴',
    englishName: 'Shiliu',
    species: '猫',
    role: '家庭次子',
    description: '在北海加入我们的新成员，盼盼的小跟班。',
    traits: ['活泼', '爱跑酷', '喜欢追尾巴'],
    color: 'from-[#E8843C] to-[#F4A460]',
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
    <div className="min-h-screen bg-[#0F0F13] pt-24 pb-12">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,165,116,0.1)_0%,_transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass-effect rounded-full mb-4">
            <PawPrint className="w-4 h-4 text-[#D4A574]" />
            <span className="text-xs text-[#8A8A92] font-mono">FAMILY_MEMBERS</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            宠物专区
          </h1>

          <p className="text-[#8A8A92]">
            盼盼和石榴，我们150平米小窝里的两位毛孩子
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
              <div className="glass-effect rounded-2xl p-6 h-full relative overflow-hidden group">
                {/* 装饰背景 */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${pet.color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />

                <div className="relative z-10">
                  {/* 头像区域 */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${pet.color} flex items-center justify-center text-3xl`}>
                      🐱
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#E8E8EC]">
                        {pet.name}
                        <span className="text-sm text-[#8A8A92] font-normal ml-2">{pet.englishName}</span>
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2 py-0.5 bg-[#D4A574]/20 rounded text-xs text-[#D4A574] font-mono">
                          {pet.species}
                        </span>
                        <span className="text-xs text-[#8A8A92]">{pet.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-[#E8E8EC]/80 mb-4">{pet.description}</p>

                  {/* 特点标签 */}
                  <div className="flex flex-wrap gap-2">
                    {pet.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 rounded-full bg-[#2A2A32] text-xs text-[#E8E8EC]/70"
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
          <h3 className="text-xl font-medium text-[#E8E8EC] mb-6 flex items-center">
            <Sparkles className="w-5 h-5 text-[#D4A574] mr-2" />
            毛孩子的日常
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {petMoments.map((moment, index) => (
              <motion.div
                key={moment.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-effect rounded-xl p-4 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-[#D4A574]" />
                </div>
                <h4 className="text-sm font-medium text-[#E8E8EC] mb-1">{moment.title}</h4>
                <p className="text-xs text-[#8A8A92]">{moment.desc}</p>
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
          <div className="glass-effect rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-[#D4A574] fill-[#D4A574]" />
              <span className="text-[#D4A574] font-mono text-sm">WISHLIST_FOR_PETS</span>
              <Heart className="w-5 h-5 text-[#D4A574] fill-[#D4A574]" />
            </div>

            <p className="text-[#E8E8EC] text-lg mb-4">
              给盼盼和石榴的愿望
            </p>

            <div className="space-y-2 text-[#8A8A92]">
              <p>✦ 给盼盼找个伴，或者让它和石榴学会和平共处</p>
              <p>✦ 换一套能看到海或者更大落地窗的房子（属于我们的家）</p>
              <p>✦ 每天都有吃不完的罐头和零食</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
