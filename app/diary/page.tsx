'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

// 手绘风格锁
const HandDrawnLock = ({ locked }: { locked: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    {locked ? (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5" />
        <path d="M8 11V7a4 4 0 118 0v4" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" fill="#F8AD9D" fillOpacity="0.3" stroke="#F8AD9D" strokeWidth="1.5" />
        <path d="M8 11V7a4 4 0 118 0v4" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <path d="M12 16l2 2M12 16l-2 2" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);

// 手绘风格心形
const HandDrawnHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-heartbeat">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#F8AD9D"
      stroke="#F8AD9D"
      strokeWidth="1.5"
    />
  </svg>
);

// 手绘风格信封
const HandDrawnEnvelope = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#F8AD9D" fillOpacity="0.2" stroke="#F8AD9D" strokeWidth="1.5" />
    <path d="M2 8l10 6 10-6" stroke="#F8AD9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const diaryEntries = [
  {
    id: '520',
    date: '2026.05.20',
    title: '520 密信',
    isLocked: true,
    content: `老婆，

我知道你爱说狠话，爱试探我。

但我理解，那是因为你太在乎。

我不要求你立刻长大，你可以永远是那个在沙发上刷抖音的 07 年小懒猫，

外面的风雨和家里的家务，交给 99 年的老男人就好。

我爱你，不仅在 520，在每一天。

啾米啾米。`,
  },
];

export default function DiaryPage() {
  const [selectedEntry, setSelectedEntry] = useState<typeof diaryEntries[0] | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [unlockedEntries, setUnlockedEntries] = useState<Set<string>>(new Set());
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleEntryClick = (entry: typeof diaryEntries[0]) => {
    if (entry.isLocked && !unlockedEntries.has(entry.id) && !isUnlocked) {
      setSelectedEntry(entry);
      setShowPasswordModal(true);
    } else {
      setSelectedEntry(entry);
    }
  };

  const handleUnlock = () => {
    if (password === '5201314') {
      setUnlockedEntries(new Set([...unlockedEntries, '520']));
      setIsUnlocked(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('密码不对哦，再想想~');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E6] via-[#FFFBF0] to-[#FFF8E7] pt-24 pb-12">
      {/* 装饰背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#F8AD9D]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FBC3B6]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <HandDrawnEnvelope />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#5D4037] mb-2 font-handwriting">
            私密日记
          </h1>
          <p className="text-[#8D6E63]">
            只属于我们的秘密空间
          </p>
        </motion.div>

        {/* 日记列表 */}
        <div className="space-y-4">
          {diaryEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleEntryClick(entry)}
              className="cursor-pointer"
            >
              <div className="warm-card rounded-3xl p-6 warm-card-hover group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8AD9D]/20 flex items-center justify-center">
                      {entry.isLocked && !unlockedEntries.has(entry.id) && !isUnlocked ? (
                        <HandDrawnLock locked={true} />
                      ) : (
                        <HandDrawnLock locked={false} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#5D4037] group-hover:text-[#F8AD9D] transition-colors">
                        {entry.isLocked && !unlockedEntries.has(entry.id) && !isUnlocked ? '🔒 加密密信' : entry.title}
                      </h3>
                      <p className="text-sm text-[#8D6E63]">{entry.date}</p>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-[#8D6E63] rotate-180 group-hover:text-[#F8AD9D] transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-[#8D6E63]/60 mt-8"
        >
          💡 提示：密信密码是你们在一起的日期（年月日8位数字）
        </motion.p>
      </div>

      {/* 密码弹窗 */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#5D4037]/30 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="warm-card rounded-3xl p-8 max-w-sm w-full text-center"
            >
              <HandDrawnLock locked={true} />
              <h3 className="text-xl font-bold text-[#5D4037] mb-2 mt-4">这是一封加密密信</h3>
              <p className="text-sm text-[#8D6E63] mb-6">请输入密码查看内容</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入8位数字密码"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFBF0] border border-[#F8AD9D]/30 text-[#5D4037] placeholder-[#8D6E63]/50 focus:border-[#F8AD9D] focus:outline-none focus:ring-2 focus:ring-[#F8AD9D]/20 mb-4 text-center"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => { setShowPasswordModal(false); setPassword(''); }}
                  className="flex-1 px-4 py-3 rounded-2xl border border-[#F8AD9D]/30 text-[#8D6E63] hover:bg-[#F8AD9D]/10 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleUnlock}
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#F8AD9D] text-white font-medium hover:bg-[#FBC3B6] transition-colors"
                >
                  解锁
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 内容弹窗 */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#5D4037]/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="warm-card rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-[#F8AD9D]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F8AD9D]/20 flex items-center justify-center">
                      <HandDrawnLock locked={false} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#5D4037]">{selectedEntry.title}</h2>
                      <p className="text-sm text-[#8D6E63]">{selectedEntry.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 hover:bg-[#F8AD9D]/10 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#8D6E63]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <pre className="text-[#5D4037] whitespace-pre-wrap text-base leading-relaxed">
                  {selectedEntry.content}
                </pre>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#F8AD9D]/20 bg-[#F8AD9D]/5">
                <div className="flex items-center justify-center space-x-2 text-[#F8AD9D]">
                  <HandDrawnHeart />
                  <span className="text-sm">啾米啾米</span>
                  <span className="text-[#8D6E63]">→</span>
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
