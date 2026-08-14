import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  NotoSerifTamil_400Regular,
  NotoSerifTamil_700Bold,
} from '@expo-google-fonts/noto-serif-tamil';
import { Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { useDataMigration } from '../hooks/useDataMigration';
import { useAppUpdateCheck } from '../hooks/useAppUpdateCheck';
import { SettingsProvider } from '../contexts/SettingsContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  useDataMigration();
  useAppUpdateCheck();

  const [fontsLoaded] = useFonts({
    NotoSerifTamil_400Regular,
    NotoSerifTamil_700Bold,
    Lora_400Regular,
    Lora_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // Providers sit below the fonts gate and wrap the Stack, so they are
  // ancestors of every route. Hydration is NOT a render gate — the splash is
  // already hidden on `fontsLoaded` alone above, and a second gate would show a
  // blank frame. The stores gate their WRITES on hydration instead.
  return (
    <SettingsProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="thirumular" />
        </Stack>
      </FavoritesProvider>
    </SettingsProvider>
  );
}

// The boundary wraps RootLayoutContent from OUTSIDE, rather than sitting
// inside it around just the <Stack>. SettingsProvider and FavoritesProvider
// are ancestors of the Stack, and an error boundary only catches errors
// thrown by its descendants — a boundary placed between the providers and
// the Stack would never see a throw from either provider's own render. Fonts
// gating and the two migration/update-check hooks also run inside
// RootLayoutContent, so mounting the boundary here means it is an ancestor
// of literally everything this file renders. Deliberately a plain class
// component rather than expo-router's `export const ErrorBoundary` route
// convention: that convention scopes to a route segment and its retry
// mechanics are tied to router/navigation state, which is one more moving
// part sitting above (and potentially entangled with) the very provider
// stack we need the fallback to survive. A boundary we fully own gives
// predictable reset semantics and a fallback with no dependency on anything
// that could plausibly be what crashed.
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <RootLayoutContent />
    </ErrorBoundary>
  );
}
