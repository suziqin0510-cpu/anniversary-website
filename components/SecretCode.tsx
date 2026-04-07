'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function SecretCode() {
  const [keyQueue, setKeyQueue] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const SECRET_CODE = ['L', 'I', 'D', 'A', 'N'];
  const MESSAGE = `老婆，这个彩蛋怎么样？你还喜欢吗？转眼已经一年了，跟你说这段话的时候，正是，我忙着做网页，这几天没太多时间陪着你，我很抱歉，但这个网页做着做着，对我来说就像我的孩子一样，我在不断优化它，让它变得更好。我想让这个网页成为我们两个独一无二的见证，它会持续伴随我们丰富整个网页的内容，现在言归正传，这一年我们吵过很多架，有打过，有骂过，也差点彻底分开过，时间很快，但无论怎么变，我很确信，我真的真的很爱你，老婆我们这一年走过很多地方，发生过很多有趣的小故事，我们几乎把云南走遍了，周边省的省会也去了，吃了好多好吃的。家里有两个新成员，我希望等你大学毕业，能每天跟你在一起。我想陪着你，照顾你，想成为你的守卫，一直守着你一生。我知道你嘴巴硬，心里软的人，很多时候也挺心疼我，但你不说，你会偷偷的攒着，给我准备一些惊喜。但我作为一个男人我不知道该怎么向你表述你的这些好，我是怎样看在眼里的，所以我在想应该怎么做，怎么做更好，怎么才能不惹你生气，怎么才能照顾好你？我觉得这可能是我一生的课程，我需要好好学习怎么爱你，时间才是我最长情的告白。我希望我们俩永远在一起，无论发生什么不愉快的事情，只要最后是你就好。我真的很爱你老婆。`;

  // 键盘监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRevealed) return;

      const key = e.key.toUpperCase();

      // 只记录字母
      if (/^[A-Z]$/.test(key)) {
        setKeyQueue((prev) => {
          const newQueue = [...prev, key].slice(-5);

          // 检查是否匹配暗号
          if (newQueue.join('') === SECRET_CODE.join('')) {
            setIsRevealed(true);
          }

          return newQueue;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed]);

  // 打字机效果
  useEffect(() => {
    if (isRevealed && !isTyping) {
      setIsTyping(true);
      setDisplayedText('');

      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < MESSAGE.length) {
          setDisplayedText((prev) => prev + MESSAGE[index]);
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 40);

      return () => clearInterval(typeInterval);
    }
  }, [isRevealed, isTyping]);

  const handleClose = useCallback(() => {
    setIsRevealed(false);
    setDisplayedText('');
    setKeyQueue([]);
  }, []);

  return (
    <AnimatePresence>
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* 信封容器 */}
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10"
          >
            {/* 发光效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-amber-400 rounded-3xl blur-xl opacity-50 animate-pulse" />

            {/* 信封主体 */}
            <div className="relative bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl w-[90vw] sm:w-auto mx-4 border border-rose-200 max-h-[85vh] flex flex-col">
              {/* 关闭按钮 */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-rose-100 flex items-center justify-center text-[#7C444F] transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 信封图标 */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 180 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl sm:text-5xl text-center mb-4 shrink-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                💌
              </motion.div>

              {/* 标题 */}
              <h3 className="text-lg sm:text-xl font-handwriting text-[#7C444F] text-center mb-4 shrink-0">
                一封神秘的信
              </h3>

              {/* 打字机文字 */}
              <div
                className="bg-white/60 rounded-2xl p-4 sm:p-6 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-transparent"
                onClick={() => {
                  // 点击直接显示全部文字
                  if (isTyping) {
                    setDisplayedText(MESSAGE);
                    setIsTyping(false);
                  }
                }}
              >
                <p className="text-base sm:text-lg text-[#7C444F] leading-loose font-handwriting whitespace-pre-wrap">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="inline-block w-0.5 h-5 bg-[#E35D6A] ml-1 align-middle"
                    />
                  )}
                </p>
                {isTyping && (
                  <p className="text-xs text-[#9B6A6C]/70 mt-4 text-center">
                    点击任意处快速显示全部
                  </p>
                )}
              </div>

              {/* 底部装饰 */}
              <div className="flex justify-center mt-4 sm:mt-6 space-x-2 shrink-0">
                <span className="text-rose-400">♥</span>
                <span className="text-amber-400">♥</span>
                <span className="text-rose-400">♥</span>
              </div>

              <p className="text-xs text-[#9B6A6C] text-center mt-3 sm:mt-4 shrink-0">
                按下 ESC 或点击背景关闭
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
