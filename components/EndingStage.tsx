'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '@/lib/music-context';

const FULL_TEXT = '这些代码写不出的，我想亲口说给你听';

interface EndingStageProps {
  onComplete: () => void;
}

function playSyntheticTypewriter() {
  if (typeof window === 'undefined') return;
  // Fire-and-forget: run in next microtask so any audio failure never blocks caller
  Promise.resolve().then(() => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const duration = 0.045;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2800;
      filter.Q.value = 0.8;
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      source.stop(now + duration + 0.02);
      setTimeout(() => {
        try {
          ctx.close();
        } catch {}
      }, 120);
    } catch {
      // silently ignore audio synthesis failures
    }
  });
}

export default function EndingStage({ onComplete }: EndingStageProps) {
  const [phase, setPhase] = useState<'shake' | 'spotlight' | 'waveform' | 'finale'>('shake');
  const [typedText, setTypedText] = useState('');
  const [showWaveform, setShowWaveform] = useState(false);
  const [isWaveformActive, setIsWaveformActive] = useState(false);
  const [hasClickedWaveform, setHasClickedWaveform] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const music = useMusic();

  // Phase 1: Screen shake -> spotlight after 3s
  useEffect(() => {
    console.log('[EndingStage] Ending sequence started');
    document.body.classList.add('violent-shake');
    document.body.style.background = '#000000';

    const t1 = setTimeout(() => {
      document.body.classList.remove('violent-shake');
      const body = document.body;
      if (body) {
        body.style.transform = 'none';
        void body.offsetHeight;
        body.style.transform = '';
      }
      setPhase('spotlight');
      console.log('[EndingStage] Spotlight started');
    }, 3000);

    return () => {
      clearTimeout(t1);
      document.body.classList.remove('violent-shake');
    };
  }, []);

  // Phase 2: Typewriter
  useEffect(() => {
    if (phase !== 'spotlight') return;
    let index = 0;
    const timer = setInterval(() => {
      if (index < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, index + 1));
        playSyntheticTypewriter();
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setPhase('waveform');
          setShowWaveform(true);
          console.log('[EndingStage] Ready for audio');
        }, 600);
      }
    }, 150);
    return () => clearInterval(timer);
  }, [phase]);

  // Canvas waveform drawing loop
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
      // Idle sine wave
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

  const handleWaveformClick = async () => {
    if (hasClickedWaveform || phase !== 'waveform') return;
    setHasClickedWaveform(true);
    setIsWaveformActive(true);
    music.pause();

    const audio = new Audio('/sounds/final_voice_letter.m4a');
    voiceAudioRef.current = audio;
    audio.volume = 1;

    // Graceful fallback if the file is missing
    audio.addEventListener('error', () => {
      console.error('[EndingStage] /sounds/final_voice_letter.m4a 加载失败，请确认文件已上传！');
      setTimeout(() => {
        setIsWaveformActive(false);
        setPhase('finale');
      }, 3000);
    });

    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaElementSource(audio);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      await audio.play();

      audio.addEventListener('ended', () => {
        setIsWaveformActive(false);
        setPhase('finale');
      });
    } catch (err) {
      console.error('[EndingStage] Voice letter playback failed:', err);
      setTimeout(() => {
        setIsWaveformActive(false);
        setPhase('finale');
      }, 3000);
    }
  };

  // Phase 4: Finale restoration
  useEffect(() => {
    if (phase !== 'finale') return;
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    try {
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {}

    document.body.style.background = '';
    const t = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Spotlight */}
      {(phase === 'spotlight' || phase === 'waveform') && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 65%)',
          }}
        />
      )}

      {/* Finale diffusion */}
      {phase === 'finale' && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 50%)',
          }}
        />
      )}

      {/* Emergency Exit */}
      <button
        onClick={onComplete}
        className="fixed top-4 right-4 z-[10000] px-2 py-1 rounded-md text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="退出"
      >
        ✕ 退出
      </button>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <p
          className="text-2xl md:text-3xl font-bold text-center tracking-wide"
          style={{
            color: '#FFFFFF',
            textShadow:
              '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8), 0 0 45px rgba(227,93,106,0.6)',
          }}
        >
          {typedText}
          {phase !== 'finale' && (
            <span className="inline-block w-1 h-8 md:h-10 bg-white ml-1 align-middle animate-pulse" />
          )}
        </p>

        <AnimatePresence>
          {phase === 'waveform' && showWaveform && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="mt-12 flex flex-col items-center"
            >
              <button
                onClick={handleWaveformClick}
                disabled={hasClickedWaveform}
                className={`relative w-72 h-32 md:w-96 md:h-40 rounded-2xl border transition-all ${
                  hasClickedWaveform
                    ? 'border-[#E35D6A]/40 cursor-default'
                    : 'border-[#E35D6A]/70 hover:border-[#E35D6A] cursor-pointer hover:shadow-[0_0_30px_rgba(227,93,106,0.3)]'
                } bg-black/20 backdrop-blur-sm`}
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full rounded-2xl"
                />
              </button>

              {!hasClickedWaveform && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-sm text-white/80 tracking-wider"
                >
                  点击波形，听我说
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
