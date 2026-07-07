import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar,
  TextInput, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../constants/Theme';
import { VerseAudioPlayer } from '../../../components/ui/VerseAudioPlayer';
import { getVerseById, getTantraById, VERSES } from '../../../data/thirumanthiram';
import { lookupTamilWord } from '../../../data/word_lookup';
import { useFavorites } from '../../../hooks/useFavorites';
import { useSettings } from '../../../hooks/useSettings';
import { Spacing, Radius, FontSize, Colors } from '../../../constants/Colors';

type Tab = 'tamil' | 'english' | 'words' | 'notes' | 'feedback';

const TABS: { key: Tab; label: string }[] = [
  { key: 'tamil',    label: 'தமிழ்' },
  { key: 'english',  label: 'English' },
  { key: 'words',    label: 'Words' },
  { key: 'notes',    label: 'Notes' },
  { key: 'feedback', label: 'Feedback' },
];

const FEEDBACK_EMAIL = 'vijitha_puvi@yahoo.ca';

export default function VerseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings } = useSettings();

  const verseId = Number(id);

  const [activeTab, setActiveTab] = useState<Tab>('tamil');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [personalNote, setPersonalNote] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(`verse_note_${verseId}`).then(v => setPersonalNote(v ?? ''));
  }, [verseId]);

  const saveNote = useCallback((text: string) => {
    setPersonalNote(text);
    AsyncStorage.setItem(`verse_note_${verseId}`, text);
  }, [verseId]);
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

  // Word-by-word dictionary lookup
  const wordEntries = useMemo(() => {
    const tamilWords = (verse.tamil ?? '').replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
    const romaWords = (verse.transliteration ?? '').replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
    return tamilWords.map((tamil, i) => {
      const match = lookupTamilWord(tamil);
      return {
        tamil,
        roman: match?.roman ?? romaWords[i] ?? '',
        english: match?.english ?? '',
        found: !!match,
      };
    });
  }, [verse.tamil, verse.transliteration]);

  const sendFeedback = () => {
    const subject = encodeURIComponent(`Feedback – Verse #${verse.verseNumber}`);
    const body = encodeURIComponent(
      `Name: ${feedbackName || '(not given)'}\n\nFeedback:\n${feedbackMsg}`
    );
    Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <LinearGradient
        colors={theme.dark ? [color + '28', color + '00'] : [color + '18', color + '00']}
        style={[styles.header, { borderBottomColor: color + '33' }]}
      >
        <TouchableOpacity
          onPress={() => router.navigate(`/(tabs)/tantra/${verse.tantraId}` as any)}
          style={styles.backBtn}
          hitSlop={8}
        >
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

      {/* Tab bar */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border, backgroundColor: theme.bg }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabItem,
                  active && { borderBottomColor: color, borderBottomWidth: 2 },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.tabLabel,
                  { color: active ? color : theme.textMuted },
                  active && { fontWeight: '700' },
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab content */}
      <ScrollView
        key={activeTab}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ─── தமிழ் TAB ─── */}
        {activeTab === 'tamil' && (
          <>
            <LinearGradient
              colors={theme.dark
                ? [color + '30', color + '10', theme.bgCard]
                : [color + '18', color + '06', theme.bgCard]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.tamilCard, { borderColor: color + '55' }]}
            >
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

            <VerseAudioPlayer tamilText={verse.tamil} audioUrl={verse.audioUrl} />

            {verse.elaborationTamil ? (
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
            ) : null}
          </>
        )}

        {/* ─── ENGLISH TAB ─── */}
        {activeTab === 'english' && (
          <>
            {verse.transliteration ? (
              <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <View style={styles.sectionRow}>
                  <Text style={[styles.sectionLabel, { color }]}>Transliteration</Text>
                  <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Roman script</Text>
                </View>
                <Text style={[styles.translitText, { color: theme.textSub, fontSize: fontSize - 1 }]}>
                  {verse.transliteration}
                </Text>
              </View>
            ) : null}

            <VerseAudioPlayer tamilText={verse.tamil} audioUrl={verse.audioUrl} />

            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionLabel, { color }]}>English</Text>
                <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Translation</Text>
              </View>
              <Text style={[styles.englishText, { color: theme.textSub, fontSize: fontSize - 1 }]}>
                {verse.english || '—'}
              </Text>
            </View>

            {verse.elaborationEnglish ? (
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
            ) : null}
          </>
        )}

        {/* ─── WORDS TAB ─── */}
        {activeTab === 'words' && (
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionLabel, { color }]}>Words</Text>
              <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
                {wordEntries.filter(e => e.found).length}/{wordEntries.length} defined
              </Text>
            </View>
            {wordEntries.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No word data available for this verse.
              </Text>
            ) : (
              wordEntries.map((entry, i) => (
                <View
                  key={i}
                  style={[
                    styles.dictRow,
                    i > 0 && { borderTopWidth: 1, borderTopColor: theme.border },
                    !entry.found && styles.dictRowDim,
                  ]}
                >
                  <Text style={[styles.dictIndex, { color: theme.textMuted }]}>{i + 1}</Text>
                  <View style={styles.dictBody}>
                    <Text style={[styles.dictTamil, { color: theme.text, fontSize }]}>{entry.tamil}</Text>
                    {entry.roman ? (
                      <Text style={[styles.dictRoman, { color }]}>{entry.roman}</Text>
                    ) : null}
                    {entry.english ? (
                      <View style={[styles.dictMeaningPill, { backgroundColor: color + '18', borderColor: color + '44' }]}>
                        <Text style={[styles.dictEnglish, { color: theme.textSub }]}>{entry.english}</Text>
                      </View>
                    ) : (
                      <Text style={[styles.dictEnglish, { color: theme.textMuted, fontStyle: 'italic' }]}>
                        — not in dictionary
                      </Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ─── NOTES TAB ─── */}
        {activeTab === 'notes' && (
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionLabel, { color }]}>My Notes</Text>
              <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Verse #{verse.verseNumber}</Text>
            </View>
            <TextInput
              style={[styles.notesInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg, fontSize }]}
              placeholder="Write your personal notes here..."
              placeholderTextColor={theme.textMuted}
              value={personalNote}
              onChangeText={saveNote}
              multiline
              textAlignVertical="top"
              autoCapitalize="sentences"
            />
          </View>
        )}

        {/* ─── FEEDBACK TAB ─── */}
        {activeTab === 'feedback' && (
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionLabel, { color }]}>Feedback</Text>
              <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Verse #{verse.verseNumber}</Text>
            </View>

            <Text style={[styles.feedbackHint, { color: theme.textMuted }]}>
              Found an error or have a suggestion? Send it to us.
            </Text>

            <Text style={[styles.fieldLabel, { color: theme.textSub }]}>Your name (optional)</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
              placeholder="Your name"
              placeholderTextColor={theme.textMuted}
              value={feedbackName}
              onChangeText={setFeedbackName}
              autoCapitalize="words"
            />

            <Text style={[styles.fieldLabel, { color: theme.textSub }]}>Comment or correction</Text>
            <TextInput
              style={[styles.inputMulti, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
              placeholder="Describe the issue or suggestion..."
              placeholderTextColor={theme.textMuted}
              value={feedbackMsg}
              onChangeText={setFeedbackMsg}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: color }]}
              onPress={sendFeedback}
              activeOpacity={0.8}
            >
              <Text style={styles.sendBtnText}>Send Feedback ›</Text>
            </TouchableOpacity>

            <Text style={[styles.feedbackEmail, { color: theme.textMuted }]}>
              {FEEDBACK_EMAIL}
            </Text>
          </View>
        )}

        {/* Prev / Next */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              { backgroundColor: theme.bgCard, borderColor: theme.border },
              !prevVerse && styles.navBtnDisabled,
            ]}
            onPress={() => prevVerse && router.replace(`/(tabs)/verse/${prevVerse.id}` as any)}
            disabled={!prevVerse}
            activeOpacity={0.75}
          >
            <Text style={[styles.navBtnText, { color: prevVerse ? color : theme.textMuted }]}>‹ Prev</Text>
            {prevVerse && <Text style={[styles.navBtnSub, { color: theme.textMuted }]}>#{prevVerse.verseNumber}</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.navBtnRight,
              { backgroundColor: theme.bgCard, borderColor: theme.border },
              !nextVerse && styles.navBtnDisabled,
            ]}
            onPress={() => nextVerse && router.replace(`/(tabs)/verse/${nextVerse.id}` as any)}
            disabled={!nextVerse}
            activeOpacity={0.75}
          >
            {nextVerse && <Text style={[styles.navBtnSub, { color: theme.textMuted }]}>#{nextVerse.verseNumber}</Text>}
            <Text style={[styles.navBtnText, { color: nextVerse ? color : theme.textMuted }]}>Next ›</Text>
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

  /* Tab bar */
  tabBar: {
    borderBottomWidth: 1,
  },
  tabScroll: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
  },
  tabItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },

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
  tamilText: { lineHeight: 28, letterSpacing: 0.3, fontWeight: '500' },
  tamilOrnament: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
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

  /* Words — dictionary */
  dictRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 12,
  },
  dictIndex: { fontSize: FontSize.xs, width: 20, paddingTop: 3, textAlign: 'right' },
  dictBody: { flex: 1, gap: 3 },
  dictRowDim: { opacity: 0.55 },
  dictTamil: { fontWeight: '600', lineHeight: 24 },
  dictRoman: { fontSize: FontSize.sm, fontStyle: 'italic', lineHeight: 20 },
  dictMeaningPill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 1,
  },
  dictEnglish: { fontSize: FontSize.xs, lineHeight: 18 },

  emptyText: { fontSize: FontSize.sm, textAlign: 'center', paddingVertical: Spacing.md },

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
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  chevron: { fontSize: 20, fontWeight: '300' },

  /* Feedback */
  feedbackHint: { fontSize: FontSize.sm, lineHeight: 20 },
  fieldLabel: { fontSize: FontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FontSize.sm,
  },
  inputMulti: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FontSize.sm,
    minHeight: 100,
  },
  sendBtn: {
    borderRadius: Radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  sendBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700', letterSpacing: 0.5 },
  feedbackEmail: { fontSize: FontSize.xs, textAlign: 'center', marginTop: 4 },

  /* Notes */
  notesInput: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 240,
    lineHeight: 24,
  },

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
