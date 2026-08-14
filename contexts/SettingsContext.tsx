import React, {
  createContext,
  useContext,
  useSyncExternalStore,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Shared settings store (C2) — see FavoritesContext.tsx for the full rationale.
 * Same shape: one module-level store, `SettingsProvider` owns the subscription
 * that keeps it hydrated, consumers read through Context and fall back to
 * subscribing directly when no provider is mounted.
 *
 * ⚠️ STORAGE KEY IS LOAD-BEARING — `@thirumanthiram_settings` must stay
 * byte-identical, and the legacy `fontSize` string → `fontSizeValue` numeric
 * migration below must stay verbatim, or existing users lose their settings on
 * upgrade.
 */
export const FONT_SIZE_DEFAULT = 17;
export const FONT_SIZE_MIN = 13;
export const FONT_SIZE_MAX = 22;

/**
 * `autoPlayAudio` was REMOVED here (D1). It was dead UI — a switch that
 * animated and persisted while doing nothing. It is not coming back: the
 * player is mounted twice inside `activeTab` conditionals on the verse screen,
 * so autoplay would restart audio on every tab tap, and it would oscillate
 * against U7's stop-on-blur.
 *
 * No migration is needed. Settings written by an older build still contain
 * `"autoPlayAudio"`, and `{ ...DEFAULTS, ...parsed }` below simply carries the
 * unknown key through onto the snapshot, where nothing reads it. `parsed` is
 * `any`, so there is no excess-property error either. Verified by the existing
 * `storageCorruption` pin, which asserts a stored `{"a":1}` survives the merge.
 */
export interface AppSettings {
  showTransliteration: boolean;
  showEnglish: boolean;
  fontSizeValue: number;
}

const DEFAULTS: AppSettings = {
  showTransliteration: true,
  showEnglish: true,
  fontSizeValue: FONT_SIZE_DEFAULT,
};

const KEY = '@thirumanthiram_settings';

export interface SettingsValue {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
}

let snapshot: AppSettings = DEFAULTS;
let hydrated = false;
/**
 * Patches applied before hydration finishes are accumulated, not written.
 * Writing immediately persists `{ ...DEFAULTS, ...patch }` over whatever the
 * user actually had stored.
 */
let pendingPatch: Partial<AppSettings> | null = null;

const listeners = new Set<() => void>();

function getSnapshot(): AppSettings {
  return snapshot;
}

function setSnapshot(next: AppSettings) {
  if (next === snapshot) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function persist(next: AppSettings) {
  AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
}

function hydrate() {
  hydrated = false;
  pendingPatch = null;
  setSnapshot(DEFAULTS);

  let next: AppSettings = DEFAULTS;

  AsyncStorage.getItem(KEY)
    .then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        // Shape validation, not just parse-safety. JSON.parse succeeds on
        // '"a string"', and spreading a string yields numeric index keys
        // ({0:'a', 1:' ', ...}) merged over DEFAULTS. Only a plain object is
        // a valid settings payload; arrays and primitives are corrupt.
        if (
          parsed === null ||
          typeof parsed !== 'object' ||
          Array.isArray(parsed)
        ) {
          next = DEFAULTS;
        } else {
          // Back-compat: migrate old fontSize string to numeric
          if (parsed.fontSize && parsed.fontSizeValue == null) {
            parsed.fontSizeValue =
              parsed.fontSize === 'small' ? 15 :
              parsed.fontSize === 'large' ? 19 : 17;
            delete parsed.fontSize;
          }
          next = { ...DEFAULTS, ...parsed };
        }
      } catch {
        // Corrupt payload (H8) — fall back to defaults rather than letting the
        // throw escape the .then() and strand the whole store unhydrated.
        next = DEFAULTS;
      }
    })
    .catch(() => {})
    .finally(() => {
      // Runs on EVERY exit path, including a rejected getItem.
      hydrated = true;
      const queued = pendingPatch;
      pendingPatch = null;
      if (queued) {
        next = { ...next, ...queued };
        persist(next);
      }
      setSnapshot(next);
    });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) hydrate();
  return () => {
    listeners.delete(listener);
  };
}

const NOOP_UNSUBSCRIBE = () => {};
function noopSubscribe(): () => void {
  return NOOP_UNSUBSCRIBE;
}

function update(patch: Partial<AppSettings>) {
  if (!hydrated) {
    pendingPatch = { ...(pendingPatch ?? {}), ...patch };
    return;
  }
  const next = { ...snapshot, ...patch };
  persist(next);
  setSnapshot(next);
}

const SettingsContext = createContext<SettingsValue | null>(null);

function useSettingsValue(subscribeFn: typeof subscribe): SettingsValue {
  const settings = useSyncExternalStore(subscribeFn, getSnapshot, getSnapshot);
  return { settings, update };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const value = useSettingsValue(subscribe);
  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const fromProvider = useContext(SettingsContext);
  const fallback = useSettingsValue(fromProvider ? noopSubscribe : subscribe);
  return fromProvider ?? fallback;
}
