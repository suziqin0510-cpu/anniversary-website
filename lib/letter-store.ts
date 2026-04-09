import { Redis } from '@upstash/redis';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface Letter {
  id: string;
  content: string;
  createdAt: string;
}

const REDIS_KEY = 'anniversary-user-letters';
const LOCAL_FILE = join(process.cwd(), 'data', 'letters.json');

// Try to create Redis client from env (Upstash / Vercel Integrations)
function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const redis = createRedis();

function readLocal(): Letter[] {
  if (!existsSync(LOCAL_FILE)) {
    const dir = join(process.cwd(), 'data');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(LOCAL_FILE, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(readFileSync(LOCAL_FILE, 'utf-8')) as Letter[];
  } catch {
    return [];
  }
}

function writeLocal(letters: Letter[]) {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(LOCAL_FILE, JSON.stringify(letters, null, 2));
}

export async function getLetters(): Promise<Letter[]> {
  if (redis) {
    const letters = await redis.get<Letter[]>(REDIS_KEY);
    return letters || [];
  }
  return readLocal();
}

export async function saveLetter(content: string): Promise<Letter> {
  const letter: Letter = {
    id: `${Date.now()}`,
    content,
    createdAt: new Date().toISOString(),
  };

  if (redis) {
    const existing = (await redis.get<Letter[]>(REDIS_KEY)) || [];
    const updated = [letter, ...existing];
    await redis.set(REDIS_KEY, updated);
  } else {
    const existing = readLocal();
    const updated = [letter, ...existing];
    writeLocal(updated);
  }

  return letter;
}
