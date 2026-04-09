'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

// 歌曲类型
interface Song {
  title: string;
  src: string;
}

// 播放列表 - 使用 public 目录下的本地音乐文件
const PLAYLIST: Song[] = [
  { title: "我们的专属回忆 1", src: "/bgm1.mp3" },
  { title: "我们的专属回忆 2", src: "/bgm2.mp3" },
  { title: "我们的专属回忆 3", src: "/bgm3.mp3" },
  { title: "我们的专属回忆 4", src: "/bgm4.mp3" },
  { title: "我们的专属回忆 5", src: "/bgm5.mp3" },
  { title: "我们的专属回忆 6", src: "/bgm6.mp3" },
  { title: "我们的专属回忆 7", src: "/bgm7.mp3" },
];

// MusicContext 类型
interface MusicContextType {
  isPlaying: boolean;
  currentSong: Song;
  currentIndex: number;
  togglePlay: () => void;
  pause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  hasStarted: boolean;
  hasError: boolean;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  isShuffle: boolean;
  toggleShuffle: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

const STORAGE_INDEX_KEY = 'music_current_index';
const STORAGE_TIME_KEY = 'music_current_time';
const STORAGE_SHUFFLE_KEY = 'music_shuffle';

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(STORAGE_INDEX_KEY);
    const parsed = saved ? parseInt(saved, 10) : 0;
    return !isNaN(parsed) && parsed >= 0 && parsed < PLAYLIST.length ? parsed : 0;
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_SHUFFLE_KEY) === 'true';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactionListenerAdded = useRef(false);
  const savedTimeRef = useRef<number | null>(null);
  const isShuffleRef = useRef(isShuffle);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SHUFFLE_KEY, String(isShuffle));
    }
  }, [isShuffle]);

  const currentSong = PLAYLIST[currentIndex];

  // 挂载时读取保存的播放时间
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem(STORAGE_TIME_KEY);
      savedTimeRef.current = savedTime ? parseFloat(savedTime) : null;
    }
  }, []);

  // 初始化音频元素
  useEffect(() => {
    audioRef.current = new Audio(currentSong.src);
    audioRef.current.preload = 'auto';
    audioRef.current.volume = 1;

    // 监听歌曲结束，自动播放下一首
    const handleEnded = () => {
      let nextIndex: number;
      if (isShuffleRef.current) {
        nextIndex = Math.floor(Math.random() * PLAYLIST.length);
        if (nextIndex === currentIndex && PLAYLIST.length > 1) {
          nextIndex = (nextIndex + 1) % PLAYLIST.length;
        }
      } else {
        nextIndex = (currentIndex + 1) % PLAYLIST.length;
      }
      setCurrentIndex(nextIndex);
      localStorage.removeItem(STORAGE_TIME_KEY);
      savedTimeRef.current = null;
    };

    // 监听错误
    const handleError = () => {
      console.warn(`音频加载失败: ${currentSong.src}`);
      setHasError(true);
      // 自动切换到下一首
      let nextIndex: number;
      if (isShuffleRef.current) {
        nextIndex = Math.floor(Math.random() * PLAYLIST.length);
        if (nextIndex === currentIndex && PLAYLIST.length > 1) {
          nextIndex = (nextIndex + 1) % PLAYLIST.length;
        }
      } else {
        nextIndex = (currentIndex + 1) % PLAYLIST.length;
      }
      setCurrentIndex(nextIndex);
      localStorage.removeItem(STORAGE_TIME_KEY);
      savedTimeRef.current = null;
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 0);
      }
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    // 部分浏览器缓存时不会触发 loadedmetadata，手动补一次
    if (audioRef.current.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      audioRef.current?.removeEventListener('ended', handleEnded);
      audioRef.current?.removeEventListener('error', handleError);
      audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current?.pause();
    };
  }, [currentIndex, currentSong.src]);

  // 当 currentIndex 变化时持久化并更新音频源
  useEffect(() => {
    localStorage.setItem(STORAGE_INDEX_KEY, currentIndex.toString());

    if (audioRef.current) {
      // 更新音频源
      audioRef.current.src = currentSong.src;
      audioRef.current.volume = 1;
      setHasError(false);
      setDuration(0);

      // 恢复之前保存的播放时间（页面切换后接着播）
      if (savedTimeRef.current && !isNaN(savedTimeRef.current)) {
        audioRef.current.currentTime = savedTimeRef.current;
        setCurrentTime(savedTimeRef.current);
      } else {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }

      // 强制开始播放（无论之前是播放还是暂停状态）
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("切歌自动播放被拦截:", error);
        setIsPlaying(false);
      });
    }
  }, [currentIndex, currentSong.src]);

  // 处理播放/暂停状态变化（仅处理用户手动点击，不处理切歌）
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // 自动播放被阻止
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 定期保存播放进度，确保切页后能续播，并同步 currentTime
  useEffect(() => {
    if (!audioRef.current) return;

    const saveProgress = () => {
      if (audioRef.current) {
        const t = audioRef.current.currentTime;
        setCurrentTime(t);
        localStorage.setItem(STORAGE_TIME_KEY, t.toString());
      }
    };

    const interval = setInterval(saveProgress, 1000);

    audioRef.current.addEventListener('timeupdate', saveProgress);

    return () => {
      clearInterval(interval);
      audioRef.current?.removeEventListener('timeupdate', saveProgress);
    };
  }, [currentIndex, currentSong.src]);

  // 切换播放/暂停
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

  // 无条件暂停 BGM
  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  // 播放下一首 - 只改变索引，播放由 useEffect 处理
  const playNext = useCallback(() => {
    let nextIndex: number;
    if (isShuffleRef.current) {
      nextIndex = Math.floor(Math.random() * PLAYLIST.length);
      if (nextIndex === currentIndex && PLAYLIST.length > 1) {
        nextIndex = (nextIndex + 1) % PLAYLIST.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % PLAYLIST.length;
    }
    setCurrentIndex(nextIndex);
    localStorage.removeItem(STORAGE_TIME_KEY);
    savedTimeRef.current = null;
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [currentIndex, hasStarted]);

  // 播放上一首 - 只改变索引，播放由 useEffect 处理
  const playPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentIndex(prevIndex);
    localStorage.removeItem(STORAGE_TIME_KEY);
    savedTimeRef.current = null;
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [currentIndex, hasStarted]);

  // 进度跳转
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      const safeTime = Math.max(0, Math.min(time, audioRef.current.duration || time));
      audioRef.current.currentTime = safeTime;
      setCurrentTime(safeTime);
    }
  }, []);

  // 切换乱序/顺序播放
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  // 处理浏览器自动播放限制：监听第一次用户交互
  useEffect(() => {
    // 如果已经启动过，不再添加监听器
    if (hasStarted || interactionListenerAdded.current) return;

    const handleFirstInteraction = () => {
      if (!hasStarted && audioRef.current && !hasError) {
        // 第一次用户交互时静默启动音乐
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        }).catch((err) => {
          console.log('自动播放被阻止:', err);
        });
      }
      // 移除监听器
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      interactionListenerAdded.current = true;
    };

    // 添加全局点击监听器
    document.addEventListener('click', handleFirstInteraction, { passive: true });
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    interactionListenerAdded.current = true;

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasStarted, hasError]);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentSong,
        currentIndex,
        togglePlay,
        pause,
        playNext,
        playPrevious,
        hasStarted,
        hasError,
        currentTime,
        duration,
        seek,
        isShuffle,
        toggleShuffle,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

export { PLAYLIST };
