import { useCallback, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

type Lang = 'tamil' | 'english';
export type SpeechState = 'idle' | 'speaking' | 'noVoice';

export function useSpeech() {
  const [state, setState] = useState<SpeechState>('idle');
  const [activeLang, setActiveLang] = useState<Lang | null>(null);
  const activeRef = useRef<Lang | null>(null);
  const checkedRef = useRef(false);
  const tamilVoiceId = useRef<string | undefined>(undefined);

  const findTamilVoice = useCallback(async (): Promise<boolean> => {
    if (checkedRef.current) return tamilVoiceId.current !== undefined || true;
    checkedRef.current = true;
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const v = voices.find(
        (x) =>
          x.language?.toLowerCase().startsWith('ta') ||
          x.identifier?.toLowerCase().includes('tamil') ||
          x.name?.toLowerCase().includes('tamil'),
      );
      tamilVoiceId.current = v?.identifier;
      return true;
    } catch {
      return true;
    }
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
    setState('idle');
    setActiveLang(null);
    activeRef.current = null;
  }, []);

  const speak = useCallback(
    async (text: string, lang: Lang) => {
      Speech.stop();

      if (activeRef.current === lang) {
        setState('idle');
        setActiveLang(null);
        activeRef.current = null;
        return;
      }

      if (lang === 'tamil') await findTamilVoice();

      const locale = lang === 'tamil' ? 'ta-IN' : 'en-US';
      activeRef.current = lang;
      setState('speaking');
      setActiveLang(lang);

      const opts: Speech.SpeechOptions = {
        language: locale,
        rate: lang === 'tamil' ? 0.82 : 0.9,
        pitch: 1.0,
        onDone: () => {
          if (activeRef.current === lang) {
            setState('idle');
            setActiveLang(null);
            activeRef.current = null;
          }
        },
        onStopped: () => {
          setState('idle');
          setActiveLang(null);
          activeRef.current = null;
        },
        onError: () => {
          setState('idle');
          setActiveLang(null);
          activeRef.current = null;
        },
      };

      if (lang === 'tamil' && tamilVoiceId.current) {
        opts.voice = tamilVoiceId.current;
      }

      try {
        Speech.speak(text, opts);
      } catch {
        setState('idle');
        setActiveLang(null);
        activeRef.current = null;
      }
    },
    [findTamilVoice],
  );

  return { state, activeLang, speak, stop };
}
