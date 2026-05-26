import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@thirumanthiram_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setFavorites(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((ids: number[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, []);

  const toggleFavorite = useCallback((verseId: number) => {
    setFavorites((prev) => {
      const next = prev.includes(verseId)
        ? prev.filter((id) => id !== verseId)
        : [...prev, verseId];
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback(
    (verseId: number) => favorites.includes(verseId),
    [favorites]
  );

  return { favorites, isFavorite, toggleFavorite, loaded };
}
