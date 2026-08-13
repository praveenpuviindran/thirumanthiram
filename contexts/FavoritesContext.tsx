import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Shared favorites store (C2).
 *
 * Previously `useFavorites()` was a plain `useState` + mount-only `getItem`, so
 * every call site held its own private copy. Combined with the detail screens
 * being registered as `Tabs.Screen` with `href: null` (they mount once and
 * never unmount — bottom-tabs 7.x has no `unmountOnBlur`), a ★ tapped on one
 * screen was invisible to the other four for the rest of the process lifetime.
 *
 * The state therefore lives in a single module-level store. `FavoritesProvider`
 * owns the one subscription that keeps it hydrated for the whole app session;
 * consumers below the provider read through Context. A consumer rendered
 * WITHOUT a provider falls back to subscribing to the same store directly, so
 * the hook degrades to "still shared, still correct" rather than throwing or
 * silently forking state.
 *
 * ⚠️ STORAGE KEY IS LOAD-BEARING — `@thirumanthiram_favorites` must stay
 * byte-identical or every existing user loses their favorites on upgrade.
 */
const STORAGE_KEY = '@thirumanthiram_favorites';

export interface FavoritesValue {
  favorites: number[];
  isFavorite: (verseId: number) => boolean;
  toggleFavorite: (verseId: number) => void;
  loaded: boolean;
}

interface Snapshot {
  favorites: number[];
  loaded: boolean;
}

const EMPTY: Snapshot = { favorites: [], loaded: false };

let snapshot: Snapshot = EMPTY;
let hydrated = false;
/**
 * Toggles fired before hydration finishes are queued, not applied. Applying
 * them immediately is the write-before-hydrate stomp: `prev` is still `[]`, so
 * persisting `[verseId]` wipes every stored favorite.
 */
let pendingToggles: number[] = [];

const listeners = new Set<() => void>();

function getSnapshot(): Snapshot {
  return snapshot;
}

function setSnapshot(next: Snapshot) {
  if (next === snapshot) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function persist(ids: number[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids)).catch(() => {});
}

function applyToggle(list: number[], verseId: number): number[] {
  return list.includes(verseId)
    ? list.filter((id) => id !== verseId)
    : [...list, verseId];
}

function hydrate() {
  hydrated = false;
  pendingToggles = [];
  setSnapshot(EMPTY);

  let next: number[] = [];

  AsyncStorage.getItem(STORAGE_KEY)
    .then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        // Shape validation, not just parse-safety. `JSON.parse` succeeds on
        // '"a string"' and '{"a":1}', which would leave `favorites` holding a
        // non-array while its type says number[]. isFavorite() silently returns
        // garbage (String.prototype.includes exists) and toggleFavorite's
        // .filter throws on the next tap. Anything not an array of numbers is
        // corrupt and is discarded.
        next = Array.isArray(parsed)
          ? parsed.filter((n): n is number => typeof n === 'number')
          : [];
      } catch {
        // Corrupt payload (H8) — drop it rather than wedge the app. Without
        // this guard the throw escapes the .then() and `loaded` is stranded
        // false for the whole session, which in a single shared store is a
        // GLOBAL permanent-failure mode rather than a per-screen one.
        next = [];
      }
    })
    .catch(() => {})
    .finally(() => {
      hydrated = true;
      const queued = pendingToggles;
      pendingToggles = [];
      let result = next;
      try {
        for (const verseId of queued) result = applyToggle(result, verseId);
        if (queued.length) persist(result);
      } catch {
        // Stored value was valid JSON but not an array; leave it as hydrated.
      }
      // `loaded` flips in .finally() so it flips on EVERY exit path.
      setSnapshot({ favorites: result, loaded: true });
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

function toggleFavorite(verseId: number) {
  if (!hydrated) {
    pendingToggles.push(verseId);
    return;
  }
  const next = applyToggle(snapshot.favorites, verseId);
  persist(next);
  setSnapshot({ favorites: next, loaded: snapshot.loaded });
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

function useFavoritesValue(subscribeFn: typeof subscribe): FavoritesValue {
  const snap = useSyncExternalStore(subscribeFn, getSnapshot, getSnapshot);
  const isFavorite = useCallback(
    (verseId: number) => snap.favorites.includes(verseId),
    [snap.favorites]
  );
  return {
    favorites: snap.favorites,
    isFavorite,
    toggleFavorite,
    loaded: snap.loaded,
  };
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const value = useFavoritesValue(subscribe);
  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesValue {
  const fromProvider = useContext(FavoritesContext);
  // Whether a provider is above us is fixed for a given component instance, so
  // swapping the subscribe function here never changes mid-life. With a
  // provider we re-render through Context and skip the redundant subscription;
  // without one we subscribe to the same store directly.
  const fallback = useFavoritesValue(fromProvider ? noopSubscribe : subscribe);
  return fromProvider ?? fallback;
}
