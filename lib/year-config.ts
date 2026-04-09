export interface YearConfig {
  year: number;
  title: string;
  status: 'unlocked' | 'locked';
  subtitle: string;
}

export const YEARS: YearConfig[] = [
  { year: 2026, title: '第一章：初见与热恋', status: 'unlocked', subtitle: '我们的一周年' },
  { year: 2027, title: '第二章：待开启', status: 'locked', subtitle: '未完待续' },
  { year: 2028, title: '第三章：待开启', status: 'locked', subtitle: '未来可期' },
];

export function getNextAnniversaryCountdown(targetYear?: number) {
  const now = new Date();
  const year = targetYear ?? now.getFullYear();
  const nextDate = new Date(year, 4, 20, 0, 0, 0); // May 20 of targetYear

  const diff = nextDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

  return { days, hours, minutes, seconds, nextDate };
}
