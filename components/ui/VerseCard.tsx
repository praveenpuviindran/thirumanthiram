import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../constants/Theme';
import { Verse, TANTRAS } from '../../data/thirumanthiram';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';

interface Props {
  verse: Verse;
  onPress: () => void;
  isFavorite: boolean;
  showTantraLabel?: boolean;
}

export function VerseCard({ verse, onPress, isFavorite, showTantraLabel }: Props) {
  const theme = useTheme();
  const tantra = TANTRAS.find((t) => t.id === verse.tantraId);
  const color = tantra?.color ?? Colors.saffron;

  // Show all Tamil lines
  const tamilPreview = verse.tamil;
  // Show first sentence of English
  const englishPreview = verse.english ? verse.english.split('.')[0] + '.' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
    >
      <View style={styles.header}>
        <View style={[styles.numBadge, { backgroundColor: color + '28' }]}>
          <Text style={[styles.numText, { color }]}>
            {verse.verseNumber === 0 ? 'Kaapu' : verse.verseNumber}
          </Text>
        </View>

        {showTantraLabel && tantra && (
          <Text style={[styles.tantraLabel, { color: theme.textMuted }]}>
            {tantra.englishName}
          </Text>
        )}

        {isFavorite && (
          <Text style={styles.star}>★</Text>
        )}
      </View>

      <View style={styles.tamilLines}>
        {tamilPreview.split('\n').map((line, i) => (
          <Text key={i} style={[styles.tamil, { color: theme.text }]}>{line}</Text>
        ))}
      </View>
      <Text style={[styles.english, { color: theme.textSub }]} numberOfLines={2}>
        {englishPreview}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderWidth: 1,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  numBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  numText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  tantraLabel: {
    fontSize: FontSize.xs,
    flex: 1,
    fontStyle: 'italic',
  },
  star: {
    color: '#D4A017',
    fontSize: FontSize.md,
  },
  tamilLines: {
    gap: 2,
  },
  tamil: {
    fontSize: FontSize.md,
    lineHeight: 26,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  english: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
