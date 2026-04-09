'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '@/lib/music-context';

const FULL_TEXT = '这些代码写不出的，我想亲口说给你听';

interface EndingStageProps {
  onComplete: () => void;
}

export default function EndingStage({ onComplete }: EndingStageProps) {
  const [phase, setPhase] = useState<'shake' | 'spotlight' | 'typing' | 'waveform' | 'finale'>('shake');
  const [typedText, setTypedText] = useState('');
  const [showWaveform, setShowWaveform] = useState(false);
  const [isWaveformActive, setIsWaveformActive] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [showShaker, setShowShaker] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const sharedAudioCtxRef = useRef<AudioContext | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const music = useMusic();

  // Mount: brute-force cleanup (runs once)
  useEffect(() => {
    document.body.style.background = '#000000';
    document.body.style.overflow = 'hidden';

    // Kill BGM
    try {
      music.pause();
    } catch {}
    document.querySelectorAll('audio').forEach((audio) => {
      try {
        audio.pause();
        (audio as HTMLAudioElement).muted = true;
        audio.currentTime = 0;
      } catch {}
    });

    // Remove stray confetti canvases
    document.querySelectorAll('canvas').forEach((c) => {
      try {
        const style = window.getComputedStyle(c);
        if (style.position === 'fixed' && style.pointerEvents === 'none' && c !== canvasRef.current) {
          c.remove();
        }
      } catch {}
    });

    // Shake -> spotlight after 3s
    const t1 = setTimeout(() => {
      setShowShaker(false);
      setPhase('spotlight');
      console.log('[EndingStage] Spotlight ready');
    }, 3000);

    return () => {
      clearTimeout(t1);
      document.body.style.overflow = '';
    };
  }, []);

  // Spotlight complete -> restore background
  useEffect(() => {
    if (phase === 'finale') {
      document.body.style.background = '';
      const t = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  // User click to start - inside gesture to unlock all audio
  const handleStartSignal = async () => {
    if (phase !== 'spotlight' || hasStartedTyping) return;
    setHasStartedTyping(true);
    setPhase('typing');

    console.log('[EndingStage] User clicked start signal - unlocking audio');

    // Initialize shared AudioContext inside user gesture
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    sharedAudioCtxRef.current = audioCtx;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // Prepare voice audio graph inside same gesture
    const audio = new Audio('/sounds/final_voice_letter.m4a');
    voiceAudioRef.current = audio;
    audio.volume = 1;

    try {
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaElementSource(audio);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      console.log('[EndingStage] Voice audio unlocked');
    } catch (err) {
      console.warn('[EndingStage] Voice unlock attempt failed:', err);
    }

    // Typewriter sequence
    let index = 0;
    const timer = setInterval(() => {
      if (index < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, index + 1));
        try {
          const duration = 0.045;
          const sampleRate = audioCtx.sampleRate;
          const buffer = audioCtx.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const sourceNode = audioCtx.createBufferSource();
          sourceNode.buffer = buffer;
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 2800;
          filter.Q.value = 0.8;
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          sourceNode.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);
          sourceNode.start();
          sourceNode.stop(audioCtx.currentTime + duration + 0.02);
        } catch {}
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setShowWaveform(true);
          setPhase('waveform');
          console.log('[EndingStage] Auto-playing voice');
          startVoicePlayback();
        }, 400);
      }
    }, 150);
  };

  const startVoicePlayback = async () => {
    const audio = voiceAudioRef.current;
    if (!audio) {
      setPhase('finale');
      return;
    }
    try {
      setIsWaveformActive(true);
      await audio.play();
      audio.addEventListener('ended', () => {
        setIsWaveformActive(false);
        setPhase('finale');
      });
    } catch (err) {
      console.error('[EndingStage] Auto-play voice failed:', err);
      setTimeout(() => {
        setIsWaveformActive(false);
        setPhase('finale');
      }, 4000);
    }
  };

  // Canvas drawing loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);
    const cy = height / 2;

    if (isWaveformActive && analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      const barCount = 64;
      const barWidth = (width / barCount) * 0.6;
      const gap = (width / barCount) * 0.4;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] || 0;
        const percent = value / 255;
        const barHeight = Math.max(4, percent * height * 0.8);
        const x = i * (barWidth + gap) + gap / 2;
        const y = cy - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, 'rgba(227, 93, 106, 0.95)');
        gradient.addColorStop(1, 'rgba(244, 164, 96, 0.7)');

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(227, 93, 106, 0.9)';
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.shadowBlur = 0;
      }
    } else {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(227, 93, 106, 0.7)';
      ctx.lineWidth = 3 * dpr;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(227, 93, 106, 0.5)';
      for (let x = 0; x < width; x++) {
        const y = cy + Math.sin((x / width) * Math.PI * 4 + Date.now() / 500) * (height * 0.15);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [isWaveformActive]);

  useEffect(() => {
    if (phase === 'waveform' || phase === 'finale') {
      rafRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [phase, draw]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceAudioRef.current) {
        try {
          voiceAudioRef.current.pause();
          voiceAudioRef.current.currentTime = 0;
        } catch {}
      }
      try {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
        sharedAudioCtxRef.current?.close();
      } catch {}
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Solid black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Internal shaker overlay (replaces body.violent-shake) */}
      {showShaker && (
        <div className="absolute inset-0 violent-shake bg-black pointer-events-none z-[10002]" />
      )}

      {/* Spotlight */}
      {(phase === 'spotlight' || phase === 'typing' || phase === 'waveform') && (
        <div
          className="absolute inset-0 pointer-events-none z-[10001]"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.22) 0%, transparent 60%)',
          }}
        />
      )}

      {/* Finale diffusion */}
      {phase === 'finale' && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none z-[10001]"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 50%)',
          }}
        />
      )}

      {/* Emergency Exit */}
      <button
        onClick={onComplete}
        className="fixed top-4 right-4 z-[10003] px-2 py-1 rounded-md text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="退出"
      >
        ✕ 退出
      </button>

      {/* Center Stage - MUST be above everything */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-[10003]">
        {/* Glowing typewriter text */}
        {(phase === 'typing' || phase === 'waveform' || phase === 'finale') && (
          <p
            className="text-2xl md:text-3xl font-bold text-center tracking-wide"
            style={{
              color: '#FFFFFF',
              textShadow:
                '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8), 0 0 45px rgba(227,93,106,0.6)',
            }}
          >
            {typedText}
            {phase !== 'finale' && typedText.length > 0 && (
              <span className="inline-block w-1 h-8 md:h-10 bg-white ml-1 align-middle animate-pulse" />
            )}
          </p>
        )}

        {/* Start signal button */}
        <AnimatePresence>
          {phase === 'spotlight' && !hasStartedTyping && (
            <motion.button
              key="start-signal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              onClick={handleStartSignal}
              className="mt-10 px-8 py-3 rounded-full border border-white/30 bg-white/10 text-white text-sm md:text-base tracking-widest backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all animate-pulse"
              style={{
                boxShadow: '0 0 20px rgba(255,255,255,0.15)',
              }}
            >
              点击接收最后的信号
            </motion.button>
          )}
        </AnimatePresence>

        {/* Waveform */}
        <AnimatePresence>
          {phase === 'waveform' && showWaveform && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="mt-12 flex flex-col items-center"
            >
              <div className="relative w-72 h-32 md:w-96 md:h-40 rounded-2xl border border-[#E35D6A]/70 bg-black/20 backdrop-blur-sm overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
              </div>
              <p className="mt-4 text-sm text-white/80 tracking-wider">正在播放...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
