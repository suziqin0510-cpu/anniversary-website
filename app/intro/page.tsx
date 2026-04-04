'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Unlock, Terminal, ChevronRight, Sparkles } from 'lucide-react';

export default function IntroPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showContent, setShowContent] = useState(false);

  const password = '啾米啾米';
  const response = '米啾米啾';

  const welcomeMessage = `> 初始化系统...
> 建立安全连接...
> 验证用户身份...
> 欢迎来到苏子钦 & 李丹的赛博空间。`;

  // 打字机效果
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= welcomeMessage.length) {
        setTypingText(welcomeMessage.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setShowContent(true);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (input === password) {
      setIsUnlocked(true);
      setShowError(false);
      // 播放解锁音效（可选）
      setTimeout(() => {
        localStorage.setItem('authenticated', 'true');
        router.push('/');
      }, 2000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center px-4 relative overflow-hidden">
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 165, 116, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 165, 116, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* 发光球体装饰 */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4A574]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#E8843C]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* 终端窗口 */}
        <div className="glass-effect rounded-2xl overflow-hidden border-glow">
          {/* 终端标题栏 */}
          <div className="bg-[#1A1A1F] px-4 py-3 flex items-center space-x-2 border-b border-[#D4A574]/20">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-[#8A8A92] font-mono">suzi_lidan_terminal — 李丹专属通道</span>
            </div>
          </div>

          {/* 终端内容 */}
          <div className="p-8 space-y-6">
            {/* 终端输出 */}
            <div className="font-mono text-sm text-[#D4A574]/80 min-h-[120px]">
              <pre className="whitespace-pre-wrap">{typingText}</pre>
              {showContent && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block w-2 h-4 bg-[#D4A574] ml-1 animate-pulse"
                />
              )}
            </div>

            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* 密码提示 */}
                  <div className="flex items-center space-x-2 text-[#8A8A92] text-sm">
                    <Lock className="w-4 h-4" />
                    <span className="font-mono">请输入暗号以继续...</span>
                  </div>

                  {/* 输入框 */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A574] font-mono">$</div>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="输入暗号..."
                      className="w-full bg-[#0F0F13] border border-[#D4A574]/30 rounded-xl py-4 pl-10 pr-12 text-[#E8E8EC] placeholder-[#8A8A92]/50 focus:border-[#D4A574] focus:outline-none focus:ring-1 focus:ring-[#D4A574]/50 font-mono transition-all"
                      autoFocus
                    />
                    <button
                      onClick={handleSubmit}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#D4A574] hover:text-[#E8843C] transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 错误提示 */}
                  <AnimatePresence>
                    {showError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm font-mono flex items-center space-x-2"
                      >
                        <span>✗</span>
                        <span>暗号错误，请重试</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 提示 */}
                  <p className="text-xs text-[#8A8A92]/60 text-center font-mono">
                    💡 提示：这是只有你们两个人知道的暗号
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 mx-auto bg-[#D4A574]/20 rounded-full flex items-center justify-center border-glow"
                  >
                    <Unlock className="w-8 h-8 text-[#D4A574]" />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-[#D4A574] font-mono text-lg">{response}</p>
                    <p className="text-[#8A8A92] text-sm font-mono">身份验证通过</p>
                    <p className="text-[#E8E8EC] text-sm">正在进入我们的赛博空间...</p>
                  </div>
                  <div className="flex justify-center">
                    <Sparkles className="w-5 h-5 text-[#D4A574] animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-[#8A8A92]/40 text-xs font-mono">
            <Terminal className="w-3 h-3" />
            <span>SUZI & LIDAN CYBERSPACE v1.0.0</span>
            <span className="text-[#D4A574]/60">|</span>
            <span>EST. 2025.05.20</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
