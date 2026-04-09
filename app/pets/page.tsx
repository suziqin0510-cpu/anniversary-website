'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import confetti from 'canvas-confetti';
import { animate, random, remove } from 'animejs';
import GrandChapterToast from '@/components/GrandChapterToast';
import { useGrandChapterCelebration } from '@/lib/hooks/useGrandChapterCelebration';
import { celebratePets } from '@/lib/utils/celebrate';
import { useGame } from '@/lib/game-context';
import { useRouter } from 'next/navigation';

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
    species: '阿拉斯加大型犬',
    role: '家庭长子',
    description: '从腾冲带回来的小天使，憨厚可爱的阿拉斯加大型犬。',
    traits: ['贪吃', '金刚胃', '啥都爱吃'],
    isShiliu: false,
    avatar: 'https://i.ibb.co/1fLpKq6F/9a0bc540efc35b7a73ed6d9b0ffc0e4e.jpg'
  },
  {
    id: 'shiliu',
    name: '石榴',
    englishName: 'Shiliu',
    species: '橘白色小母猫',
    role: '家庭次子',
    description: '去完北海回到昆明后加入我们的新成员，盼盼的小跟班。',
    traits: ['黏人', '爱跑酷', '爱吃罐头'],
    isShiliu: true,
    avatar: 'https://i.ibb.co/ZRF97VgQ/326776b42fce29c596123fef423cc1aa.jpg'
  },
];

const petMoments = [
  { title: '腾冲相遇', desc: '盼盼加入我们的那一天' },
  { title: '北海新成员', desc: '石榴来到这个家' },
  { title: '日常追逐战', desc: '盼盼追，石榴跑' },
  { title: '和平共处', desc: '偶尔也能一起睡觉' },
];

