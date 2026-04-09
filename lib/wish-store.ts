import { Redis } from '@upstash/redis';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface Wish {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  iconKey?: string;
  isCustom?: boolean;
  createdAt: string;
}

const REDIS_KEY = 'anniversary-user-wishes';
const LOCAL_FILE = join(process.cwd(), 'data', 'wishes.json');

let memoryWishes: Wish[] = [];

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.KV_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const redis = createRedis();

function readLocal(): Wish[] {
  if (!existsSync(LOCAL_FILE)) return [];
  try {
    return JSON.parse(readFileSync(LOCAL_FILE, 'utf-8')) as Wish[];
  } catch {
    return [];
  }
}

function writeLocal(wishes: Wish[]) {
  try {
    const dir = join(process.cwd(), 'data');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(LOCAL_FILE, JSON.stringify(wishes, null, 2));
    return true;
  } catch {
    return false;
  }
}

async function readWishes(): Promise<Wish[]> {
  if (redis) {
    try {
      const data = await redis.get<Wish[]>(REDIS_KEY);
      return data || [];
    } catch (err) {
      console.warn('Redis read failed, falling back:', err);
    }
  }
  return readLocal();
}

async function writeWishes(wishes: Wish[]) {
  if (redis) {
    try {
      await redis.set(REDIS_KEY, wishes);
      return true;
    } catch (err) {
      console.warn('Redis write failed, falling back:', err);
    }
  }
  if (writeLocal(wishes)) {
    return true;
  }
  memoryWishes = wishes;
  console.warn('Filesystem write also failed, using in-memory fallback.');
  return true;
}

export async function getWishes(): Promise<Wish[]> {
  return readWishes();
}

export async function saveWish(title: string, description: string, iconKey?: string): Promise<Wish> {
  const wish: Wish = {
    id: `${Date.now()}`,
    title,
    description,
    completed: false,
    iconKey: iconKey || 'star',
    isCustom: true,
    createdAt: new Date().toISOString(),
  };
  const existing = await readWishes();
  const updated = [wish, ...existing];
  await writeWishes(updated);
  return wish;
}

export async function updateWish(id: string, patch: Partial<Pick<Wish, 'completed' | 'title' | 'description'>>): Promise<Wish | null> {
  const existing = await readWishes();
  let target: Wish | null = null;
  const updated = existing.map((w) => {
    if (w.id === id) {
      target = { ...w, ...patch };
      return target;
    }
    return w;
  });
  if (!target) return null;
  await writeWishes(updated);
  return target;
}

export async function deleteWish(id: string): Promise<boolean> {
  const existing = await readWishes();
  const updated = existing.filter((w) => w.id !== id);
  await writeWishes(updated);
  return true;
}

export async function seedWishes(defaultWishes: Omit<Wish, 'id' | 'createdAt'>[]): Promise<Wish[]> {
  const existing = await readWishes();
  if (existing.length > 0) return existing;
  const toSeed: Wish[] = defaultWishes.map((w) => ({
    ...w,
    id: `seed-${w.title}`,
    createdAt: new Date().toISOString(),
  }));
  await writeWishes(toSeed);
  return toSeed;
}
