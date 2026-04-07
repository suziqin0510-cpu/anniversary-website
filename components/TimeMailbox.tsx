'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Unlock, Send, X, CheckCircle, Sparkles } from 'lucide-react';
import { useGame } from '@/lib/game-context';
import confetti from 'canvas-confetti';

interface TimeMailboxProps {
  onUnlock?: () => void;
}

// 信件模态框
const LetterModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}) => {
  const [content, setContent] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = content.trim();

    if (trimmed.length === 0) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    setIsSubmitting(true);

    // 播放信封动画
    setTimeout(() => {
      setShowSuccess(true);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E35D6A', '#F4A460', '#FFD700', '#10B981'],
      });

      setTimeout(() => {
        onSubmit(trimmed);
        setIsSubmitting(false);
        setShowSuccess(false);
        setContent('');
      }, 1500);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#7C444F]/10 hover:bg-[#7C444F]/20 flex items-center justify-center text-[#7C444F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 信纸主体 */}
            <div className="relative bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden">
              {/* 纸张纹理 */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* 顶部装饰线 */}
              <div className="h-2 bg-gradient-to-r from-[#E35D6A]/30 via-[#F4A460]/30 to-[#E35D6A]/30" />

              <div className="p-8 md:p-12">
                {/* 引导语 */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <h3 className="text-xl md:text-2xl font-serif text-[#7C444F] leading-relaxed">
                    老婆，回顾这一年，你对我们以后有什么规划？对我有什么想吐槽或表白的？
                  </h3>
                  <p className="text-[#9B6A6C] mt-2 text-sm">
                    把你想说的话，都写在这里吧：
                  </p>
                </motion.div>

                {/* 成功动画覆盖层 */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#FDFBF7] z-10 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="text-center"
                      >
                        <motion.div
                          animate={{
                            boxShadow: [
                              '0 0 0 0 rgba(16, 185, 129, 0.4)',
                              '0 0 0 20px rgba(16, 185, 129, 0)',
                            ]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center"
                        >
                          <CheckCircle className="w-12 h-12 text-white" />
                        </motion.div>
                        <p className="text-xl font-medium text-[#7C444F]">信件已封缄</p>
                        <p className="text-sm text-[#9B6A6C] mt-2">正在投递到时空信箱...</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 输入区 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`relative ${isError ? 'animate-shake' : ''}`}
                >
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="在这里写下你的真心话..."
                    className="w-full h-64 md:h-80 p-6 bg-transparent resize-none focus:outline-none text-[#7C444F] text-lg leading-relaxed font-serif placeholder:text-[#9B6A6C]/40"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(227, 93, 106, 0.1) 31px, rgba(227, 93, 106, 0.1) 32px)',
                      lineHeight: '32px',
                    }}
                  />

                  {/* 左下角装饰 */}
                  <div className="absolute bottom-4 left-4 pointer-events-none">
                    <Sparkles className="w-5 h-5 text-[#E35D6A]/20" />
                  </div>
                </motion.div>

                {/* 错误提示 */}
                <AnimatePresence>
                  {isError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-[#E35D6A] text-sm mt-2"
                    >
                      哪怕写一句我爱你也可以哦~
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* 提交按钮 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex justify-center"
                >
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                  >
                    <span className="flex items-center space-x-2">
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>封缄真心，开启未来</span>
                      <span className="group-hover:translate-x-1 transition-transform">➔</span>
                    </span>
                  </motion.button>
                </motion.div>
              </div>

              {/* 底部装饰 */}
              <div className="h-2 bg-gradient-to-r from-[#E35D6A]/30 via-[#F4A460]/30 to-[#E35D6A]/30" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function TimeMailbox({ onUnlock }: TimeMailboxProps) {
  const { isLevelUnlocked, unlockLevel, showToast } = useGame();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [letterContent, setLetterContent] = useState<string | null>(null);
  const isAlreadyUnlocked = isLevelUnlocked(4);

  // 加载已保存的信件
  useEffect(() => {
    const saved = localStorage.getItem('anniversary-user-letter');
    if (saved) {
      setLetterContent(saved);
    }
  }, []);

  const handleSubmit = useCallback((content: string) => {
    // 保存信件到 localStorage
    localStorage.setItem('anniversary-user-letter', content);
    setLetterContent(content);

    // 解锁关卡4
    unlockLevel(4);
    showToast('💌 信件已投递！愿望清单已开启', 'success');

    // 关闭模态框
    setIsModalOpen(false);

    // 触发父组件回调
    onUnlock?.();

    // 平滑滚动到底部
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 500);
  }, [unlockLevel, showToast, onUnlock]);

  // 如果已解锁，显示发光入口
  if (isAlreadyUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 mb-8"
      >
        <motion.a
          href="/future"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block max-w-xl mx-auto"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(227, 93, 106, 0.3)',
                '0 0 40px rgba(227, 93, 106, 0.5)',
                '0 0 20px rgba(227, 93, 106, 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 border-2 border-[#E35D6A]/30 shadow-xl overflow-hidden"
          >
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E35D6A]/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#F4A460]/10 to-transparent rounded-full blur-xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
                >
                  <Unlock className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-[#7C444F]">
                    🚪 愿望清单大门已开启
                  </h3>
                  <p className="text-[#9B6A6C] text-sm mt-1">
                    点击进入我们的未来
                  </p>
                </div>
              </div>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl text-[#E35D6A]"
              >
                →
              </motion.span>
            </div>

            {letterContent && (
              <div className="mt-4 pt-4 border-t border-[#E35D6A]/10">
                <p className="text-xs text-[#9B6A6C]/70 italic">
                  你已写下 {letterContent.length} 字的真心话
                </p>
              </div>
            )}
          </motion.div>
        </motion.a>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 mb-8"
      >
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full max-w-xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl overflow-hidden group">
            {/* 背景纹理 */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* 光晕效果 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#E35D6A]/10 via-transparent to-[#F4A460]/10 opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="relative flex items-center space-x-6">
              {/* 锁图标 */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center"
              >
                <Mail className="w-10 h-10 text-amber-400" />
                <Lock className="w-5 h-5 text-amber-400 absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5" />
              </motion.div>

              {/* 文字 */}
              <div className="text-left">
                <h3 className="text-xl font-bold text-amber-100">
                  💌 寄给未来的我们
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  过去的勋章已全部点亮，要想开启未来的愿望清单，<br />
                  请写下这一刻的真心。
                </p>
              </div>

              {/* 箭头提示 */}
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-amber-400/50 text-2xl"
              >
                →
              </motion.span>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* 写信模态框 */}
      <LetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
