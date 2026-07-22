import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BUNDLE_ID = 'com.praveenpuviindran.thirumanthiram';
const APP_STORE_ID = '6773450695';
const DISMISSED_KEY = 'update_check_dismissed_version';

function isNewer(latest: string, current: string): boolean {
  const parse = (v: string) => v.split('.').map(Number);
  const [la, lb, lc] = parse(latest);
  const [ca, cb, cc] = parse(current);
  return la > ca || (la === ca && lb > cb) || (la === ca && lb === cb && lc > cc);
}

export function useAppUpdateCheck() {
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    async function check() {
      try {
        const current = Constants.expoConfig?.version ?? '0.0.0';
        const res = await fetch(
          `https://itunes.apple.com/lookup?bundleId=${BUNDLE_ID}&country=us`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        const latest: string = data.results?.[0]?.version;
        if (!latest || !isNewer(latest, current)) return;

        const dismissed = await AsyncStorage.getItem(DISMISSED_KEY);
        if (dismissed === latest) return;

        Alert.alert(
          'Update Available',
          `Version ${latest} is now available in the App Store.`,
          [
            {
              text: 'Later',
              style: 'cancel',
              onPress: () => AsyncStorage.setItem(DISMISSED_KEY, latest),
            },
            {
              text: 'Update Now',
              onPress: () => {
                AsyncStorage.setItem(DISMISSED_KEY, latest);
                Linking.openURL(`https://apps.apple.com/app/id${APP_STORE_ID}`);
              },
            },
          ]
        );
      } catch {
        // Non-critical — silently ignore network failures
      }
    }

    check();
  }, []);
}
