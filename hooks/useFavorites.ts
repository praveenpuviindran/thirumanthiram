// Re-export shim. The implementation moved to contexts/FavoritesContext.tsx so
// all six runtime call sites (and the type-only reference in settings.tsx) keep
// their existing import path and return shape unchanged.
export { useFavorites, FavoritesProvider } from '../contexts/FavoritesContext';
export type { FavoritesValue } from '../contexts/FavoritesContext';
