import React, { useMemo } from 'react';
import {
  FlatList, View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../constants/Theme';
import { VerseCard } from '../../../components/ui/VerseCard';
import { TantraNav } from '../../../components/ui/TantraNav';
import { getTantraById, getVersesByTantra } from '../../../data/thirumanthiram';
import { useFavorites } from '../../../hooks/useFavorites';
import { Spacing, Radius, FontSize, Colors } from '../../../constants/Colors';

export default function TantraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { isFavorite } = useFavorites();

  const tantraId = Number(id);
  const tantra = useMemo(() => getTantraById(tantraId), [tantraId]);
  const verses = useMemo(() => getVersesByTantra(tantraId), [tantraId]);

  if (!tantra) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText, { color: theme.textMuted }]}>Tantra not found.</Text>
      </SafeAreaView>
    );
  }

  const color = tantra.color;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <TantraNav activeTantraId={tantraId} />

      <FlatList
        data={verses}
        keyExtractor={(v) => String(v.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* Hero gradient */}
            <LinearGradient
              colors={['#0D0603', color + 'BB', color]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.heroGradient}
            >
              {/* Decorative backdrop number */}
              <Text style={styles.heroBgNum} allowFontScaling={false}>
                {tantra.number}
              </Text>

              {/* Decorative dot pattern */}
              <View style={styles.dotPattern} pointerEvents="none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </View>

              {/* Back nav inside gradient */}
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.15)']}
                  style={styles.backChip}
                >
                  <Text style={styles.backArrow}>‹ Back</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.heroContent}>
                <View style={[styles.numBadge, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.35)' }]}>
                  <Text style={styles.numBadgeText}>
                    {tantra.number === 0 ? 'Paayiram' : `Tantra ${tantra.number}`}
                  </Text>
                </View>
                <Text style={styles.tamilName}>{tantra.tamilName}</Text>
                <Text style={styles.englishName}>{tantra.englishName}</Text>

                <View style={styles.heroOrnament}>
                  <View style={styles.heroOrnamentLine} />
                  <Text style={styles.heroOrnamentSymbol}>✦</Text>
                  <View style={styles.heroOrnamentLine} />
                </View>

                <Text style={styles.description}>{tantra.description}</Text>

                <View style={[styles.rangePill, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.35)' }]}>
                  <Text style={styles.rangeText}>
                    Verses {tantra.verseRange[0]}–{tantra.verseRange[1]}
                  </Text>
                </View>
              </View>

              {/* Bottom fade into bg */}
              <LinearGradient
                colors={['transparent', theme.bg]}
                style={styles.heroFade}
                pointerEvents="none"
              />
            </LinearGradient>

            {/* Verse count */}
            <View style={styles.countRow}>
              <View style={[styles.countDot, { backgroundColor: color }]} />
              <Text style={[styles.verseCount, { color: theme.textMuted }]}>
                {verses.length} verse{verses.length !== 1 ? 's' : ''} in this tantra
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <VerseCard
            verse={item}
            onPress={() => router.push(`/verse/${item.id}` as any)}
            isFavorite={isFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No verses loaded for this tantra yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  errorText: { padding: Spacing.lg, fontSize: FontSize.md },
  list: { paddingBottom: 48 },

  heroGradient: {
    minHeight: 340,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBgNum: {
    position: 'absolute',
    fontSize: 220,
    fontWeight: '900',
    color: '#FFFFFF',
    opacity: 0.06,
    right: -10,
    top: 20,
  },
  dotPattern: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 100,
    gap: 8,
  },
  dot: { width: 2, height: 2, borderRadius: 1, backgroundColor: '#FFFFFF', opacity: 0.2 },

  backBtn: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  backChip: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  backArrow: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: '600' },

  heroContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 60,
    gap: 8,
  },
  numBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 2,
  },
  numBadgeText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.5 },
  tamilName: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: 0.2 },
  englishName: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  heroOrnamentLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroOrnamentSymbol: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  description: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
  rangePill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  rangeText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: '600' },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 6,
  },
  countDot: { width: 5, height: 5, borderRadius: 99 },
  verseCount: { fontSize: FontSize.xs, fontStyle: 'italic' },

  empty: { padding: Spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: FontSize.sm, fontStyle: 'italic', textAlign: 'center' },
});
