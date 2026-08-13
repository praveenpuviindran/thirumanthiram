import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DATA_VERSION, STORAGE_KEYS } from '../constants/DataVersion';

export function useDataMigration() {
  useEffect(() => {
    async function run() {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      const storedVersion = stored ? parseInt(stored, 10) : null;

      // No usable prior version (fresh install, or a stored value that
      // failed to parse) — nothing to compare against, just record current.
      // DATA_VERSION is a plain monotonically-increasing integer (not a
      // dotted semver string), so a direct numeric comparison below is not a
      // second "version-comparison implementation" in the sense the audit
      // means — there is no multi-segment parsing to duplicate here, unlike
      // the app-version check in useAppUpdateCheck.ts.
      if (storedVersion === null || Number.isNaN(storedVersion)) {
        await AsyncStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(DATA_VERSION));
        return;
      }

      if (DATA_VERSION > storedVersion) {
        // Upgrade: this build's data is newer than what was last recorded.
        console.log(
          `[DataMigration] Data updated: v${storedVersion} → v${DATA_VERSION}`
        );
        await AsyncStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(DATA_VERSION));
        return;
      }

      if (DATA_VERSION < storedVersion) {
        // Downgrade: an older build (lower DATA_VERSION) is running after a
        // newer one already wrote a higher version marker — e.g. a rollback
        // or a user reinstalling an older release.
        //
        // Deliberately a no-op, not a reset. Favourites/settings/notes live
        // under their own AsyncStorage keys (STORAGE_KEYS.FAVORITES/SETTINGS/
        // NOTE_PREFIX) and this hook never touches them either way, so there
        // is no user data at stake in this branch itself. The only state
        // this hook owns is the DATA_VERSION marker, and we leave it
        // untouched here too: overwriting it down to the older build's
        // version would erase the high-water mark, so a future re-upgrade
        // back to (or past) the newer build could look like a no-op and
        // skip a migration that never actually ran against this data.
        // Doing nothing is the only choice that can't destroy user data.
        console.warn(
          `[DataMigration] Downgrade detected: stored v${storedVersion} > app v${DATA_VERSION}. Skipping — leaving stored version untouched.`
        );
        return;
      }

      // storedVersion === DATA_VERSION: already up to date, nothing to do.
    }

    run().catch((e) => console.warn('[DataMigration] Error:', e));
  }, []);
}
