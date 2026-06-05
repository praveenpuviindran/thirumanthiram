/**
 * VerseAudioPlayer — Tamil audio only.
 *
 * If verse.audioUrl is set → plays the real recording (local or remote).
 * Otherwise → uses expo-speech Tamil TTS as fallback.
 *
 * To add a real recording, set audioUrl in data/thirumanthiram.ts:
 *   Local:  audioUrl: require('../../assets/audio/thirumanthiram_0001.m4a') as any
 *   Remote: audioUrl: 'https://your-cdn.com/audio/thirumanthiram_0001.m4a'
 * Then the TTS button disappears and a real "▶ Listen" button appears instead.
 */

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useTheme } from '../../constants/Theme';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';

// Tamil verse averages ~60 chars; at rate 0.82 roughly 1 char/100ms; add generous buffer
function estimateTtsDurationMs(text: string) {
  return Math.max(10_000, (text.length / 0.82) * 80);
}

interface Props {
  tamilText: string;
  audioUrl?: string;  // if provided, plays real recording; else uses TTS
}

type State = 'idle' | 'playing';

export function VerseAudioPlayer({ tamilText, audioUrl }: Props) {
  const theme = useTheme();
  const [state, setState] = useState<State>('idle');
  const soundRef = useRef<Audio.Sound | null>(null);
  const ttsActiveRef = useRef(false);
  const ttsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Speech.stop().catch(() => {});
      if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
      soundRef.current?.stopAsync().catch(() => {});
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const stop = useCallback(async () => {
    await Speech.stop().catch(() => {});
    ttsActiveRef.current = false;
    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
    setState('idle');
  }, []);

  const handlePress = useCallback(async () => {
    if (state === 'playing') {
      await stop();
      return;
    }

    setState('playing');

    if (audioUrl) {
      // Real recording path
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          typeof audioUrl === 'string' ? { uri: audioUrl } : (audioUrl as any),
          { shouldPlay: true },
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            soundRef.current = null;
            setState('idle');
          }
        });
      } catch {
        setState('idle');
      }
    } else {
      // TTS fallback
      try {
        // Ensure audio plays even when iOS silent switch is on
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false });
      } catch { /* best-effort */ }

      ttsActiveRef.current = true;

      // Safety timeout — callbacks can silently drop on web/some browsers
      const clearTts = () => {
        if (ttsTimeoutRef.current) { clearTimeout(ttsTimeoutRef.current); ttsTimeoutRef.current = null; }
        ttsActiveRef.current = false;
      };
      ttsTimeoutRef.current = setTimeout(() => { clearTts(); setState('idle'); }, estimateTtsDurationMs(tamilText));

      Speech.speak(tamilText, {
        language: 'ta-IN',
        rate: 0.82,
        pitch: 1.0,
        onDone: () => { clearTts(); setState('idle'); },
        onStopped: () => { clearTts(); setState('idle'); },
        onError: () => { clearTts(); setState('idle'); },
      });
    }
  }, [audioUrl, state, stop, tamilText]);

  const isPlaying = state === 'playing';

  return (
    <View style={[styles.container, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
      <View style={styles.headerRow}>
        <View style={[styles.dot, { backgroundColor: Colors.saffron }]} />
        <Text style={[styles.label, { color: theme.textMuted }]}>LISTEN · தமிழ்</Text>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        {audioUrl && (
          <View style={[styles.badge, { backgroundColor: Colors.saffron + '22', borderColor: Colors.saffron + '44' }]}>
            <Text style={[styles.badgeText, { color: Colors.saffron }]}>✦ Recording</Text>
          </View>
        )}
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              borderColor: isPlaying ? Colors.saffron : theme.border,
              backgroundColor: isPlaying ? Colors.saffron + '1A' : theme.bg,
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.75}
        >
          <View style={[styles.btnIcon, { backgroundColor: isPlaying ? Colors.saffron : theme.border + '88' }]}>
            <Text style={[styles.btnIconText, { color: isPlaying ? '#FFF' : theme.textMuted }]}>
              {isPlaying ? '■' : '▶'}
            </Text>
          </View>
          <View>
            <Text style={[styles.btnLabel, { color: isPlaying ? Colors.saffron : theme.text }]}>
              {isPlaying ? 'Stop' : audioUrl ? 'Play Tamil' : 'Listen Tamil'}
            </Text>
            <Text style={[styles.btnSub, { color: theme.textMuted }]}>
              {audioUrl ? 'Tamil recording' : 'Text-to-speech · ta-IN'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {isPlaying && (
        <LinearGradient
          colors={[Colors.saffron + '00', Colors.saffron + '18']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.waveBar}
        >
          {[3,6,9,7,11,5,8,4,10,6,9,5,7,3,8,6,10,4,7,11].map((h, i) => (
            <View key={i} style={[styles.wave, { height: h * 2, opacity: 0.3 + (i % 4) * 0.15, backgroundColor: Colors.saffron }]} />
          ))}
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingTop: 11, paddingBottom: 9, gap: 6,
  },
  dot: { width: 5, height: 5, borderRadius: 99 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  line: { flex: 1, height: 1 },
  badge: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  btnRow: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: Radius.sm, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  btnIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  btnIconText: { fontSize: 10, fontWeight: '800' },
  btnLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  btnSub: { fontSize: 10, marginTop: 1 },
  waveBar: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    height: 38,
    borderTopWidth: 1, borderTopColor: 'rgba(212,112,10,0.12)',
  },
  wave: { width: 2, borderRadius: 2 },
});
