'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, AlertCircle, Search, ShieldAlert } from 'lucide-react';
import { useGame } from '@/lib/game-context';
import confetti from 'canvas-confetti';

interface DetectivePuzzleProps {
  onUnlock?: () => void;
}

// 嫌疑人数据
const SUSPECTS = [
  {
    id: 'shiliu',
    name: '石榴',
    avatar: '🐱',
    color: 'from-orange-400 to-amber-500',
    testimony: '喵喵！（翻译：如果我们中有人说真话，那绝对不是苏子钦。）',
    isGuilty: false,
    errorHint: '石榴可是受过教育的猫，它的话里藏着真话的陷阱哦，再想想。',
  },
  {
    id: 'suziqin',
    name: '苏子钦',
    avatar: '👨',
    color: 'from-blue-400 to-indigo-500',
    testimony: '偷吃火腿肠的人，就在我和李丹之间！',
    isGuilty: false,
    errorHint: '如果你选苏子钦，那他和盼盼的话就产生悖论了，逻辑不通！',
  },
  {
    id: 'panpan',
    name: '盼盼',
    avatar: '🐶',
    color: 'from-amber-600 to-yellow-700',
    testimony: '汪汪！（翻译：苏子钦在撒谎，凶手另有其人！）',
    isGuilty: true,
    errorHint: '', // 正确答案没有错误提示
  },
  {
    id: 'lidan',
    name: '李丹',
    avatar: '👩',
    color: 'from-rose-400 to-pink-500',
    testimony: '反正我没偷吃，盼盼也没偷吃。',
    isGuilty: false,
    errorHint: '如果你选李丹，那苏子钦和盼盼的话就产生悖论了，逻辑不通！',
  },
];

// 矛盾关系图（用于连线高亮）
const CONTRADICTIONS: Record<string, string[]> = {
  shiliu: ['suziqin'],
  suziqin: ['panpan', 'lidan'],
  panpan: ['suziqin'],
  lidan: ['suziqin'],
};

