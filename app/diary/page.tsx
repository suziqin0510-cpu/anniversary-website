'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Heart, Terminal, ChevronLeft } from 'lucide-react';

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
      alert('密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F13] pt-24 pb-12">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,165,116,0.08)_0%,_transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass-effect rounded-full mb-4">
            <Lock className="w-4 h-4 text-[#D4A574]" />
            <span className="text-xs text-[#8A8A92] font-mono">ENCRYPTED_DATA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            私密日记
          </h1>
          <p className="text-[#8A8A92]">
            只属于我们的加密空间
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
              <div className="glass-effect rounded-xl p-6 hover:border-[#D4A574]/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D4A574]/10 flex items-center justify-center">
                      {entry.isLocked && !unlockedEntries.has(entry.id) && !isUnlocked ? (
                        <Lock className="w-6 h-6 text-[#D4A574]" />
                      ) : (
                        <Unlock className="w-6 h-6 text-[#D4A574]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#E8E8EC] group-hover:text-[#D4A574] transition-colors">
                        {entry.isLocked && !unlockedEntries.has(entry.id) && !isUnlocked ? '🔒 加密密信' : entry.title}
                      </h3>
                      <p className="text-sm text-[#8A8A92]">{entry.date}</p>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-[#8A8A92] rotate-180 group-hover:text-[#D4A574] transition-colors" />
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
          className="text-center text-sm text-[#8A8A92]/60 mt-8"
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <Lock className="w-12 h-12 text-[#D4A574] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E8E8EC] mb-2">这是一封加密密信</h3>
              <p className="text-sm text-[#8A8A92] mb-6">请输入密码查看内容</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入8位数字密码"
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A1F] border border-[#D4A574]/30 text-[#E8E8EC] placeholder-[#8A8A92]/50 focus:border-[#D4A574] focus:outline-none mb-4 font-mono text-center"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => { setShowPasswordModal(false); setPassword(''); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#D4A574]/30 text-[#8A8A92] hover:bg-[#D4A574]/10 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleUnlock}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#D4A574] text-[#0F0F13] font-medium hover:bg-[#E8B584] transition-colors"
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-[#D4A574]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4A574]/10 flex items-center justify-center">
                      <Unlock className="w-5 h-5 text-[#D4A574]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#E8E8EC]">{selectedEntry.title}</h2>
                      <p className="text-sm text-[#8A8A92]">{selectedEntry.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 hover:bg-[#D4A574]/10 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#8A8A92]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <pre className="text-[#E8E8EC] whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {selectedEntry.content}
                </pre>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#D4A574]/20 bg-[#D4A574]/5">
                <div className="flex items-center justify-center space-x-2 text-[#D4A574]">
                  <Heart className="w-4 h-4 fill-[#D4A574]" />
                  <span className="text-sm font-mono">啾米啾米</span>
                  <span className="text-[#8A8A92]">→</span>
                  <span className="text-sm font-mono">米啾米啾</span>
                  <Heart className="w-4 h-4 fill-[#D4A574]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
