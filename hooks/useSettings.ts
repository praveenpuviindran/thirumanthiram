import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FONT_SIZE_DEFAULT = 17;
export const FONT_SIZE_MIN = 13;
export const FONT_SIZE_MAX = 22;

export interface AppSettings {
  showTransliteration: boolean;
  showEnglish: boolean;
  fontSizeValue: number;
  autoPlayAudio: boolean;
}

const DEFAULTS: AppSettings = {
  showTransliteration: true,
  showEnglish: true,
  fontSizeValue: FONT_SIZE_DEFAULT,
  autoPlayAudio: false,
};

const KEY = '@thirumanthiram_settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) {
        const parsed = JSON.parse(raw);
        // Back-compat: migrate old fontSize string to numeric
        if (parsed.fontSize && parsed.fontSizeValue == null) {
          parsed.fontSizeValue =
            parsed.fontSize === 'small' ? 15 :
            parsed.fontSize === 'large' ? 19 : 17;
          delete parsed.fontSize;
        }
        setSettings({ ...DEFAULTS, ...parsed });
      }
    });
  }, []);

  const update = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { settings, update };
}
