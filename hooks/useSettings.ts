import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  showTransliteration: boolean;
  showEnglish: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoPlayAudio: boolean;
}

const DEFAULTS: AppSettings = {
  showTransliteration: true,
  showEnglish: true,
  fontSize: 'medium',
  autoPlayAudio: false,
};

const KEY = '@thirumanthiram_settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
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
