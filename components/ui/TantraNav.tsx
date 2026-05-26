import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';
import { TANTRAS } from '../../data/thirumanthiram';
import { Spacing, Radius, FontSize } from '../../constants/Colors';

interface Props {
  activeTantraId?: number;
}

export function TantraNav({ activeTantraId }: Props) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.bgCard, borderBottomColor: theme.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {TANTRAS.map((t) => {
          const isActive = t.id === activeTantraId;
          return (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? t.color + '28' : 'transparent',
                  borderColor: isActive ? t.color : theme.border,
                },
              ]}
              onPress={() => router.push(`/tantra/${t.id}` as any)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipNum, { color: t.color }]}>{t.number}</Text>
              <Text style={[styles.chipName, { color: isActive ? t.color : theme.textSub }]} numberOfLines={1}>
                {t.tamilName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipNum: { fontSize: 11, fontWeight: '800' },
  chipName: { fontSize: FontSize.xs, fontWeight: '600', maxWidth: 90 },
});
