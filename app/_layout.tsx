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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
