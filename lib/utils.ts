import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 恋爱纪念日配置
export const ANNIVERSARY_DATE = new Date('2025-05-20');
export const NAMES = {
  boy: '苏子钦',
  girl: '李丹',
};

// 计算恋爱天数
export function calculateDaysTogether(): number {
  const today = new Date();
  const diffTime = today.getTime() - ANNIVERSARY_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// 计算距离周年还有多久
export function calculateUntilAnniversary(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  let nextAnniversary = new Date(currentYear, 4, 20); // 5月20日

  if (now > nextAnniversary) {
    nextAnniversary = new Date(currentYear + 1, 4, 20);
  }

  const diffTime = nextAnniversary.getTime() - now.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

// 格式化日期
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 获取恋爱阶段
export function getLoveStage(days: number): string {
  if (days < 30) return '热恋期';
  if (days < 100) return '磨合期';
  if (days < 365) return '稳定期';
  return '周年纪念';
}
