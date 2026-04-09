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

// In-memory fallback when both Redis and filesystem are unavailable (e.g. Vercel serverless)
let memoryLetters: Letter[] = [];

// Try to create Redis client from env (Upstash / Vercel KV Integrations)
function createRedis(): Redis | null {
  // KV_REST_API_URL is the correct REST endpoint for Vercel KV
  // KV_URL is usually redis:// and not suitable for @upstash/redis REST client
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.KV_URL;
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
    return [];
  }
  try {
    return JSON.parse(readFileSync(LOCAL_FILE, 'utf-8')) as Letter[];
  } catch {
    return [];
  }
}

function writeLocal(letters: Letter[]) {
  try {
    const dir = join(process.cwd(), 'data');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(LOCAL_FILE, JSON.stringify(letters, null, 2));
    return true;
  } catch {
    return false;
  }
}

async function readLetters(): Promise<Letter[]> {
  if (redis) {
    try {
      const letters = await redis.get<Letter[]>(REDIS_KEY);
      return letters || [];
    } catch (err) {
      console.warn('Redis read failed, falling back:', err);
    }
  }
  return readLocal();
}

async function writeLetters(letters: Letter[]) {
  if (redis) {
    try {
      await redis.set(REDIS_KEY, letters);
      return true;
    } catch (err) {
      console.warn('Redis write failed, falling back:', err);
    }
  }
  if (writeLocal(letters)) {
    return true;
  }
  memoryLetters = letters;
  console.warn('Filesystem write also failed, using in-memory fallback.');
  return true;
}

export async function getLetters(): Promise<Letter[]> {
  const letters = await readLetters();
  return letters;
}

export async function saveLetter(content: string): Promise<Letter> {
  const letter: Letter = {
    id: `${Date.now()}`,
    content,
    createdAt: new Date().toISOString(),
  };

  const existing = await readLetters();
  const updated = [letter, ...existing];
  await writeLetters(updated);

  return letter;
}

export async function deleteLetter(id: string): Promise<boolean> {
  const existing = await readLetters();
  const updated = existing.filter((l) => l.id !== id);
  await writeLetters(updated);
  return true;
}
