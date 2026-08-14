import React from 'react';
import { View, Text } from 'react-native';
import { render, screen, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../../hooks/useFavorites';
import { useSettings } from '../../hooks/useSettings';

const FAV_KEY = '@thirumanthiram_favorites';
const SETTINGS_KEY = '@thirumanthiram_settings';

// `autoPlayAudio` was removed from AppSettings/DEFAULTS by U3 (decision D1 —
// the dead toggle was deleted rather than implemented), so it is no longer part
// of the default snapshot.
const DEFAULT_SETTINGS = {
  showTransliteration: true,
  showEnglish: true,
  fontSizeValue: 17,
};

function FavoritesProbe({ testID }: { testID: string }) {
  const { favorites, loaded } = useFavorites();
  return (
    <View testID={testID}>
      <Text testID={`${testID}-loaded`}>{String(loaded)}</Text>
      <Text testID={`${testID}-favorites`}>{JSON.stringify(favorites)}</Text>
    </View>
  );
}

function SettingsProbe({ testID }: { testID: string }) {
  const { settings } = useSettings();
  return (
    <View testID={testID}>
      <Text testID={`${testID}-settings`}>{JSON.stringify(settings)}</Text>
    </View>
  );
}

/**
 * Flushes pending microtasks/macrotasks so an in-flight promise chain (e.g.
 * the hook's AsyncStorage.getItem().then(...)) gets a chance to settle —
 * including, if unguarded, to throw and produce an unhandled rejection.
 */
async function flush(ms = 50) {
  await act(async () => {
    await new Promise((r) => setTimeout(r, ms));
  });
}

// NOTE on unhandled-rejection capture: a manual `process.on('unhandledRejection', ...)`
// listener registered from inside a test body does NOT reliably observe the
// rejection produced by the hooks' unguarded JSON.parse in this Jest/RN
// environment (verified empirically — the listener fires 0 times). What DOES
// reliably surface it is Jest's own internal detection: every test below that
// triggers the throw gets an extra "SyntaxError: Expected property name or
// '}' in JSON..." failure block attached to it by Jest itself, independent of
// (and in addition to) whatever this file's own `expect()` calls determine.
// That is the reliable capture mechanism available here — see the per-test
// comments for how that interacts with each assertion.

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

describe('useFavorites — H8 unguarded JSON.parse (corrupt storage)', () => {
  it('PINS H8 — desired: loaded should become true even when stored JSON is corrupt. Expected to FAIL until the parse is try/catch\'d.', async () => {
    await AsyncStorage.setItem(FAV_KEY, '{invalid');

    render(<FavoritesProbe testID="a" />);

    // Desired behavior: the hook should degrade gracefully (empty favorites,
    // loaded still flips true) instead of the parse throwing inside the
    // unguarded .then() at useFavorites.ts:12-13, which today prevents
    // setLoaded(true) at :13 from ever running.
    await waitFor(
      () => {
        expect(screen.getByTestId('a-loaded').props.children).toBe('true');
      },
      { timeout: 2000 }
    );
  });

  it('documents CURRENT behavior — corrupt favorites JSON degrades to an empty, loaded list (was: loaded stranded false forever)', async () => {
    await AsyncStorage.setItem(FAV_KEY, '{invalid');

    render(<FavoritesProbe testID="a" />);
    await flush();

    // UPDATED BY U2 (H8 fix). Before the fix this asserted 'false': the
    // unguarded JSON.parse at useFavorites.ts:12 threw before setLoaded(true)
    // at :13 could run, stranding `loaded` false for the whole session, and
    // the escaping rejection contaminated other tests in this file via Jest's
    // unhandled-rejection detection. The parse is now try/catch'd and
    // `loaded` flips in a .finally(), so it flips on every exit path. This is
    // the clean inversion the original comment predicted — the assertion is
    // flipped rather than removed so the pin still covers the behavior.
    expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    expect(screen.getByTestId('a-favorites').props.children).toBe('[]');
  });

  it('SHOULD PASS — getItem resolving null (fresh install) hydrates to an empty, loaded list', async () => {
    // AsyncStorage.clear() in beforeEach already leaves the key unset.
    render(<FavoritesProbe testID="a" />);
    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });
    expect(screen.getByTestId('a-favorites').props.children).toBe('[]');
  });

  it('SHOULD PASS — getItem resolving "[]" hydrates to an empty, loaded list', async () => {
    await AsyncStorage.setItem(FAV_KEY, '[]');
    render(<FavoritesProbe testID="a" />);
    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });
    expect(screen.getByTestId('a-favorites').props.children).toBe('[]');
  });

  it('REGRESSION H8: valid JSON of the wrong shape (a string) is rejected, not stored verbatim', async () => {
    // Previously there was no shape validation: JSON.parse succeeded, so the
    // throw-guard never fired and `favorites` ended up holding a string while
    // its type claimed number[]. isFavorite() silently returned garbage
    // (String.prototype.includes exists) and toggleFavorite's .filter would
    // throw on the next tap. A non-array payload is corrupt — discard it.
    await AsyncStorage.setItem(FAV_KEY, '"a string"');
    render(<FavoritesProbe testID="a" />);
    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });
    expect(screen.getByTestId('a-favorites').props.children).toBe('[]');
  });

  it('REGRESSION H8: valid JSON of the wrong shape (an object) is rejected, not stored verbatim', async () => {
    await AsyncStorage.setItem(FAV_KEY, '{"a":1}');
    render(<FavoritesProbe testID="a" />);
    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });
    expect(screen.getByTestId('a-favorites').props.children).toBe('[]');
  });

  it('REGRESSION H8: an array containing non-numbers keeps only the numeric ids', async () => {
    await AsyncStorage.setItem(FAV_KEY, '[1,"two",3,null,{"x":1},5]');
    render(<FavoritesProbe testID="a" />);
    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });
    expect(screen.getByTestId('a-favorites').props.children).toBe('[1,3,5]');
  });
});

