import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';
import { VERSES, TANTRAS, Verse } from '../../data/thirumanthiram';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';
import { TamilVerseLines } from './TamilVerseLines';

interface Props {
  onPress: (verseId: number) => void;
}

// The Verse of the Day is only drawn from verses 0–1842.
function inDailyPool(v: Verse): boolean {
  return v.verseNumber <= 1842;
}

// Epoch day index derived from the LOCAL calendar date. `Date.now() / 86400000`
// buckets by UTC day, so e.g. India (UTC+5:30) would see the verse roll over at
// 5:30am local instead of at local midnight. Building the key from local
// year/month/day sidesteps offset and DST arithmetic entirely.
function localEpochDay(): number {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}

export function DailyVerse({ onPress }: Props) {
  const theme = useTheme();

  // The Home tab never unmounts, so a `useMemo([])` would freeze the verse for
  // the whole session. Recompute the day key whenever the app is foregrounded;
  // React bails out of the re-render when the key is unchanged.
  const [dayKey, setDayKey] = useState(localEpochDay);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') setDayKey(localEpochDay());
    });
    return () => sub.remove();
  }, []);

  const verse = useMemo(() => {
    const pool = VERSES.filter(inDailyPool);
    return pool[dayKey % pool.length];
  }, [dayKey]);

  const tantra = TANTRAS.find((t) => t.id === verse.tantraId);
  const color = tantra?.color ?? Colors.saffron;

  const tamilLineColors = useMemo(() => {
    const count = (verse.tamil ?? '').split('\n').length;
    return Array.from({ length: count }, (_, i) => (i === 0 ? theme.text : theme.textSub));
  }, [verse.tamil, theme.text, theme.textSub]);

  return (
    <TouchableOpacity
      onPress={() => onPress(verse.id)}
      activeOpacity={0.85}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={[color + '22', color + '08', theme.bgCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: color + '44' }]}
      >
        {/* Background decorative verse number */}
        <Text style={[styles.bgNum, { color }]} allowFontScaling={false}>
          {verse.verseNumber === 0 ? 'Kaapu' : verse.verseNumber}
        </Text>

        {/* Top row */}
        <View style={styles.topRow}>
          <View style={[styles.pill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.pillText, { color }]}>✦  Verse of the Day</Text>
          </View>
          <View style={[styles.numTag, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.numTagText, { color: theme.textMuted }]}>
              {verse.verseNumber === 0 ? 'Kaapu' : `#${verse.verseNumber}`}
            </Text>
          </View>
        </View>

        {/* Tamil lines */}
        <TamilVerseLines
          tamilText={verse.tamil ?? ''}
          baseFontSize={16}
          textStyle={styles.tamilLine}
          defaultColor={theme.textSub}
          lineColors={tamilLineColors}
          containerStyle={styles.tamilBlock}
          verseId={verse.id}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: color + '44' }]} />
          <Text style={[styles.dividerSymbol, { color }]}>✦</Text>
          <View style={[styles.dividerLine, { backgroundColor: color + '44' }]} />
        </View>

        {/* English */}
        <Text style={[styles.english, { color: theme.textSub }]} numberOfLines={3}>
          {verse.english}
        </Text>

        {/* Tantra badge */}
        <View style={styles.bottomRow}>
          <View style={[styles.tantraBadge, { backgroundColor: color + '18', borderColor: color + '44' }]}>
            <Text style={[styles.tantraBadgeText, { color }]}>
              Tantra {tantra?.number}  ·  {tantra?.tamilName}
            </Text>
          </View>
          <View style={[styles.readMore, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.readMoreText, { color }]}>Read ›</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#D4700A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bgNum: {
    position: 'absolute',
    fontSize: 120,
    fontWeight: '900',
    opacity: 0.04,
    right: 16,
    bottom: -10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
  },
  pillText: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  numTag: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  numTagText: { fontSize: FontSize.xs, fontWeight: '500' },
  tamilBlock: { gap: 3 },
  tamilLine: {
    lineHeight: 30,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerSymbol: { fontSize: 10, fontWeight: '700' },
  english: {
    fontSize: FontSize.sm,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tantraBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tantraBadgeText: { fontSize: FontSize.xs, fontWeight: '600', letterSpacing: 0.3 },
  readMore: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  readMoreText: { fontSize: FontSize.xs, fontWeight: '700' },
});
