import { useCallback, useRef } from 'react';

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
}

export const useSound = (url: string, options: SoundOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = options.volume || 1;
      audioRef.current.playbackRate = options.playbackRate || 1;
    }

    // Reset and play
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(console.error);
  }, [url, options.volume, options.playbackRate]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
};
