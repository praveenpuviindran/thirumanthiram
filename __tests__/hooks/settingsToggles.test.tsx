import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerseScreen from '../../app/(tabs)/verse/[id]';
import SettingsScreen from '../../app/(tabs)/settings';
import { useSettings } from '../../hooks/useSettings';
import { getVerseById } from '../../data/thirumanthiram';

const SETTINGS_KEY = '@thirumanthiram_settings';

// Verse #1 (Vinayaka invocation, id 1) has an audioUrl (real recording path),
// a non-empty transliteration, and a non-empty english translation — good for
// pinning the showEnglish / showTransliteration / fontSizeValue toggles.
const VERSE_WITH_AUDIO_ID = 1;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Minimal probe that exposes the live settings snapshot as JSON. */
function SettingsProbe() {
  const { settings } = useSettings();
  return (
    <View>
      <Text testID="probe-settings">{JSON.stringify(settings)}</Text>
    </View>
  );
}

function seedSettings(overrides: Record<string, unknown>) {
  return AsyncStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({
      showEnglish: true,
      showTransliteration: true,
      fontSizeValue: 17,
      ...overrides,
    })
  );
}

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  globalThis.mockRouteParams = {};
});

describe('verse/[id].tsx — C3 dead settings toggles', () => {
  it('PINS C3 — showEnglish:false does not hide the English translation. Expected to FAIL until the setting has a consumer.', async () => {
    globalThis.mockRouteParams = { id: String(VERSE_WITH_AUDIO_ID) };
    await seedSettings({ showEnglish: false });

    render(<VerseScreen />);

    // Only the tab bar shows the literal text "English" while the tamil tab
    // is active, so this press is unambiguous.
    fireEvent.press(await screen.findByText('English'));

    const verse = getVerseById(VERSE_WITH_AUDIO_ID)!;
    // verse.english is rendered as ONE multi-line Text node (verse/[id].tsx:279-281),
    // so we match a substring via regex rather than an exact full-string query.
    const englishSnippet = verse.english.split('\n')[0];
    const englishMatcher = new RegExp(escapeRegExp(englishSnippet));

    // Desired: with showEnglish:false, the English section should not render.
    // Actual: verse/[id].tsx:274-282 renders it unconditionally — settings
    // never gate this section at all.
    await waitFor(() => {
      expect(screen.queryByText(englishMatcher)).toBeNull();
    });
  });

  it('PINS C3 — showTransliteration:false does not hide the transliteration. Expected to FAIL until the setting has a consumer.', async () => {
    globalThis.mockRouteParams = { id: String(VERSE_WITH_AUDIO_ID) };
    await seedSettings({ showTransliteration: false });

    render(<VerseScreen />);

    fireEvent.press(await screen.findByText('English'));

    const verse = getVerseById(VERSE_WITH_AUDIO_ID)!;
    // Same multi-line-single-Text-node situation as English above.
    const translitSnippet = verse.transliteration.split('\n')[0];
    const translitMatcher = new RegExp(escapeRegExp(translitSnippet));

    // Desired: with showTransliteration:false, the transliteration section
    // should not render. Actual: verse/[id].tsx:260 gates only on
    // `verse.transliteration ? … : null` — the setting is never consulted.
    await waitFor(() => {
      expect(screen.queryByText(translitMatcher)).toBeNull();
    });
  });

  // REPLACES the former "PINS C3 — autoPlayAudio:true does not start playback
  // on mount" test. That pin demanded autoPlayAudio be *implemented*; decision
  // D1 removed the feature instead, so the pin was asserting toward an outcome
  // that will never arrive. It is replaced by its inverse: the setting must be
  // absent from the settings surface, both in the UI and in the store defaults.
  it('C3 RESOLVED BY REMOVAL — autoPlayAudio is gone from the settings surface', async () => {
    render(<SettingsScreen />);

    // No switch, no row, no section.
    expect(screen.queryByText('Auto-Play Audio')).toBeNull();
    expect(screen.queryByText('Play recitation when opening a verse')).toBeNull();
    expect(screen.queryByText('Audio')).toBeNull();

    // And the key is absent from the hydrated store defaults, so nothing can
    // read or re-persist it on a fresh install.
    render(<SettingsProbe />);
    await waitFor(() => {
      expect(screen.getByTestId('probe-settings').props.children).toBeTruthy();
    });
    const settings = JSON.parse(screen.getByTestId('probe-settings').props.children);
    expect('autoPlayAudio' in settings).toBe(false);
    expect(settings).toEqual({
      showTransliteration: true,
      showEnglish: true,
      fontSizeValue: 17,
    });
  });

  it('SHOULD PASS in isolation — fontSizeValue is wired: the Tamil text style reflects the seeded value', async () => {
    globalThis.mockRouteParams = { id: String(VERSE_WITH_AUDIO_ID) };
    await seedSettings({ fontSizeValue: 22 });

    render(<VerseScreen />);

    const verse = getVerseById(VERSE_WITH_AUDIO_ID)!;
    const firstTamilLine = verse.tamil.split('\n')[0];

    // Single-consumer scenario: this passes because nothing else in this test
    // holds a competing useSettings() instance. In the real app, C2 (no
    // shared settings store) means a font-size change made on the Settings
    // tab won't reach this already-mounted verse screen — this test does NOT
    // exercise that cross-screen failure, only that fontSizeValue itself is
    // read and applied when a single hook instance has it.
    await waitFor(() => {
      const el = screen.getByText(firstTamilLine);
      const flat = StyleSheet.flatten(el.props.style);
      expect(flat.fontSize).toBe(22);
    });
  });
});
