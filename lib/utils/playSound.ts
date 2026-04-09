export function playHover() {
  try {
    const audio = new Audio('/sounds/hover.wav');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function playUnlock() {
  try {
    const audio = new Audio('/sounds/unlock.wav');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function playError() {
  try {
    const audio = new Audio('/sounds/error.wav');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

/**
 * 机械键盘式打字机音效 —— Web Audio 合成器
 * 使用极短高频白噪声脉冲 + 高通滤波 + 指数衰减包络
 */
export function playTypewriter() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const duration = 0.045; // 45ms 脉冲
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(
      1,
      Math.ceil(sampleRate * duration),
      sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // 高通滤波：保留高频“咔哒”感，像机械轴触底声
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2800;
    filter.Q.value = 0.8;

    // 指数衰减包络：瞬间高振幅 → 快速消退
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + duration + 0.02);

    // 释放资源
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, 120);
  } catch {
    // ignore
  }
}