// 解锁成功弹窗
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#E35D6A', '#8B5CF6'],
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#E35D6A', '#8B5CF6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

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
            className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border-2 border-amber-400/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 戴手铐的盼盼插画 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-6xl shadow-lg">
                🐕
              </div>
              {/* 手铐装饰 */}
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl"
              >
                ⛓️
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-[#7C444F] mb-2">
                案件告破！
              </h3>
              <p className="text-[#9B6A6C] mb-4">
                真凶盼盼已被缉拿归案！
              </p>
              <p className="text-sm text-[#9B6A6C]/70 italic">
                "汪汪...（我认罪，火腿肠太好吃了）"
              </p>
            </motion.div>

            <motion.a
              href="/pets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-2 px-6 py-3 mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-lg"
            >
              <Unlock className="w-5 h-5" />
              <span>进入宠物专区</span>
              <Sparkles className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 惩罚锁定模块
const PenaltyLock = ({ onUnlock }: { onUnlock: () => void }) => {
  const [input, setInput] = useState('');
  const targetPhrase = '苏子钦是全家最聪明的人';

  useEffect(() => {
    if (input === targetPhrase) {
      onUnlock();
    }
  }, [input, onUnlock]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl"
    >
      <div className="flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </div>
      <h4 className="text-center text-red-600 font-bold mb-2">
        ⚠️ 办案权限已冻结 (盲猜警告)
      </h4>
      <p className="text-center text-red-500 text-sm mb-4">
        瞎猜是不对的哦！大侦探，如果脑子转不过来了，请在下方输入解锁密语恢复权限：
      </p>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入解锁密语..."
          className="w-full px-4 py-3 rounded-xl border-2 border-red-200 bg-white text-[#7C444F] placeholder-red-300 focus:border-red-400 focus:outline-none text-center"
        />
        <p className="text-center text-xs text-red-400 mt-2">
          提示：<span className="font-bold bg-red-100 px-2 py-0.5 rounded">{targetPhrase}</span>
        </p>
      </div>
    </motion.div>
  );
};

// 嫌疑人卡片组件
const SuspectCard = ({
  suspect,
  isSelected,
  isHighlighted,
  isDisabled,
  onClick,
}: {
  suspect: typeof SUSPECTS[0];
  isSelected: boolean;
  isHighlighted: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`relative p-4 rounded-2xl text-left transition-all ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed bg-slate-800/30'
          : isSelected
          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-2 ring-amber-400 cursor-pointer'
          : isHighlighted
          ? 'bg-red-500/20 ring-2 ring-red-400 cursor-pointer'
          : 'bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer'
      }`}
    >
      {/* 头像 */}
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${suspect.color} flex items-center justify-center text-3xl mb-3 mx-auto shadow-lg`}
      >
        {suspect.avatar}
      </div>

      {/* 名字 */}
      <h4 className={`text-center font-bold mb-2 ${isSelected ? 'text-amber-400' : 'text-white'}`}>
        {suspect.name}
      </h4>

      {/* 供词 */}
      <p className={`text-xs text-center leading-relaxed ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
        "{suspect.testimony}"
      </p>

      {/* 选中标记 */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
        >
          <Search className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
};

// 证据板连线组件
const EvidenceLines = ({ selectedId }: { selectedId: string | null }) => {
  if (!selectedId || !CONTRADICTIONS[selectedId]) return null;

  const contradictions = CONTRADICTIONS[selectedId];
  const selectedIndex = SUSPECTS.findIndex((s) => s.id === selectedId);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {contradictions.map((targetId) => {
        const targetIndex = SUSPECTS.findIndex((s) => s.id === targetId);
        if (targetIndex === -1) return null;

        // 计算连线位置（简化版，实际可能需要更复杂的计算）
        const isHorizontal = Math.abs(selectedIndex - targetIndex) === 1;

        return (
          <motion.div
            key={`${selectedId}-${targetId}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{
              // 这里简化处理，实际应该根据卡片位置动态计算
              top: '50%',
              left: `${Math.min(selectedIndex, targetIndex) * 25 + 12.5}%`,
              width: `${Math.abs(selectedIndex - targetIndex) * 25}%`,
            }}
          >
            <div className="h-0.5 bg-red-500/50 relative">
              {/* 问号标记 */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold"
              >
                ?
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function DetectivePuzzle({ onUnlock }: DetectivePuzzleProps) {
  const { isLevelUnlocked, unlockLevel, showToast } = useGame();
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const isAlreadyUnlocked = isLevelUnlocked(6);

  // 处理嫌疑人选择（逻辑假设）
  const handleSuspectClick = useCallback(
    (suspectId: string) => {
      if (isLocked || showPenalty) return;
      setSelectedSuspect(suspectId);
      setShowError(null);
    },
    [isLocked, showPenalty]
  );

  // 跟踪用户点击的按钮（用于显示点击后的反馈，初始状态所有按钮一致）
  const [clickedSuspectId, setClickedSuspectId] = useState<string | null>(null);

  // 处理逮捕
  const handleArrest = useCallback(
    (suspect: typeof SUSPECTS[0]) => {
      if (isLocked || showPenalty) return;

      // 记录用户点击的按钮
      setClickedSuspectId(suspect.id);

      if (suspect.isGuilty) {
        // 正确答案
        setShowSuccess(true);
        unlockLevel(6);
        showToast('🎉 案件告破！宠物专区已开启', 'success');
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E35D6A', '#F4A460', '#FFD700', '#8B5CF6'],
        });
        onUnlock?.();
      } else {
        // 错误答案 - 触发惩罚
        setShowError(suspect.errorHint);
        setIsLocked(true);
        setShowPenalty(true);
      }
    },
    [isLocked, showPenalty, unlockLevel, showToast, onUnlock]
  );

  // 解除惩罚
  const handlePenaltyUnlock = useCallback(() => {
    setIsLocked(false);
    setShowPenalty(false);
    setShowError(null);
    showToast('✅ 权限已恢复，这次要好好推理哦~', 'success');
  }, [showToast]);

  // 如果已解锁，显示高亮入口
  if (isAlreadyUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 mb-8"
      >
        <motion.a
          href="/pets"
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
            className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-300/50 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#E35D6A]/10 to-transparent rounded-full blur-xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                >
                  <Unlock className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-[#7C444F]">
                    🐾 宠物专区已开启
                  </h3>
                  <p className="text-[#9B6A6C] text-sm mt-1">
                    点击进入盼盼和石榴的小窝
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
        <div className="max-w-4xl mx-auto">
          {/* 标题面板 */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-black rounded-3xl p-8 border border-slate-700 shadow-2xl overflow-hidden relative">
            {/* 背景光效 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-2xl" />

            {/* 标题 */}
            <div className="relative text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Search className="w-6 h-6 text-amber-400" />
                <h3 className="text-2xl font-bold text-white">
                  家庭悬疑档案：火腿肠失踪案
                </h3>
              </div>
              <p className="text-slate-400 text-sm">
                一根火腿肠神秘失踪，四名嫌疑人，只有一人说真话
              </p>
              <p className="text-slate-500 text-xs mt-2">
                线索：仔细分析每句话的逻辑关系，找出那个说真话的人
              </p>
            </div>

            {/* 嫌疑人网格 */}
            <div className="relative">
              <EvidenceLines selectedId={selectedSuspect} />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {SUSPECTS.map((suspect) => (
                  <SuspectCard
                    key={suspect.id}
                    suspect={suspect}
                    isSelected={selectedSuspect === suspect.id}
                    isHighlighted={Boolean(
                      selectedSuspect &&
                      CONTRADICTIONS[selectedSuspect]?.includes(suspect.id)
                    )}
                    isDisabled={isLocked}
                    onClick={() => handleSuspectClick(suspect.id)}
                  />
                ))}
              </div>
            </div>

            {/* 逮捕按钮区域 */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUSPECTS.map((suspect) => {
                // 确定按钮的显示状态
                const isClicked = clickedSuspectId === suspect.id;
                const showCorrectFeedback = isClicked && suspect.isGuilty;
                const showWrongFeedback = isClicked && !suspect.isGuilty;

                return (
                  <motion.button
                    key={`arrest-${suspect.id}`}
                    onClick={() => handleArrest(suspect)}
                    disabled={isLocked}
                    whileHover={!isLocked ? { scale: 1.05 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                      isLocked
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                        : showCorrectFeedback
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : showWrongFeedback
                        ? 'bg-red-500 text-white shadow-lg animate-shake'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300'
                    }`}
                  >
                    {isLocked ? '🔒 已锁定' : `🔍 逮捕${suspect.name}`}
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
                  className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center space-x-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-sm text-center">{showError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 惩罚锁定模块 */}
            <AnimatePresence>
              {showPenalty && (
                <PenaltyLock onUnlock={handlePenaltyUnlock} />
              )}
            </AnimatePresence>

            {/* 提示信息 */}
            {!showPenalty && !showError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center text-slate-500 text-xs"
              >
                💡 点击嫌疑人查看供词，找出逻辑矛盾，然后点击"逮捕"按钮提交答案
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* 成功弹窗 */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