describe('useSettings — H8 unguarded JSON.parse (corrupt storage)', () => {
  it('PINS H8 — desired: settings retain defaults AND no unhandled rejection occurs on corrupt settings JSON. Expected to FAIL until the parse is try/catch\'d.', async () => {
    await AsyncStorage.setItem(SETTINGS_KEY, '{invalid');

    render(<SettingsProbe testID="a" />);
    await flush();

    // The defaults-retained half of this assertion already holds true today
    // (setSettings never runs after the throw at useSettings.ts:30). The
    // "no unhandled rejection" half is what's actually broken — Jest's own
    // unhandled-rejection detection attaches a
    // "SyntaxError: Expected property name or '}' in JSON" failure to this
    // test (see file-level NOTE above), which is what makes this test FAIL
    // today even though the explicit expect() below passes.
    expect(JSON.parse(screen.getByTestId('a-settings').props.children)).toEqual(DEFAULT_SETTINGS);
  });

  it('documents CURRENT behavior — settings silently stay at defaults on corrupt settings JSON (parse throws before setSettings runs)', async () => {
    await AsyncStorage.setItem(SETTINGS_KEY, '{invalid');

    render(<SettingsProbe testID="a" />);
    await flush();

    // True today, and will remain true after the H8 fix too (a try/catch'd
    // parse failure should still leave settings at defaults) — so unlike the
    // useFavorites pair, this half doesn't invert on fix. What DOES invert is
    // the contamination described above: this test fails today only because
    // of the unhandled rejection, and will report clean once H8 is fixed.
    expect(JSON.parse(screen.getByTestId('a-settings').props.children)).toEqual(DEFAULT_SETTINGS);
  });

  it('SHOULD PASS — getItem resolving null (fresh install) hydrates to defaults', async () => {
    render(<SettingsProbe testID="a" />);
    await flush();
    expect(JSON.parse(screen.getByTestId('a-settings').props.children)).toEqual(DEFAULT_SETTINGS);
  });

  it('characterizes: valid JSON of the wrong shape is merged in with no validation', async () => {
    // No shape validation in useSettings either — `{ ...DEFAULTS, ...parsed }`
    // happily spreads garbage keys/values on top of the defaults.
    await AsyncStorage.setItem(SETTINGS_KEY, '{"a":1}');
    render(<SettingsProbe testID="a" />);
    await waitFor(() => {
      const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
      expect(settings.a).toBe(1);
    });
    const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
    expect(settings).toEqual({ ...DEFAULT_SETTINGS, a: 1 });
  });
});
