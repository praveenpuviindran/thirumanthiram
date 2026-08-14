import React from 'react';
import {
  ScrollView, View, Text, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';
import { DailyVerse } from '../../components/ui/DailyVerse';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { TANTRAS } from '../../data/thirumanthiram';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';

const ORNAMENT = '✦';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const stats = [
    { label: 'Tantras', value: '9', sub: 'Books' },
    { label: 'Verses', value: '3,048', sub: 'Hymns' },
    { label: 'Years Old', value: '~7,000', sub: 'Ancient' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero ───────────────────────────────────────── */}
        <LinearGradient
          colors={['#1A0800', '#3D1400', '#6B2800', '#8B4000']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.hero}
        >
          {/* Decorative backdrop OM symbol */}
          <Text style={styles.heroOm} allowFontScaling={false}>ॐ</Text>

          {/* Decorative dots grid */}
          <View style={styles.dotGrid} pointerEvents="none">
            {Array.from({ length: 24 }).map((_, i) => (
              <View key={i} style={styles.dotGridDot} />
            ))}
          </View>

          <View style={styles.heroInner}>
            <View style={[styles.heroBadge, { borderColor: Colors.saffron + '99', backgroundColor: Colors.saffron + '18' }]}>
              <Text style={[styles.heroBadgeText, { color: Colors.saffronLight }]}>
                {ORNAMENT}  திருமந்திரம்  {ORNAMENT}
              </Text>
            </View>

            <Text style={styles.heroTitle}>Thirumanthiram</Text>

            <View style={styles.heroOrnament}>
              <View style={styles.heroOrnamentLine} />
              <Text style={styles.heroOrnamentSymbol}>✦</Text>
              <View style={styles.heroOrnamentLine} />
            </View>

            <Text style={styles.heroSub}>
              The Sacred 3,048 Verses of Thirumoolar
            </Text>
            <Text style={styles.heroAuthor}>Shaiva · Yogic · Agamic · Tamil</Text>
          </View>

          {/* Bottom fade */}
          <LinearGradient
            colors={['transparent', theme.bg]}
            style={styles.heroFade}
            pointerEvents="none"
          />
        </LinearGradient>

        {/* ── Stats row ────────────────────────────────────── */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <LinearGradient
              key={s.label}
              colors={theme.dark
                ? ['#241610', '#1A0E08']
                : ['#FDF6EE', '#F5EDE0']}
              style={[styles.statCard, { borderColor: theme.border }]}
            >
              <Text style={[styles.statValue, { color: theme.saffron }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>{s.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* ── Ornamental Divider ───────────────────────────── */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerSymbol, { color: theme.saffron }]}>✦ ✦ ✦</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        {/* ── Daily Verse ──────────────────────────────────── */}
        <SectionHeader title="Verse of the Day" subtitle="திருமந்திர பாடல்" />
        <DailyVerse onPress={(id) => router.navigate(`/(tabs)/verse/${id}` as any)} />

        {/* ── Browse Tantras ───────────────────────────────── */}
        <SectionHeader title="Browse Chapters" subtitle="தந்திரங்கள்" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tantraScroll}
        >
          {TANTRAS.map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => router.navigate(`/(tabs)/tantra/${t.id}` as any)}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={[t.color + '28', t.color + '0A']}
                style={[styles.tantraChip, { borderColor: t.color + '55' }]}
              >
                <View style={[styles.tantraChipNum, { backgroundColor: t.color + '22' }]}>
                  <Text style={[styles.tantraChipNumText, { color: t.color }]}>
                    {t.number}
                  </Text>
                </View>
                <Text style={[styles.tantraChipTamil, { color: theme.text }]} numberOfLines={1}>
                  {t.tamilName}
                </Text>
                <Text style={[styles.tantraChipEn, { color: theme.textSub }]} numberOfLines={2}>
                  {t.englishName}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── About the Author ─────────────────────────────── */}
        <SectionHeader title="About the Author" subtitle="ஆசிரியர் பற்றி" />
        <TouchableOpacity
          onPress={() => router.push('/thirumular' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.dark
              ? ['#2A1200', '#1A0D06', '#0D0603']
              : ['#FDF0E0', '#F5E8D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.thirumularCard, { borderColor: Colors.saffron + '44' }]}
          >
            {/* Decorative OM backdrop in card */}
            <Text style={styles.cardOm} allowFontScaling={false}>ॐ</Text>

            <View style={[styles.thirumularIconBox, { backgroundColor: Colors.saffron + '22', borderColor: Colors.saffron + '44' }]}>
              <Text style={styles.thirumularIcon}>🔱</Text>
            </View>
            <View style={styles.thirumularBody}>
              <Text style={[styles.thirumularName, { color: theme.text }]}>Thirumoolar</Text>
              <Text style={[styles.thirumularTamil, { color: Colors.saffron }]}>திருமூலர்</Text>
              <Text style={[styles.thirumularSub, { color: theme.textSub }]}>
                Siddhar · One of the 18 Siddhars · Author of the Thirumanthiram
              </Text>
            </View>
            <View style={[styles.thirumularArrowBox, { backgroundColor: Colors.saffron + '18', borderColor: Colors.saffron + '44' }]}>
              <Text style={[styles.thirumularArrow, { color: Colors.saffron }]}>›</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── About the Text ────────────────────────────────── */}
        <SectionHeader title="About the Text" />
        <LinearGradient
          colors={theme.dark
            ? ['#1E1008', '#150B04']
            : ['#FDF6EE', '#F5EDE0']}
          style={[styles.aboutCard, { borderColor: theme.border }]}
        >
          <Text style={[styles.aboutQuote, { color: Colors.saffron + '44' }]}>"</Text>
          <Text style={[styles.aboutText, { color: theme.textSub }]}>
            Thirumanthiram (திருமந்திரம்) is an ancient Tamil scripture of 3,048 verses
            by the Siddhar-Yogi Thirumoolar, one of the 18 Siddhars. It forms the{' '}
            <Text style={{ color: Colors.saffron, fontWeight: '600' }}>tenth Tirumurai</Text>
            {' '}— the sacred Shaiva canon.
            {'\n\n'}
            The text spans Yoga, Tantra, Shaiva philosophy, and devotion — uniting
            Vedic and Agamic traditions through direct experience and revelation.
          </Text>
          <View style={[styles.aboutDivider, { backgroundColor: Colors.saffron + '33' }]} />
          <Text style={[styles.aboutAttrib, { color: Colors.saffron }]}>— Thirumoolar, c. 2nd century CE</Text>
        </LinearGradient>

        {/* ── Creator Footer ─────────────────────────────────── */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Text style={[styles.footerSymbol, { color: Colors.saffron + '66' }]}>✦</Text>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>Created by</Text>
          <Text style={[styles.footerName, { color: Colors.saffron }]}>Praveen Puviindran, Latha Ravendran & Vijitha Puviindran</Text>
          <Text style={[styles.footerSymbol, { color: Colors.saffron + '66' }]}>✦</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 40 },

  /* Hero */
  hero: {
    minHeight: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  heroOm: {
    position: 'absolute',
    fontSize: 260,
    lineHeight: 260,
    color: '#FFFFFF',
    opacity: 0.04,
    right: -20,
    top: -20,
  },
  dotGrid: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 120,
    gap: 8,
  },
  dotGridDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.12,
  },
  heroInner: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: 60,
    alignItems: 'center',
  },
  heroBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: Spacing.md,
  },
  heroBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#F5ECD8',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 180,
    marginVertical: 12,
    gap: 8,
  },
  heroOrnamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.saffron + '55',
  },
  heroOrnamentSymbol: {
    color: Colors.saffron,
    fontSize: 12,
  },
  heroSub: {
    color: '#C8A878',
    fontSize: FontSize.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroAuthor: {
    color: Colors.saffron + '99',
    fontSize: FontSize.xs,
    letterSpacing: 2,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginTop: -Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 2,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },

  /* Ornamental divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerSymbol: { fontSize: 10, letterSpacing: 4 },

  /* Tantra chips */
  tantraScroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  tantraChip: {
    width: 140,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 5,
  },
  tantraChipNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tantraChipNumText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  tantraChipTamil: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  tantraChipEn: {
    fontSize: FontSize.xs,
    lineHeight: 17,
  },

  /* Thirumular card */
  thirumularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  cardOm: {
    position: 'absolute',
    fontSize: 120,
    lineHeight: 120,
    color: '#FFFFFF',
    opacity: 0.03,
    right: 10,
    top: -10,
  },
  thirumularIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  thirumularIcon: { fontSize: 26 },
  thirumularBody: { flex: 1, gap: 2 },
  thirumularName: { fontSize: FontSize.lg, fontWeight: '800' },
  thirumularTamil: { fontSize: FontSize.sm, fontWeight: '600', letterSpacing: 0.5 },
  thirumularSub: { fontSize: FontSize.xs, lineHeight: 17, marginTop: 2 },
  thirumularArrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  thirumularArrow: { fontSize: 20, fontWeight: '300', marginTop: -2 },

  /* About card */
  aboutCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  aboutQuote: {
    fontSize: 72,
    lineHeight: 60,
    fontWeight: '900',
    marginBottom: -16,
  },
  aboutText: {
    fontSize: FontSize.sm,
    lineHeight: 23,
  },
  aboutDivider: {
    height: 1,
    marginVertical: 4,
    opacity: 0.6,
  },
  aboutAttrib: {
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'right',
  },

  /* Footer */
  footer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  footerSymbol: { fontSize: 10, letterSpacing: 4 },
  footerText: { fontSize: FontSize.xs, letterSpacing: 1 },
  footerName: { fontSize: FontSize.sm, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
});
