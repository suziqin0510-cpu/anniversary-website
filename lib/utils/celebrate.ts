import confetti from 'canvas-confetti';

// 统一清理函数类型
export type CelebrationFn = () => void;

// 1. 时间线 - 经典爱心雨 (Timeline)
export const celebrateTimeline: CelebrationFn = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#E35D6A', '#F4A460', '#FFB5A7'],
      shapes: ['circle'],
      scalar: 1.2,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#E35D6A', '#F4A460', '#FFB5A7'],
      shapes: ['circle'],
      scalar: 1.2,
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

// 2. 足迹 - 地图烟花 (Footprints/Map)
export const celebrateFootprints: CelebrationFn = () => {
  const fire = (x: number, y: number) => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x, y },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      shapes: ['circle', 'square'],
      scalar: 1.1,
      gravity: 0.8,
      drift: 0,
      disableForReducedMotion: true,
    });
  };

  fire(0.2, 0.6);
  setTimeout(() => fire(0.5, 0.5), 250);
  setTimeout(() => fire(0.8, 0.7), 500);
};

// 3. 勋章 - 金色螺旋奖杯 (Achievements)
export const celebrateMedals: CelebrationFn = () => {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    const t = (Date.now() - (end - duration)) / duration;
    const x = 0.5 + 0.4 * Math.sin(t * Math.PI * 4);
    const y = 0.5 - 0.3 * t;

    confetti({
      particleCount: 4,
      spread: 40,
      origin: { x, y },
      colors: ['#FFD700', '#FFA500', '#E35D6A', '#FFFFFF'],
      shapes: ['square'],
      scalar: 1.3,
      gravity: 0.6,
      drift: (Math.random() - 0.5) * 2,
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

// 4. 愿望 - 梦幻流星 (Wishes/Future)
export const celebrateWishes: CelebrationFn = () => {
  const fire = (originX: number, delay: number) => {
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 60,
        origin: { x: originX, y: 0 },
        colors: ['#A78BFA', '#60A5FA', '#F472B6', '#34D399'],
        shapes: ['circle'],
        scalar: 1,
        gravity: 1.2,
        drift: -1,
        ticks: 150,
        disableForReducedMotion: true,
      });
    }, delay);
  };

  fire(0.2, 0);
  fire(0.5, 400);
  fire(0.8, 800);
};

// 5. 日记 - 羽毛书本飘落 (Diary)
export const celebrateDiary: CelebrationFn = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 2,
      spread: 80,
      origin: { x: Math.random(), y: -0.1 },
      colors: ['#FDE68A', '#FCA5A5', '#93C5FD', '#FFFFFF'],
      shapes: ['circle'],
      scalar: 1.5,
      gravity: 0.4,
      drift: Math.random() - 0.5,
      ticks: 200,
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

// 6. 宠物 - 爪印弹跳 (Pets)
export const celebratePets: CelebrationFn = () => {
  const fire = (originX: number, delay: number) => {
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { x: originX, y: 1 },
        colors: ['#FBBF24', '#F87171', '#60A5FA', '#34D399', '#A78BFA'],
        shapes: ['circle'],
        scalar: 1.2,
        gravity: 1.5,
        startVelocity: 45,
        disableForReducedMotion: true,
      });
    }, delay);
  };

  fire(0.2, 0);
  fire(0.4, 200);
  fire(0.6, 400);
  fire(0.8, 600);
};
