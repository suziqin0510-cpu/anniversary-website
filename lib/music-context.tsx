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
  playNext: () => void;
  playPrevious: () => void;
  hasStarted: boolean;
  hasError: boolean;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactionListenerAdded = useRef(false);

  const currentSong = PLAYLIST[currentIndex];

  // 初始化音频元素
  useEffect(() => {
    audioRef.current = new Audio(currentSong.src);
    audioRef.current.preload = 'auto';

    // 监听歌曲结束，自动播放下一首
    const handleEnded = () => {
      const nextIndex = (currentIndex + 1) % PLAYLIST.length;
      setCurrentIndex(nextIndex);
    };

    // 监听错误
    const handleError = () => {
      console.warn(`音频加载失败: ${currentSong.src}`);
      setHasError(true);
      // 自动切换到下一首
      const nextIndex = (currentIndex + 1) % PLAYLIST.length;
      setCurrentIndex(nextIndex);
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('error', handleError);

    return () => {
      audioRef.current?.removeEventListener('ended', handleEnded);
      audioRef.current?.removeEventListener('error', handleError);
      audioRef.current?.pause();
    };
  }, [currentIndex, currentSong.src]);

  // 当歌曲索引变化时更新音频源并强制播放
  useEffect(() => {
    if (audioRef.current) {
      // 更新音频源
      audioRef.current.src = currentSong.src;
      setHasError(false);

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

  // 切换播放/暂停
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

  // 播放下一首 - 只改变索引，播放由 useEffect 处理
  const playNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    setCurrentIndex(nextIndex);
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [currentIndex, hasStarted]);

  // 播放上一首 - 只改变索引，播放由 useEffect 处理
  const playPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentIndex(prevIndex);
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [currentIndex, hasStarted]);

  // 处理浏览器自动播放限制：监听第一次用户点击
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
        playNext,
        playPrevious,
        hasStarted,
        hasError,
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
