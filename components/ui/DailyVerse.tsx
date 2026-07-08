import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';
import { VERSES, TANTRAS } from '../../data/thirumanthiram';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';

interface Props {
  onPress: (verseId: number) => void;
}

export function DailyVerse({ onPress }: Props) {
  const theme = useTheme();

  const verse = useMemo(() => {
    const pool = VERSES.filter((v) => v.verseNumber <= 1842);
    const day = Math.floor(Date.now() / 86400000);
    return pool[day % pool.length];
  }, []);

  const tantra = TANTRAS.find((t) => t.id === verse.tantraId);
  const color = tantra?.color ?? Colors.saffron;

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
          {verse.verseNumber}
        </Text>

        {/* Top row */}
        <View style={styles.topRow}>
          <View style={[styles.pill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.pillText, { color }]}>✦  Verse of the Day</Text>
          </View>
          <View style={[styles.numTag, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.numTagText, { color: theme.textMuted }]}>#{verse.verseNumber}</Text>
          </View>
        </View>

        {/* Tamil lines — each rendered as exactly one visual line */}
        <View style={styles.tamilBlock}>
          {(verse.tamil ?? '').split('\n').map((line, i) => (
            <Text
              key={i}
              style={[styles.tamilLine, { color: i === 0 ? theme.text : theme.textSub }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
            >
              {line}
            </Text>
          ))}
        </View>

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
