import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function useAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [state, setState] = useState<AudioState>('idle');
  const [position, setPosition] = useState(0);   // ms
  const [duration, setDuration] = useState(0);   // ms
  const [currentUri, setCurrentUri] = useState<string | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const load = useCallback(async (uri: string) => {
    try {
      setState('loading');
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return;
          setPosition(status.positionMillis);
          setDuration(status.durationMillis ?? 0);
          if (status.didJustFinish) {
            setState('idle');
            setPosition(0);
          } else {
            setState(status.isPlaying ? 'playing' : 'paused');
          }
        }
      );
      soundRef.current = sound;
      setCurrentUri(uri);
      setState('playing');
    } catch {
      setState('error');
    }
  }, []);

  const play = useCallback(async (uri: string) => {
    if (uri === currentUri && soundRef.current) {
      await soundRef.current.playAsync();
      setState('playing');
    } else {
      await load(uri);
    }
  }, [currentUri, load]);

  const pause = useCallback(async () => {
    await soundRef.current?.pauseAsync();
    setState('paused');
  }, []);

  const stop = useCallback(async () => {
    await soundRef.current?.stopAsync();
    setState('idle');
    setPosition(0);
  }, []);

  const seek = useCallback(async (ms: number) => {
    await soundRef.current?.setPositionAsync(ms);
    setPosition(ms);
  }, []);

  const toggle = useCallback(async (uri: string) => {
    if (state === 'playing' && uri === currentUri) {
      await pause();
    } else {
      await play(uri);
    }
  }, [state, currentUri, play, pause]);

  return { state, position, duration, currentUri, play, pause, stop, seek, toggle };
}
