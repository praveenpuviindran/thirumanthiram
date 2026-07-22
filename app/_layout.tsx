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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="thirumular" />
    </Stack>
  );
}
