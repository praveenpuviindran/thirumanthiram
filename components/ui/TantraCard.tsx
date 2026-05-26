import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../constants/Theme';
import { Tantra } from '../../data/thirumanthiram';
import { Spacing, Radius, FontSize } from '../../constants/Colors';

interface Props {
  tantra: Tantra;
  onPress: () => void;
}

export function TantraCard({ tantra, onPress }: Props) {
  const theme = useTheme();
  const color = tantra.color;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
    >
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: color }]} />

      <View style={styles.body}>
        {/* Tantra number badge */}
        <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
          <Text style={[styles.badgeText, { color }]}>Tantra {tantra.number}</Text>
        </View>

        <Text style={[styles.tamilName, { color: theme.text }]}>{tantra.tamilName}</Text>
        <Text style={[styles.englishName, { color }]}>{tantra.englishName}</Text>
        <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={2}>
          {tantra.description}
        </Text>

        {/* Verse range */}
        <View style={styles.footer}>
          <Text style={[styles.range, { color: theme.textSub }]}>
            Verses {tantra.verseRange[0]}–{tantra.verseRange[1]}
          </Text>
          <Text style={[styles.arrow, { color }]}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: Spacing.md,
    gap: 5,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tamilName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  englishName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: FontSize.xs,
    lineHeight: 18,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  range: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 22,
    fontWeight: '300',
  },
});
