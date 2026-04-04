'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Mail, Heart, Lock, Unlock } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#E35D6A"
      stroke="#E35D6A"
      strokeWidth="1.5"
    />
  </svg>
);

interface Letter {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  content: string;
  isLocked: boolean;
  password?: string;
  type: 'open' | 'encrypted';
}

const letters: Letter[] = [
  {
    id: 'open',
    title: '想对你说的话',
    subtitle: '一封来自苏子钦的信',
    date: '2025.05.20',
    content: `李丹，

谢谢你出现在我的生命里。

记得第一次在昆明见到你的时候，你带着一点点小情绪站在我面前。那一刻我就知道，这个女孩值得我用一生去守护。

这一年，我们一起走过了那么多地方。从大理的风到丽江的酒，从腾冲的盼盼到北海的石榴，每一个地方都有我们的回忆。

我知道有时候我会惹你生气，有时候我会因为工作忙而忽略你的感受。但请相信，在我心里，你永远是最重要的那个人。

未来的路还很长，我想和你一起走下去。不管是亚庇的落日，还是世界各地的风景，我都想牵着你的手一起看。

你可以永远不用长大，我会一直在这里，陪你作，陪你笑。

啾米啾米。`,
    isLocked: false,
    type: 'open',
  },
  {
    id: 'inner',
    title: '苏子钦的内心独白',
    subtitle: '只有你能看到的秘密',
    date: '永远',
    content: `李丹，其实我有过压力。

在你眼里我似乎什么都能搞定，但其实我也有焦虑回款、深夜死磕 AI 的时候。但我从没想过让你跟着操心。

我知道你爱说气话，爱试探我，那是因为你太在乎。

我大你 8 岁，这 8 年的阅历不是为了让我对你讲道理，而是为了让我有足够的肩膀，在这个充满变数的世界里，为你撑起一个永远恒温的小窝。

你可以永远不用长大，我会一直在这里，陪你作，陪你笑。

—— 苏子钦`,
    isLocked: true,
    password: '20260520',
    type: 'encrypted',
  },
  {
    id: '520',
    title: '520 终极密信',
    subtitle: '专属于我们的密码',
    date: '2026.05.20',
    content: `老婆，

我知道你爱说狠话，爱试探我。

但我理解，那是因为你太在乎。

我不要求你立刻长大，你可以永远是那个在沙发上刷抖音的 07 年小懒猫，

外面的风雨和家里的家务，交给 99 年的老男人就好。

我爱你，不仅在 520，在每一天。

啾米啾米。`,
    isLocked: true,
    password: '20250520',
    type: 'encrypted',
  },
];

