// Increment this whenever verse data, translations, or commentary changes significantly.
// This is independent of the app version — used to detect data updates on launch.
export const DATA_VERSION = 3;

// Keys used in AsyncStorage — centralised here so migrations can reference them.
export const STORAGE_KEYS = {
  DATA_VERSION: 'thirumanthiram_data_version',
  // User-generated — never cleared by migrations
  FAVORITES: 'favorites',
  SETTINGS: 'app_settings',
  NOTE_PREFIX: 'verse_note_',
} as const;