// 彩蛋气泡组件 - 定位在卡片右上角
const EasterEggBubble = ({
  isVisible,
  isShiliu,
  showResponse,
}: {
  isVisible: boolean;
  isShiliu: boolean;
  showResponse: boolean;
}) => {
  const messages = isShiliu
    ? { default: '点我点我...喵~ 💕', response: '喵！救命！ (╬▔皿▔)凸' }
    : { default: '汪~ 点我有惊喜！', response: '妈妈，爸爸说他这辈子最幸运的事就是遇见你。' };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -5 }}
          className={`absolute top-2 right-2 z-[200] px-3 py-2 rounded-xl border-2 shadow-[0_4px_15px_rgba(0,0,0,0.12)] max-w-[200px] ${
            isShiliu
              ? 'bg-gradient-to-br from-rose-400 to-rose-500 border-white'
              : 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          <p className={`text-[10px] leading-snug font-medium ${isShiliu ? 'text-white drop-shadow-sm' : 'text-amber-800'}`}>
            {showResponse ? messages.response : messages.default}
          </p>
          {/* 小尾巴 - 指向右下方头像 */}
          <div
            className={`absolute -bottom-1.5 right-6 w-2.5 h-2.5 transform rotate-45 ${
              isShiliu ? 'bg-rose-500 border-b-2 border-r-2 border-white' : 'bg-amber-200 border-b-2 border-r-2 border-amber-300'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function PetsPage() {
  const router = useRouter();
  const { setIsEndingSequence } = useGame();

  const [shiliuClicks, setShiliuClicks] = useState(0);
  const [isShiliuShaking, setIsShiliuShaking] = useState(false);
  const [showShiliuResponse, setShowShiliuResponse] = useState(false);
  const [shiliuHovered, setShiliuHovered] = useState(false);

  const [panpanClicks, setPanpanClicks] = useState(0);
  const [isPanpanBarking, setIsPanpanBarking] = useState(false);
  const [showPanpanResponse, setShowPanpanResponse] = useState(false);
  const [panpanHovered, setPanpanHovered] = useState(false);

  const { toast } = useGrandChapterCelebration({
    level: 6,
    id: 'pets',
    title: '第六章解锁',
    subtitle: '盼盼和石榴，欢迎回家',
    celebrate: celebratePets,
  });

  // SZQLD 极客暗号逻辑
  const keySeqRef = useRef('');
  const [showLoveMessage, setShowLoveMessage] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTriggered) {
          e.preventDefault();
          setIsEndingSequence(true);
          router.push('/');
          return;
        }

        setShowLoveMessage(false);
        setIsTriggered(false);
        keySeqRef.current = '';

        remove('.js-gravity-fragment');
        document.querySelectorAll('.js-gravity-fragment').forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.position = '';
          htmlEl.style.top = '';
          htmlEl.style.left = '';
          htmlEl.style.width = '';
          htmlEl.style.height = '';
          htmlEl.style.zIndex = '';
          htmlEl.style.margin = '';
          htmlEl.style.transform = '';
          htmlEl.style.opacity = '';
        });
        return;
      }
      if (isTriggered) return;

      keySeqRef.current = (keySeqRef.current + e.key.toLowerCase()).slice(-5);

      if (keySeqRef.current === 'szqld') {
        setIsTriggered(true);

        // 物理崩塌 + 玫瑰雨
        const colors = ['#E35D6A', '#F472B6', '#FB7185', '#FDA4AF', '#FECDD3', '#FFFFFF'];
        const burst = (delay: number) => {
          setTimeout(() => {
            confetti({ colors, shapes: ['circle'], scalar: 2, gravity: 1.2, drift: 0, ticks: 300, particleCount: 200, spread: 360, origin: { x: 0.5, y: 0.5 } });
            confetti({ colors, shapes: ['circle'], scalar: 2, gravity: 1.2, drift: 0, ticks: 300, particleCount: 200, spread: 180, origin: { x: 0.2, y: 0.4 } });
            confetti({ colors, shapes: ['circle'], scalar: 2, gravity: 1.2, drift: 0, ticks: 300, particleCount: 200, spread: 180, origin: { x: 0.8, y: 0.4 } });
            confetti({ colors, shapes: ['circle'], scalar: 2, gravity: 1.2, drift: 0, ticks: 300, particleCount: 200, spread: 180, origin: { x: 0.3, y: 0.7 } });
            confetti({ colors, shapes: ['circle'], scalar: 2, gravity: 1.2, drift: 0, ticks: 300, particleCount: 200, spread: 180, origin: { x: 0.7, y: 0.7 } });
          }, delay);
        };
        burst(0);
        burst(400);
        burst(800);

        // 阶段 A：脱离与散落
        const fragments = document.querySelectorAll('.js-gravity-fragment');
        fragments.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const htmlEl = el as HTMLElement;
          htmlEl.style.position = 'fixed';
          htmlEl.style.top = `${rect.top}px`;
          htmlEl.style.left = `${rect.left}px`;
          htmlEl.style.width = `${rect.width}px`;
          htmlEl.style.height = `${rect.height}px`;
          htmlEl.style.zIndex = '100';
          htmlEl.style.margin = '0';
        });

        animate('.js-gravity-fragment', {
          top: () => random(0, 180) + 'px',
          left: () => random(0, window.innerWidth - 80) + 'px',
          rotate: () => random(-720, 720),
          scale: [1, random(0.7, 0.95)],
          opacity: [1, random(0.8, 1)],
          delay: () => random(0, 500),
          duration: 1200,
          easing: 'easeOutBounce',
        });

        // 阶段 B：终极告白
        setTimeout(() => {
          setShowLoveMessage(true);
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTriggered]);

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

  const handlePanpanClick = () => {
    const newCount = panpanClicks + 1;
    setPanpanClicks(newCount);

    if (newCount >= 2) {
      setIsPanpanBarking(true);
      setShowPanpanResponse(true);

      setTimeout(() => {
        setIsPanpanBarking(false);
      }, 500);

      setTimeout(() => {
        setShowPanpanResponse(false);
        setPanpanClicks(0);
      }, 4000);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/pets_bg.png?v=2')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/40 pointer-events-none" />
      <GrandChapterToast toast={toast} />
      <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 js-gravity-fragment">
          <div className="flex justify-center mb-4"><HandDrawnPaw /></div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-handwriting drop-shadow-lg">宠物专区</h1>
          <p className="text-white/90 drop-shadow-md">盼盼和石榴，我们小窝里的两位毛孩子</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {petsData.map((pet, index) => {
            const isShiliu = pet.isShiliu;
            const isHovered = isShiliu ? shiliuHovered : panpanHovered;
            const showResponse = isShiliu ? showShiliuResponse : showPanpanResponse;
            const isShaking = isShiliu ? isShiliuShaking : isPanpanBarking;

            return (
              <motion.div key={pet.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="js-gravity-fragment">
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem' }}>
                  {/* 卡片容器 - relative 用于定位彩蛋气泡，overflow-visible 确保气泡不被裁剪 */}
                  <div className="glass-card rounded-3xl p-6 h-full relative overflow-visible group glass-card-hover bg-white/30">
                    {/* 彩蛋气泡 - 固定在卡片右上角 */}
                    <EasterEggBubble
                      isVisible={isHovered || showResponse}
                      isShiliu={isShiliu}
                      showResponse={showResponse}
                    />

                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E35D6A]/10 rounded-full blur-2xl group-hover:bg-[#E35D6A]/20 transition-colors" />
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-6">
                        {/* 头像区域 */}
                        <div
                          className="relative"
                          onMouseEnter={() => isShiliu ? setShiliuHovered(true) : setPanpanHovered(true)}
                          onMouseLeave={() => isShiliu ? setShiliuHovered(false) : setPanpanHovered(false)}
                        >
                          <div
                            onClick={isShiliu ? handleShiliuClick : handlePanpanClick}
                            className={`relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer select-none transition-transform active:scale-95 ${
                              isShaking ? 'animate-shake' : ''
                            }`}
                          >
                            <img
                              src={pet.avatar}
                              alt={pet.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-white drop-shadow-md">
                            {pet.name}
                            <span className="text-sm text-white/90 font-normal ml-2 drop-shadow-sm">{pet.englishName}</span>
                          </h2>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="px-3 py-1 glass-card-highlight bg-white/20 rounded-full text-xs text-white drop-shadow-sm">{pet.species}</span>
                            <span className="text-xs text-white/90 drop-shadow-sm">{pet.role}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-white/90 drop-shadow-md mb-4">{pet.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {pet.traits.map((trait) => (
                          <span key={trait} className="px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-xs text-white border border-white/50 drop-shadow-sm">
                            ✦ {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
          <h3 className="text-xl font-medium text-white mb-6 flex items-center drop-shadow-md js-gravity-fragment">
            <HandDrawnPaw />
            <span className="ml-2">毛孩子的日常</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {petMoments.map((moment, index) => (
              <motion.div key={moment.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + index * 0.1 }} className="js-gravity-fragment">
                <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} scale={1.05} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1rem" style={{ borderRadius: '1rem' }}>
                  <div className="glass-card rounded-2xl p-4 text-center glass-card-hover bg-white/30">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl glass-card-highlight bg-white/20 flex items-center justify-center">
                      <HandDrawnPaw />
                    </div>
                    <h4 className="text-sm font-medium text-white mb-1 drop-shadow-md">{moment.title}</h4>
                    <p className="text-xs text-white/90 drop-shadow-sm">{moment.desc}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="js-gravity-fragment">
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.01} glareEnable={true} glareMaxOpacity={0.1} glareColor="#E35D6A" glarePosition="all" glareBorderRadius="1.5rem" style={{ borderRadius: '1.5rem' }}>
            <div className="glass-card rounded-3xl p-8 text-center bg-white/30">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <RedHeart />
                <span className="text-white text-sm font-medium drop-shadow-md">给盼盼和石榴的愿望</span>
                <RedHeart />
              </div>
              <p className="text-white text-lg mb-4 drop-shadow-md">给毛孩子们的承诺</p>
              <div className="space-y-2 text-white/90 drop-shadow-sm">
                <p>✦ 给盼盼找个伴，或者让它和石榴学会和平共处</p>
                <p>✦ 换一套带超大落地窗的房子，让阳光铺满你们睡觉的地方</p>
                <p>✦ 每天都有吃不完的罐头和零食</p>
              </div>

              {/* 暗号提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 pt-6 border-t border-white/20"
              >
                <p className="animate-pulse text-white/70 text-sm font-light tracking-wide drop-shadow-[0_0_8px_rgba(227,93,106,0.6)]">
                  ✨ 老婆你用键盘打出SZQLD试试
                </p>
              </motion.div>
            </div>
          </Tilt>
        </motion.div>
      </div>

      {/* 终极告白 - 电影级暗场 / 赛博浪漫 */}
      <AnimatePresence>
        {showLoveMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => {
              setIsEndingSequence(true);
              router.push('/');
            }}
          >
            {/* 暗场背景层 */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(40,10,10,0.5) 0%, rgba(0,0,0,0.98) 100%)',
              }}
            />

            {/* 失重微粒 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 18 }).map((_, i) => {
                const startX = Math.random() * 100;
                const startY = Math.random() * 100;
                const dur = 4 + Math.random() * 6;
                return (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: `${startX}vw`,
                      y: `${startY}vh`,
                      scale: 0.5,
                    }}
                    animate={{
                      opacity: [0, 0.6, 0.3, 0.8, 0],
                      x: [`${startX}vw`, `${startX + (Math.random() - 0.5) * 30}vw`],
                      y: [`${startY}vh`, `${startY - (10 + Math.random() * 40)}vh`],
                      scale: [0.5, 1, 0.8, 1.2, 0.6],
                    }}
                    transition={{
                      duration: dur,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute w-1 h-1 rounded-full bg-white/30"
                    style={{
                      boxShadow: '0 0 6px 1px rgba(255,255,255,0.2)',
                    }}
                  />
                );
              })}
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center flex flex-col items-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-6xl font-serif-display tracking-[0.12em] text-white"
                style={{
                  textShadow:
                    '0 0 40px rgba(255,255,255,0.25), 0 0 80px rgba(255,215,150,0.15), 0 0 120px rgba(255,255,255,0.08)',
                }}
              >
                苏子钦永远爱李丹
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="mt-10 flex items-center space-x-2 text-[10px] md:text-xs font-mono-micro tracking-widest text-white/40"
              >
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block"
                >
                  _
                </motion.span>
                <span>Love You Forever</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
  );
}
