import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DATA_VERSION, STORAGE_KEYS } from '../constants/DataVersion';

export function useDataMigration() {
  useEffect(() => {
    async function run() {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      const storedVersion = stored ? parseInt(stored, 10) : null;

      if (storedVersion !== DATA_VERSION) {
        console.log(
          `[DataMigration] Data updated: v${storedVersion ?? 'none'} → v${DATA_VERSION}`
        );
        await AsyncStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(DATA_VERSION));
      }
    }

    run().catch((e) => console.warn('[DataMigration] Error:', e));
  }, []);
}
