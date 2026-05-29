import React, { useMemo } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../constants/Theme';
import { VerseAudioPlayer } from '../../../components/ui/VerseAudioPlayer';
import { getVerseById, getTantraById, VERSES } from '../../../data/thirumanthiram';
import { useFavorites } from '../../../hooks/useFavorites';
import { useSettings } from '../../../hooks/useSettings';
import { Spacing, Radius, FontSize, Colors } from '../../../constants/Colors';

export default function VerseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings } = useSettings();

  const verseId = Number(id);
  const verse = useMemo(() => getVerseById(verseId), [verseId]);
  const tantra = useMemo(() => verse ? getTantraById(verse.tantraId) : undefined, [verse]);

  const idx = useMemo(() => VERSES.findIndex((v) => v.id === verseId), [verseId]);
  const prevVerse = idx > 0 ? VERSES[idx - 1] : null;
  const nextVerse = idx < VERSES.length - 1 ? VERSES[idx + 1] : null;
  if (!verse) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText, { color: theme.textMuted }]}>Verse not found.</Text>
      </SafeAreaView>
    );
  }

  const color = tantra?.color ?? Colors.saffron;
  const favorite = isFavorite(verse.id);
  const fontSize = settings.fontSize === 'small' ? 15 : settings.fontSize === 'large' ? 19 : 17;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <LinearGradient
        colors={theme.dark
          ? [color + '28', color + '00']
          : [color + '18', color + '00']}
        style={[styles.header, { borderBottomColor: color + '33' }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backArrow, { color }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.verseNum, { color }]}>
            {verse.verseNumber === 0 ? 'Kaapu' : `#${verse.verseNumber}`}
          </Text>
          {tantra && (
            <Text style={[styles.tantraLabel, { color: theme.textMuted }]}>
              {tantra.tamilName}  ·  {tantra.englishName}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(verse.id)} hitSlop={8}>
          <Text style={[styles.starBtn, { color: favorite ? Colors.gold : theme.textMuted }]}>
            {favorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Tamil card — hero of the verse */}
        <LinearGradient
          colors={theme.dark
            ? [color + '30', color + '10', theme.bgCard]
            : [color + '18', color + '06', theme.bgCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.tamilCard, { borderColor: color + '55' }]}
        >
          {/* Large background verse number */}
          <Text style={[styles.bgVerseNum, { color }]} allowFontScaling={false}>
            {verse.verseNumber === 0 ? '✦' : verse.verseNumber}
          </Text>

          <View style={styles.tamilCardHeader}>
            <View style={[styles.tamilPill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
              <Text style={[styles.tamilPillText, { color }]}>Tamil  ·  தமிழ்</Text>
            </View>
          </View>

          <View style={styles.tamilLines}>
            {(verse.tamil ?? '').split('\n').map((line, i) => (
              <Text
                key={i}
                style={[styles.tamilText, { color: theme.text, fontSize }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
                allowFontScaling
              >
                {line}
              </Text>
            ))}
          </View>

          <View style={styles.tamilOrnament}>
            <View style={[styles.ornamentLine, { backgroundColor: color + '44' }]} />
            <Text style={[styles.ornamentStar, { color }]}>✦</Text>
            <View style={[styles.ornamentLine, { backgroundColor: color + '44' }]} />
          </View>
        </LinearGradient>

        {/* Transliteration */}
        {settings.showTransliteration && (
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionLabel, { color }]}>Transliteration</Text>
              <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Roman script</Text>
            </View>
            <Text style={[styles.translitText, { color: theme.textSub, fontSize: fontSize - 1 }]}>
              {verse.transliteration}
            </Text>
          </View>
        )}

        {/* English */}
        {settings.showEnglish && (
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionLabel, { color }]}>English</Text>
              <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Translation</Text>
            </View>
            <Text style={[styles.englishText, { color: theme.textSub, fontSize: fontSize - 1 }]}>
              {verse.english}
            </Text>
          </View>
        )}

        {/* Elaboration — Tamil */}
        {verse.elaborationTamil && (
          <LinearGradient
            colors={[color + '18', color + '06']}
            style={[styles.elaborationCard, { borderColor: color + '33' }]}
          >
            <View style={[styles.elaborationPill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
              <Text style={[styles.elaborationPillText, { color }]}>✦ விளக்கம்</Text>
            </View>
            <Text style={[styles.elaborationText, styles.tamilBody, { color: theme.textSub, fontSize: fontSize - 1 }]}>
              {verse.elaborationTamil}
            </Text>
          </LinearGradient>
        )}

        {/* Elaboration — English */}
        {verse.elaborationEnglish && settings.showEnglish && (
          <LinearGradient
            colors={[color + '14', color + '04']}
            style={[styles.elaborationCard, { borderColor: color + '2A' }]}
          >
            <View style={[styles.elaborationPill, { backgroundColor: color + '20', borderColor: color + '44' }]}>
              <Text style={[styles.elaborationPillText, { color }]}>✦ Commentary</Text>
            </View>
            <Text style={[styles.elaborationText, { color: theme.textSub, fontSize: fontSize - 1 }]}>
              {verse.elaborationEnglish}
            </Text>
          </LinearGradient>
        )}

        {/* Listen */}
        <VerseAudioPlayer
          tamilText={verse.tamil}
          audioUrl={verse.audioUrl}
        />

        {/* Tantra info */}
        {tantra && (
          <TouchableOpacity
            onPress={() => router.push(`/tantra/${tantra.id}` as any)}
            activeOpacity={0.75}
          >
            <LinearGradient
              colors={[color + '28', color + '0A']}
              style={[styles.tantraCard, { borderColor: color + '55' }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.tantraCardTitle, { color }]}>
                  {tantra.number === 0 ? 'Paayiram' : `Tantra ${tantra.number}`}  ·  {tantra.tamilName}
                </Text>
                <Text style={[styles.tantraCardSub, { color: theme.textSub }]}>
                  {tantra.englishName}
                </Text>
                <Text style={[styles.tantraCardDesc, { color: theme.textMuted }]} numberOfLines={2}>
                  {tantra.description}
                </Text>
              </View>
              <View style={[styles.chevronBox, { backgroundColor: color + '22', borderColor: color + '55' }]}>
                <Text style={[styles.chevron, { color }]}>›</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Prev / Next */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              { backgroundColor: theme.bgCard, borderColor: theme.border },
              !prevVerse && styles.navBtnDisabled,
            ]}
            onPress={() => prevVerse && router.replace(`/verse/${prevVerse.id}` as any)}
            disabled={!prevVerse}
            activeOpacity={0.75}
          >
            <Text style={[styles.navBtnText, { color: prevVerse ? color : theme.textMuted }]}>
              ‹ Prev
            </Text>
            {prevVerse && (
              <Text style={[styles.navBtnSub, { color: theme.textMuted }]}>
                #{prevVerse.verseNumber}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.navBtnRight,
              { backgroundColor: theme.bgCard, borderColor: theme.border },
              !nextVerse && styles.navBtnDisabled,
            ]}
            onPress={() => nextVerse && router.replace(`/verse/${nextVerse.id}` as any)}
            disabled={!nextVerse}
            activeOpacity={0.75}
          >
            {nextVerse && (
              <Text style={[styles.navBtnSub, { color: theme.textMuted }]}>
                #{nextVerse.verseNumber}
              </Text>
            )}
            <Text style={[styles.navBtnText, { color: nextVerse ? color : theme.textMuted }]}>
              Next ›
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  errorText: { padding: Spacing.lg, fontSize: FontSize.md },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: { minWidth: 60 },
  backArrow: { fontSize: FontSize.md, fontWeight: '600' },
  headerCenter: { flex: 1, alignItems: 'center' },
  verseNum: { fontSize: FontSize.lg, fontWeight: '800' },
  tantraLabel: { fontSize: FontSize.xs, marginTop: 1 },
  starBtn: { fontSize: 26, minWidth: 36, textAlign: 'right' },

  scroll: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 48 },

  /* Tamil hero card */
  tamilCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  bgVerseNum: {
    position: 'absolute',
    fontSize: 130,
    fontWeight: '900',
    opacity: 0.06,
    right: 12,
    bottom: -10,
  },
  tamilCardHeader: { flexDirection: 'row' },
  tamilPill: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tamilPillText: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 1 },
  tamilLines: { gap: 4 },
  tamilText: {
    lineHeight: 28,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  tamilOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  ornamentLine: { flex: 1, height: 1 },
  ornamentStar: { fontSize: 10, fontWeight: '700' },

  /* Regular cards */
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionSub: { fontSize: FontSize.xs },
  translitText: { lineHeight: 26, fontStyle: 'italic' },
  englishText: { lineHeight: 26 },

  /* Elaboration */
  elaborationCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 10,
  },
  elaborationPill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  elaborationPillText: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  elaborationText: { lineHeight: 24 },
  tamilBody: { lineHeight: 26 },

  /* Tantra card */
  tantraCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tantraCardTitle: { fontSize: FontSize.sm, fontWeight: '700', letterSpacing: 0.3 },
  tantraCardSub: { fontSize: FontSize.xs, fontWeight: '600', marginTop: 2 },
  tantraCardDesc: { fontSize: FontSize.xs, lineHeight: 17, marginTop: 4 },
  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chevron: { fontSize: 20, fontWeight: '300' },

  /* Navigation */
  navRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  navBtn: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    alignItems: 'flex-start',
    gap: 2,
  },
  navBtnRight: { alignItems: 'flex-end' },
  navBtnDisabled: { opacity: 0.35 },
  navBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
  navBtnSub: { fontSize: FontSize.xs },
});
