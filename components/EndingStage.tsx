'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const FULL_TEXT = '这些代码写不出的，我想亲口说给你听';

interface EndingStageProps {
  onComplete: () => void;
}

export default function EndingStage({ onComplete }: EndingStageProps) {
  const [phase, setPhase] = useState<'shake' | 'spotlight' | 'typing' | 'waveform' | 'finale'>('shake');
  const [typedText, setTypedText] = useState('');
  const [showWaveform, setShowWaveform] = useState(false);
  const [isWaveformActive, setIsWaveformActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const sharedAudioCtxRef = useRef<AudioContext | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Mount: brute-force cleanup (runs once)
  useEffect(() => {
    document.body.classList.remove('violent-shake');
    document.body.style.background = '#000000';
    document.body.style.overflow = 'hidden';

    // Kill any <audio> elements in the DOM
    document.querySelectorAll('audio').forEach((audio) => {
      try {
        audio.pause();
        (audio as HTMLAudioElement).muted = true;
        audio.currentTime = 0;
      } catch {}
    });

    // Remove stray canvases (confetti)
    document.querySelectorAll('canvas').forEach((c) => {
      try {
        const style = window.getComputedStyle(c);
        if (style.position === 'fixed' && style.pointerEvents === 'none') {
          c.remove();
        }
      } catch {}
    });

    // Shake -> spotlight after 3s
    const t1 = setTimeout(() => {
      setPhase('spotlight');
    }, 3000);

    return () => {
      clearTimeout(t1);
      document.body.style.overflow = '';
    };
  }, []);

  // Finale cleanup
  useEffect(() => {
    if (phase === 'finale') {
      document.body.style.background = '';
      const t = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  // Component unmount cleanup
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

  // User click to start
  const handleStartSignal = async () => {
    if (phase !== 'spotlight') return;
    setPhase('typing');

    // 1. Initialize shared AudioContext inside user gesture
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    sharedAudioCtxRef.current = audioCtx;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 2. Prepare voice audio graph inside same gesture
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
    } catch (err) {
      console.warn('Voice unlock attempt failed:', err);
    }

    // 3. Typewriter sequence
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
      console.error('Auto-play voice failed:', err);
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

  // Inline styles to avoid any Tailwind utility issue
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      {/* Always-visible debug phase label - ensures we know component is alive */}
      <div
        style={{
          position: 'fixed',
          top: 60,
          left: 16,
          background: '#DC2626',
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 700,
          zIndex: 100000,
        }}
      >
        PHASE: {phase}
      </div>

      {/* Exit */}
      <button
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 10000,
          padding: '4px 8px',
          borderRadius: 6,
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={onComplete}
      >
        ✕ 退出
      </button>

      {/* Spotlight */}
      {(phase === 'spotlight' || phase === 'typing' || phase === 'waveform') && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, transparent 55%)',
          }}
        />
      )}

      {/* Typewriter text */}
      {(phase === 'typing' || phase === 'waveform' || phase === 'finale') && (
        <p
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: '0.05em',
            textShadow: '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8), 0 0 45px rgba(227,93,106,0.6)',
          }}
        >
          {typedText}
          {phase !== 'finale' && typedText.length > 0 && (
            <span style={{ display: 'inline-block', width: 4, height: 32, background: 'white', marginLeft: 6, verticalAlign: 'middle' }} />
          )}
        </p>
      )}

      {/* Start button - HIGHLY VISIBLE */}
      {phase === 'spotlight' && (
        <button
          onClick={handleStartSignal}
          style={{
            marginTop: 40,
            padding: '16px 36px',
            borderRadius: '9999px',
            border: '2px solid #FFFFFF',
            background: '#E35D6A',
            color: '#FFFFFF',
            fontSize: '1.125rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(227,93,106,0.7)',
          }}
        >
          点击接收最后的信号
        </button>
      )}

      {/* Waveform */}
      {phase === 'waveform' && showWaveform && (
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: 384,
              maxWidth: '90vw',
              height: 160,
              borderRadius: 16,
              border: '1px solid rgba(227, 93, 106, 0.6)',
              background: 'rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em' }}>正在播放...</p>
        </div>
      )}
    </div>
  );
}
