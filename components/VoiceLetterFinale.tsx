'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '@/lib/music-context';
import { playTypewriter } from '@/lib/utils/playSound';

const FULL_TEXT = '这些代码写不出的，我想亲口说给你听';

interface VoiceLetterFinaleProps {
  onComplete: () => void;
}

export default function VoiceLetterFinale({ onComplete }: VoiceLetterFinaleProps) {
  const [phase, setPhase] = useState<'shake' | 'blackout' | 'spotlight' | 'waveform' | 'finale'>('shake');
  const [typedText, setTypedText] = useState('');
  const [waveformVisible, setWaveformVisible] = useState(false);
  const [isWaveformActive, setIsWaveformActive] = useState(false);
  const [hasClickedWaveform, setHasClickedWaveform] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const music = useMusic();

  // Phase 1 & 2: Shake -> Blackout
  useEffect(() => {
    document.body.classList.add('violent-shake');

    const t1 = setTimeout(() => {
      document.body.classList.remove('violent-shake');
      setPhase('blackout');

      // Fade page content and background to black
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).style.transition = 'opacity 0.5s ease';
        (main as HTMLElement).style.opacity = '0';
      }
      document.body.style.transition = 'background 0.5s ease';
      document.body.style.background = '#000000';
    }, 3000);

    const t2 = setTimeout(() => {
      setPhase('spotlight');
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.classList.remove('violent-shake');
    };
  }, []);

  // Phase 3: Typewriter
  useEffect(() => {
    if (phase !== 'spotlight') return;
    let index = 0;
    const timer = setInterval(() => {
      if (index < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, index + 1));
        playTypewriter();
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setWaveformVisible(true);
        }, 600);
      }
    }, 150);
    return () => clearInterval(timer);
  }, [phase]);

  // Waveform drawing (idle or active)
  const drawWaveform = useCallback(() => {
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
    const cx = width / 2;
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
        gradient.addColorStop(0, 'rgba(227, 93, 106, 0.9)');
        gradient.addColorStop(1, 'rgba(244, 164, 96, 0.6)');

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(227, 93, 106, 0.8)';
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.shadowBlur = 0;
      }
    } else {
      // Idle gentle sine wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(227, 93, 106, 0.6)';
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

    rafRef.current = requestAnimationFrame(drawWaveform);
  }, [isWaveformActive]);

  useEffect(() => {
    if (phase === 'waveform' || phase === 'finale') {
      rafRef.current = requestAnimationFrame(drawWaveform);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [phase, drawWaveform]);

  const handleWaveformClick = async () => {
    if (hasClickedWaveform || phase !== 'waveform') return;
    setHasClickedWaveform(true);
    setIsWaveformActive(true);

    // Pause BGM
    music.pause();

    const audio = new Audio('/sounds/final_voice_letter.mp3');
    voiceAudioRef.current = audio;
    audio.volume = 1;

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
      const gain = audioCtx.createGain();
      gain.gain.value = 1.5;
      gainRef.current = gain;
      source.connect(analyser);
      analyser.connect(gain);
      gain.connect(audioCtx.destination);

      await audio.play();

      audio.addEventListener('ended', () => {
        setPhase('finale');
        setIsWaveformActive(false);
      });
    } catch (err) {
      console.error('Voice letter playback failed:', err);
      // Still proceed to finale on error so user isn't stuck
      setTimeout(() => {
        setPhase('finale');
        setIsWaveformActive(false);
      }, 3000);
    }
  };

  // Phase 5: Finale restoration
  useEffect(() => {
    if (phase !== 'finale') return;

    // Stop voice audio if still playing
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }

    // Clean up audio context
    try {
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      gainRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {
      // ignore
    }

    const main = document.querySelector('main');
    if (main) {
      (main as HTMLElement).style.transition = 'opacity 1s ease';
      (main as HTMLElement).style.opacity = '1';
    }
    document.body.style.transition = 'background 1s ease';
    document.body.style.background = '';

    const t = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <AnimatePresence>
        {(phase === 'blackout' || phase === 'spotlight' || phase === 'waveform' || phase === 'finale') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black pointer-events-auto"
          >
            {/* Spotlight radial gradient */}
            {(phase === 'spotlight' || phase === 'waveform') && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 55%)',
                }}
              />
            )}

            {/* Finale diffusion */}
            {phase === 'finale' && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 50%)',
                }}
              />
            )}

            {/* Typewriter text */}
            {(phase === 'spotlight' || phase === 'waveform' || phase === 'finale') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl md:text-4xl font-bold text-white text-center tracking-wide"
                  style={{
                    textShadow:
                      '0 0 20px rgba(227, 93, 106, 0.9), 0 0 40px rgba(227, 93, 106, 0.7), 0 0 60px rgba(227, 93, 106, 0.5)',
                  }}
                >
                  {typedText}
                  <span className="inline-block w-1 h-8 md:h-10 bg-white ml-1 align-middle animate-pulse" />
                </motion.p>

                {/* Waveform canvas */}
                <AnimatePresence>
                  {phase === 'waveform' && waveformVisible && (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
