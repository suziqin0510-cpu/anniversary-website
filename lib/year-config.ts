export interface YearConfig {
  year: number;
  title: string;
  status: 'unlocked' | 'locked';
  subtitle: string;
}

export const YEARS: YearConfig[] = [
  { year: 2025, title: '第一章：初见与热恋', status: 'unlocked', subtitle: '我们的第一年' },
  { year: 2026, title: '第二章：待开启', status: 'locked', subtitle: '未完待续' },
  { year: 2027, title: '第三章：待开启', status: 'locked', subtitle: '未来可期' },
];

export function getNextAnniversaryCountdown(targetYear?: number) {
  const now = new Date();
  const year = targetYear ?? now.getFullYear();
  let nextDate = new Date(year, 4, 20, 0, 0, 0); // May 20

  if (now > nextDate) {
    nextDate = new Date(year + 1, 4, 20, 0, 0, 0);
  }

  const diff = nextDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, nextDate };
}
