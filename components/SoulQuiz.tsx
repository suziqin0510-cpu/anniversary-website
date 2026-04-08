'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useGame } from '@/lib/game-context';
import confetti from 'canvas-confetti';

interface SoulQuizProps {
  onUnlock?: () => void;
}

// 5道灵魂拷问题目
const QUESTIONS = [
  {
    id: 1,
    question: '说出我的一个缺点。',
    options: ['A. 帅气', 'B. 丑陋', 'C. 土气', 'D. 猥琐'],
    correctAnswer: 'A',
    errorHint: '不许睁眼说瞎话！',
  },
  {
    id: 2,
    question: '我们会在一起多久？',
    options: ['A. 1年', 'B. 10年', 'C. 一辈子', 'D. 无数个辈子'],
    correctAnswer: 'D',
    errorHint: '格局太小了，再想想！',
  },
  {
    id: 3,
    question: '你觉得这里面哪个人最像我？',
    options: ['A. 黄渤', 'B. 王迅', 'C. 吴彦祖', 'D. 孙红雷'],
    correctAnswer: 'C',
    errorHint: '虽然他们都是实力派，但我的颜值只属于吴彦祖。',
  },
  {
    id: 4,
    question: '下列选项哪个是你可以做的事？',
    options: ['A. 和其他男生约会', 'B. 和苏子钦永远在一起', 'C. 和别人生孩子', 'D. 对我拳打脚踢'],
    correctAnswer: 'B',
    errorHint: '这题都选错？看来需要家法伺候了！',
  },
  {
    id: 5,
    question: '你会选择和谁共度一生？',
    options: ['A. 苏子钦', 'B. 苏字钦', 'C. 苏子青', 'D. 李子钦'],
    correctAnswer: 'A',
    errorHint: '连老公名字都选错，打屁股！重选！',
    isNameTrick: true, // 特殊逻辑题标记
  },
];

// 恭喜弹窗
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 撒花动画 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#E35D6A] to-[#F4A460] flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-white drop-shadow-md mb-3">
              恭喜你聪明无双！
            </h3>

            <p className="text-white/90 drop-shadow-md mb-6">
              答对了全部问题！成功开启通向【私密日记】的通道 ✨
            </p>

            <motion.a
              href="/diary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#E35D6A] to-[#F4A460] text-white rounded-full font-medium shadow-lg"
            >
              <Unlock className="w-5 h-5" />
              <span>进入私密日记</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function SoulQuiz({ onUnlock }: SoulQuizProps) {
  const { isLevelUnlocked, unlockLevel, showToast } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showError, setShowError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const isAlreadyUnlocked = isLevelUnlocked(5);

  const handleAnswer = useCallback(
    (answer: string) => {
      const question = QUESTIONS[currentQuestion];

      if (answer === question.correctAnswer) {
        // 答案正确
        if (currentQuestion < QUESTIONS.length - 1) {
          // 进入下一题
          setCurrentQuestion((prev) => prev + 1);
        } else {
          // 全部答对，解锁关卡5
          setShowSuccess(true);
          unlockLevel(5);
          showToast('🎉 灵魂拷问通过！私密日记已开启', 'success');
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E35D6A', '#F4A460', '#FFD700', '#8B5CF6'],
          });
          onUnlock?.();
        }
      } else {
        // 答案错误
        setIsShaking(true);
        setShowError(question.errorHint);

        // Q5特殊逻辑：如果选错名字（B/C/D），显示红色警告
        if (question.isNameTrick && ['B', 'C', 'D'].includes(answer)) {
          setShowError('连老公名字都选错，打屁股！重选！');
        }

        setTimeout(() => {
          setIsShaking(false);
          setShowError(null);
        }, 2000);
      }
    },
    [currentQuestion, unlockLevel, showToast, onUnlock]
  );

  const question = QUESTIONS[currentQuestion];

  // 如果已解锁，显示高亮入口
  if (isAlreadyUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 mb-8"
      >
        <motion.a
          href="/diary"
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
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#E35D6A]/10 to-transparent rounded-full blur-xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-[#E35D6A] flex items-center justify-center shadow-lg"
                >
                  <Unlock className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    📓 私密日记已开启
                  </h3>
                  <p className="text-white/90 drop-shadow-md text-sm mt-1">
                    点击进入我们的私密空间
                  </p>
                </div>
              </div>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl text-white drop-shadow-md"
              >
                →
              </motion.span>
            </div>
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
        <motion.div
          animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          {/* 标题面板 */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-3xl p-8 border border-slate-700 shadow-2xl overflow-hidden relative">
            {/* 背景光效 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#E35D6A]/10 rounded-full blur-2xl" />

            {/* 标题 */}
            <div className="relative text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Lock className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">
                  开启私密日记的最终考核
                </h3>
              </div>
              <p className="text-slate-400 text-sm">
                回答5道灵魂拷问，证明你有多了解我
              </p>

              {/* 进度指示 */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                {QUESTIONS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      index < currentQuestion
                        ? 'bg-green-500 text-white'
                        : index === currentQuestion
                        ? 'bg-[#E35D6A] text-white'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {index < currentQuestion ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 题目区域 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* 问题 */}
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs mb-3">
                    第 {currentQuestion + 1} 题 / 共 {QUESTIONS.length} 题
                  </span>
                  <h4 className="text-xl text-white font-medium">
                    {question.question}
                  </h4>
                </div>

                {/* 选项 */}
                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((option, index) => {
                    const letter = option.charAt(0);
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(letter)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-purple-400/50 rounded-xl text-left transition-all group"
                      >
                        <span className="text-purple-400 font-bold mr-2 group-hover:text-purple-300">
                          {letter}.
                        </span>
                        <span className="text-slate-300 group-hover:text-white">
                          {option.slice(3)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* 错误提示 */}
                <AnimatePresence>
                  {showError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center space-x-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300 text-sm">{showError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* 成功弹窗 */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
