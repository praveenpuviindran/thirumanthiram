import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings, AppSettings } from '../../hooks/useSettings';

const KEY = '@thirumanthiram_settings';

// `autoPlayAudio` was removed from AppSettings/DEFAULTS by U3 (decision D1 —
// the dead toggle was deleted rather than implemented), so it is no longer part
// of the default snapshot nor of what update() persists.
const DEFAULTS = {
  showTransliteration: true,
  showEnglish: true,
  fontSizeValue: 17,
};

/**
 * Renders one independent instance of useSettings(). Each entry in `patches`
 * becomes its own pressable button (keyed by the map key) so a test can fire
 * arbitrary update() calls without the hook instance needing to know about
 * the test's intent up front.
 */
function SettingsConsumer({
  testID,
  patches = {},
}: {
  testID: string;
  patches?: Record<string, Partial<AppSettings>>;
}) {
  const { settings, update } = useSettings();
  return (
    <View testID={testID}>
      <Text testID={`${testID}-settings`}>{JSON.stringify(settings)}</Text>
      {Object.entries(patches).map(([key, patch]) => (
        <Pressable key={key} testID={`${testID}-update-${key}`} onPress={() => update(patch)}>
          <Text>update {key}</Text>
        </Pressable>
      ))}
    </View>
  );
}

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

describe('useSettings — baseline (should pass)', () => {
  it('defaults to showTransliteration:true, showEnglish:true, fontSizeValue:17', async () => {
    render(<SettingsConsumer testID="a" />);

    expect(JSON.parse(screen.getByTestId('a-settings').props.children)).toEqual(DEFAULTS);

    // Let the mount effect resolve (AsyncStorage has nothing stored) and confirm
    // defaults are still intact afterward.
    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('a-settings').props.children)).toEqual(DEFAULTS);
    });
  });

  // Doubles as the U3 no-migration check: settings written by a build that
  // still had `autoPlayAudio` hydrate cleanly, and the now-unknown key is
  // carried through the `{ ...DEFAULTS, ...parsed }` merge harmlessly rather
  // than throwing or wiping the rest of the payload. No migration required.
  it('hydrates from AsyncStorage key @thirumanthiram_settings (incl. a legacy autoPlayAudio key)', async () => {
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({ showTransliteration: false, showEnglish: false, fontSizeValue: 20, autoPlayAudio: true })
    );

    render(<SettingsConsumer testID="a" />);

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('a-settings').props.children)).toEqual({
        showTransliteration: false,
        showEnglish: false,
        fontSizeValue: 20,
        autoPlayAudio: true,
      });
    });
  });

  it('update({fontSizeValue:22}) patches state and persists it', async () => {
    render(<SettingsConsumer testID="a" patches={{ inc: { fontSizeValue: 22 } }} />);

    fireEvent.press(screen.getByTestId('a-update-inc'));

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('a-settings').props.children).fontSizeValue).toBe(22);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      KEY,
      JSON.stringify({ ...DEFAULTS, fontSizeValue: 22 })
    );
  });

  describe('legacy fontSize string -> numeric migration', () => {
    it("migrates fontSize:'small' to fontSizeValue:15 and drops the old key", async () => {
      await AsyncStorage.setItem(KEY, JSON.stringify({ fontSize: 'small', showEnglish: false }));

      render(<SettingsConsumer testID="a" />);

      await waitFor(() => {
        const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
        expect(settings.fontSizeValue).toBe(15);
      });
      const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
      expect(settings.fontSize).toBeUndefined();
      expect('fontSize' in settings).toBe(false);
    });

    it("migrates fontSize:'large' to fontSizeValue:19 and drops the old key", async () => {
      await AsyncStorage.setItem(KEY, JSON.stringify({ fontSize: 'large' }));

      render(<SettingsConsumer testID="a" />);

      await waitFor(() => {
        const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
        expect(settings.fontSizeValue).toBe(19);
      });
      const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
      expect('fontSize' in settings).toBe(false);
    });

    it("migrates any other fontSize string (e.g. 'medium') to fontSizeValue:17 and drops the old key", async () => {
      await AsyncStorage.setItem(KEY, JSON.stringify({ fontSize: 'medium' }));

      render(<SettingsConsumer testID="a" />);

      await waitFor(() => {
        const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
        expect(settings.fontSizeValue).toBe(17);
      });
      const settings = JSON.parse(screen.getByTestId('a-settings').props.children);
      expect('fontSize' in settings).toBe(false);
    });
  });
});

describe('useSettings — C2 (expected to fail today)', () => {
  it('PINS C2 — two independent consumers do not share settings; B never observes A\'s update. Expected to FAIL until a SettingsProvider exists.', async () => {
    render(
      <View>
        <SettingsConsumer testID="A" patches={{ inc: { fontSizeValue: 22 } }} />
        <SettingsConsumer testID="B" />
      </View>
    );

    fireEvent.press(screen.getByTestId('A-update-inc'));

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('A-settings').props.children).fontSizeValue).toBe(22);
    });

    // This models settings.tsx and verse/[id].tsx both holding a live
    // useSettings() instance simultaneously. B should observe A's update but
    // each hook call is an isolated useState, so B stays at the default 17.
    expect(JSON.parse(screen.getByTestId('B-settings').props.children).fontSizeValue).toBe(22);
  });
});
