'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/lib/game-context';
import type { CelebrationFn } from '@/lib/utils/celebrate';

const STORAGE_KEY = 'unlocked_grand_chapters';

export type ChapterToast = {
  show: boolean;
  title: string;
  subtitle: string;
} | null;

function getCelebratedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function markCelebrated(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const ids = getCelebratedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

interface UseGrandChapterCelebrationOptions {
  level: number;
  id: string;
  title: string;
  subtitle: string;
  celebrate: CelebrationFn;
}

export function useGrandChapterCelebration({
  level,
  id,
  title,
  subtitle,
  celebrate,
}: UseGrandChapterCelebrationOptions) {
  const { isLevelUnlocked } = useGame();
  const [toast, setToast] = useState<ChapterToast>(null);

  useEffect(() => {
    const celebrated = getCelebratedIds();
    if (celebrated.includes(id)) return;
    if (!isLevelUnlocked(level)) return;

    // Trigger celebration
    celebrate();
    markCelebrated(id);

    setToast({ show: true, title, subtitle });
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [level, id, title, subtitle, celebrate, isLevelUnlocked]);

  return { toast };
}