export default function DiaryPage() {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [password, setPassword] = useState('');
  const [unlockedLetters, setUnlockedLetters] = useState<Set<string>>(new Set());
  const [passwordError, setPasswordError] = useState(false);

  const handleViewClick = (letter: Letter) => {
    if (letter.isLocked && !unlockedLetters.has(letter.id)) {
      setSelectedLetter(letter);
      setShowPasswordModal(true);
      setShowContent(false);
      setPassword('');
      setPasswordError(false);
    } else {
      setSelectedLetter(letter);
      setShowContent(true);
    }
  };

  const handleUnlock = () => {
    if (selectedLetter && password === selectedLetter.password) {
      setUnlockedLetters(new Set([...unlockedLetters, selectedLetter.id]));
      setPasswordError(false);
      setShowPasswordModal(false);
      setShowContent(true);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-card mb-6"
          >
            <Mail className="w-10 h-10 text-[#E35D6A]" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#7C444F] mb-2 font-handwriting">
            私密日记
          </h1>
          <p className="text-[#9B6A6C]">专属我们的秘密空间</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {letters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1.02}
                transitionSpeed={400}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor="#E35D6A"
                glarePosition="all"
                glareBorderRadius="1.5rem"
                style={{ borderRadius: '1.5rem' }}
              >
                <div
                  onClick={() => handleViewClick(letter)}
                  className="glass-card rounded-3xl p-6 cursor-pointer group h-full flex flex-col glass-card-hover"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    letter.type === 'open'
                      ? 'bg-[#E35D6A]/20'
                      : letter.isLocked && !unlockedLetters.has(letter.id)
                        ? 'bg-[#9B6A6C]/20'
                        : 'bg-[#E35D6A]/20'
                  }`}>
                    {letter.type === 'open' ? (
                      <BookOpen className="w-7 h-7 text-[#E35D6A]" />
                    ) : letter.isLocked && !unlockedLetters.has(letter.id) ? (
                      <Lock className="w-7 h-7 text-[#9B6A6C]" />
                    ) : (
                      <Unlock className="w-7 h-7 text-[#E35D6A]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#7C444F] mb-1 group-hover:text-[#E35D6A] transition-colors">
                      {letter.title}
                    </h3>
                    <p className="text-sm text-[#9B6A6C] mb-2">{letter.subtitle}</p>
                    <p className="text-xs text-[#9B6A6C]/60">{letter.date}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/30">
                    <button className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${
                      letter.type === 'open'
                        ? 'bg-[#E35D6A]/20 text-[#E35D6A] hover:bg-[#E35D6A]/30'
                        : letter.isLocked && !unlockedLetters.has(letter.id)
                          ? 'bg-[#9B6A6C]/20 text-[#9B6A6C]'
                          : 'bg-[#E35D6A]/20 text-[#E35D6A] hover:bg-[#E35D6A]/30'
                    }`}>
                      {letter.type === 'open'
                        ? '阅读信件'
                        : letter.isLocked && !unlockedLetters.has(letter.id)
                          ? '🔒 需要密码'
                          : '阅读信件'
                      }
                    </button>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-[#9B6A6C]/60 mt-8"
        >
          💡 加密信件需要输入专属密码才能解锁
        </motion.p>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-3xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 rounded-full glass-card-highlight flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#E35D6A]" />
              </div>
              <h3 className="text-xl font-bold text-[#7C444F] mb-2">这是一封加密信件</h3>
              <p className="text-sm text-[#9B6A6C] mb-6">请输入密码解锁</p>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="输入密码"
                className="w-full px-4 py-3 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 text-[#7C444F] placeholder-[#9B6A6C]/50 focus:border-[#E35D6A] focus:outline-none mb-2 text-center"
              />
              {passwordError && (
                <p className="text-red-400 text-sm mb-4">密码错误，请重试</p>
              )}
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => { setShowPasswordModal(false); setPassword(''); setPasswordError(false); }}
                  className="flex-1 px-4 py-3 rounded-2xl border border-white/50 text-[#9B6A6C] hover:bg-white/30 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleUnlock}
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#E35D6A] text-white font-medium hover:bg-[#F4A460] transition-colors"
                >
                  解锁
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedLetter && showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setSelectedLetter(null); setShowContent(false); }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: -30 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateX: 0,
                transition: { type: 'spring', stiffness: 100, damping: 20 }
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-2 bg-gradient-to-r from-[#F8AD9D] via-[#FFB5A7] to-[#F8AD9D]" />

              <div className="p-6 border-b border-white/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl glass-card-highlight flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#E35D6A]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#7C444F]">{selectedLetter.title}</h2>
                    <p className="text-sm text-[#9B6A6C]">{selectedLetter.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedLetter(null); setShowContent(false); }}
                  className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#9B6A6C]" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[60vh] relative">
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#7C444F] whitespace-pre-wrap text-base leading-loose font-sans"
                >
                  {selectedLetter.content}
                </motion.pre>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 text-right"
                >
                  <p className="text-[#E35D6A] font-handwriting text-xl">—— 苏子钦</p>
                </motion.div>
              </div>

              <div className="p-6 border-t border-white/30 bg-white/20">
                <div className="flex items-center justify-center space-x-2 text-[#E35D6A]">
                  <HandDrawnHeart />
                  <span className="text-sm">啾米啾米</span>
                  <Heart className="w-4 h-4 fill-[#F8AD9D] text-[#E35D6A]" />
                  <span className="text-sm">米啾米啾</span>
                  <HandDrawnHeart />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
