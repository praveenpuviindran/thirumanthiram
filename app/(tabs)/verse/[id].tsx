import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar,
  TextInput, Linking, Animated, PanResponder, useWindowDimensions, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../constants/Theme';
import { VerseAudioPlayer } from '../../../components/ui/VerseAudioPlayer';
import { TamilVerseLines } from '../../../components/ui/TamilVerseLines';
import { getVerseById, getTantraById, VERSES } from '../../../data/thirumanthiram';
import { useFavorites } from '../../../hooks/useFavorites';
import { useSettings } from '../../../hooks/useSettings';
import { Spacing, Radius, FontSize, Colors } from '../../../constants/Colors';
type Tab = 'tamil' | 'english' | 'notes' | 'feedback';

const TABS: { key: Tab; label: string }[] = [
  { key: 'tamil',    label: 'தமிழ்' },
  { key: 'english',  label: 'English' },
  { key: 'notes',    label: 'Notes' },
  { key: 'feedback', label: 'Feedback' },
];

const FEEDBACK_EMAIL = 'thirumanthiram2026@gmail.com';

// Notes persist on a trailing debounce rather than on every keystroke. On web
// AsyncStorage is localStorage-backed and synchronous, so a per-keystroke write
// blocks the JS thread inside the text input's own event handler.
const NOTE_SAVE_DEBOUNCE_MS = 400;

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
  // H2 — the loaded note carries the id it belongs to. A bare `cancelled` flag
  // fixes only out-of-order resolution; it leaves the PREVIOUS verse's note on
  // screen while the new one loads, and leaves saveNote free to write that
  // stale text into the new verse's key. Binding value→id closes both.
  const [note, setNote] = useState<{ id: number; text: string } | null>(null);

  // Debounced persistence. The pending write carries its OWN verse id, so a
  // timer that fires after a navigation still targets the verse the text was
  // typed for — it can never land under the wrong key.
  const pendingNoteWrite = useRef<{ id: number; text: string } | null>(null);
  const noteWriteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushNoteWrite = useCallback(() => {
    if (noteWriteTimer.current !== null) {
      clearTimeout(noteWriteTimer.current);
      noteWriteTimer.current = null;
    }
    const pending = pendingNoteWrite.current;
    pendingNoteWrite.current = null;
    if (!pending) return;
    AsyncStorage.setItem(`verse_note_${pending.id}`, pending.text).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Synchronous, before paint: the outgoing verse's note is never shown
    // under the incoming verse's header.
    setNote(null);
    AsyncStorage.getItem(`verse_note_${verseId}`)
      .then(v => { if (!cancelled) setNote({ id: verseId, text: v ?? '' }); })
      .catch(() => { if (!cancelled) setNote({ id: verseId, text: '' }); });
    return () => {
      cancelled = true;
      // React runs this cleanup BEFORE the next effect's getItem is issued, so
      // the outgoing verse's debounced write is committed first and in order.
      flushNoteWrite();
    };
  }, [verseId, flushNoteWrite]);

  const noteLoaded = note !== null && note.id === verseId;

  const saveNote = useCallback((text: string) => {
    // Refuse writes until this verse's note has actually loaded. Without this,
    // one keystroke during the load window persists whatever the input happened
    // to be showing into `verse_note_<current>`, destroying it.
    if (!noteLoaded) return;
    setNote({ id: verseId, text });
    pendingNoteWrite.current = { id: verseId, text };
    if (noteWriteTimer.current !== null) clearTimeout(noteWriteTimer.current);
    noteWriteTimer.current = setTimeout(() => {
      noteWriteTimer.current = null;
      const pending = pendingNoteWrite.current;
      pendingNoteWrite.current = null;
      if (pending) {
        AsyncStorage.setItem(`verse_note_${pending.id}`, pending.text).catch(() => {});
      }
    }, NOTE_SAVE_DEBOUNCE_MS);
  }, [verseId, noteLoaded]);

  const verse = useMemo(() => getVerseById(verseId), [verseId]);
  const tantra = useMemo(() => verse ? getTantraById(verse.tantraId) : undefined, [verse]);

  const idx = useMemo(() => VERSES.findIndex((v) => v.id === verseId), [verseId]);
  const prevVerse = idx > 0 ? VERSES[idx - 1] : null;
  const nextVerse = idx < VERSES.length - 1 ? VERSES[idx + 1] : null;

  // ── Swipe navigation ──────────────────────────────────────────────────────
  const { width: screenWidth } = useWindowDimensions();
  const swipeX = useRef(new Animated.Value(0)).current;

  // The PanResponder below is created once (useRef), so it would otherwise
  // capture the very first render's width forever and animate by a stale
  // distance after a rotation / window resize. Read it through a ref instead.
  const widthRef = useRef(screenWidth);
  useEffect(() => { widthRef.current = screenWidth; }, [screenWidth]);

  // Latch: rejects a second swipe while an exit animation (and its trailing
  // rAF-deferred router.replace) is still in flight.
  const swipeInFlight = useRef(false);

  // Per-verse reset. This screen is a Tabs.Screen that never unmounts, so every
  // piece of verse-scoped state has to be cleared here by hand.
  //   · swipeX / swipeInFlight — safety net: whatever happened during the last
  //     swipe, a new verse always starts un-translated and un-latched.
  //     Self-heals if a callback is dropped.
  //   · feedbackMsg — a draft written about verse 41 must not be sent under
  //     verse 42's subject line. `feedbackName` is deliberately NOT cleared:
  //     it's the user's own name and re-typing it per verse is hostile.
  //   · activeTab is deliberately NOT reset — staying on the English tab while
  //     swiping is a reading-mode preference, not per-verse state.
  useEffect(() => {
    swipeX.setValue(0);
    swipeInFlight.current = false;
    setFeedbackMsg('');
  }, [verseId, swipeX]);

  // Ref keeps latest nav targets fresh inside the PanResponder closure
  const navRef = useRef({ prevVerse, nextVerse, router });
  useEffect(() => { navRef.current = { prevVerse, nextVerse, router }; });

  const panResponder = useRef(
    PanResponder.create({
      // Only claim clearly horizontal swipes (horizontal > 2× vertical)
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 2,
      onPanResponderGrant: () => swipeX.stopAnimation(),
      onPanResponderMove: (_, { dx }) => swipeX.setValue(dx * 0.35),
      onPanResponderRelease: (_, { dx, vx }) => {
        const { prevVerse, nextVerse, router } = navRef.current;
        const goNext = (dx < -60 || vx < -0.4) && !!nextVerse;
        const goPrev = (dx > 60 || vx > 0.4) && !!prevVerse;

        if (goNext || goPrev) {
          // H1: reject re-entrant swipes while one is still resolving.
          if (swipeInFlight.current) return;
          swipeInFlight.current = true;
          const target = goNext ? nextVerse : prevVerse;
          Animated.timing(swipeX, {
            toValue: goNext ? -widthRef.current : widthRef.current,
            duration: 220,
            useNativeDriver: true,
          }).start(({ finished }) => {
            // H1: stopAnimation() still fires this callback, with finished:false.
            if (!finished || !target) {
              swipeInFlight.current = false;
              swipeX.setValue(0);
              return;
            }
            // C1: do NOT reset synchronously here. In RN's native-driver
            // completion path (Animated/animations/Animation.js) :144 invokes
            // this callback, then :151 __onAnimatedValueUpdateReceived restores
            // the JS value to ±width and :166 schedules a React commit of it —
            // both synchronous, both AFTER we return. A setValue(0) placed here
            // is silently overwritten, which is the blank-screen bug.
            // requestAnimationFrame is guaranteed to run after all of that.
            // The stale ±width commit then lands while the OLD verse is still
            // mounted and legitimately off-screen — the correct end state of an
            // exit animation. And if the scheduler defers that commit past the
            // rAF, _value is already 0. Correct under either interleaving.
            // Do not "simplify" this back into the callback body.
            requestAnimationFrame(() => {
              swipeX.setValue(0);
              router.replace(`/(tabs)/verse/${target.id}` as any);
            });
          });
        } else {
          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 120,
            friction: 8,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        swipeInFlight.current = false;
        Animated.spring(swipeX, { toValue: 0, useNativeDriver: true, tension: 120, friction: 8 }).start();
      },
    })
  ).current;

  if (!verse) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText, { color: theme.textMuted }]}>Verse not found.</Text>
      </SafeAreaView>
    );
  }

  const color = tantra?.color ?? Colors.saffron;
  const favorite = isFavorite(verse.id);
  const fontSize = settings.fontSizeValue ?? 17;

  // C3 — the Settings toggles are wired here. Both sections live on the English
  // tab, so if the user turns both off that tab would otherwise show nothing
  // but the audio player; render an explicit empty state instead.
  const showTransliteration = settings.showTransliteration && !!verse.transliteration;
  const showEnglish = settings.showEnglish;
  const englishTabEmpty = !showTransliteration && !showEnglish;

  const sendFeedback = () => {
    const subject = encodeURIComponent(`Feedback – Verse #${verse.verseNumber}`);
    const body = encodeURIComponent(
      `Name: ${feedbackName || '(not given)'}\n\nFeedback:\n${feedbackMsg}`
    );
    Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    // IMPORTANT: do not key SafeAreaView/Animated.View on verseId. This screen
    // is registered as a Tabs.Screen (see (tabs)/_layout.tsx), so React
    // Navigation reuses one persistent component instance across every verse
    // instead of mounting fresh per navigation — that's why a stale-state fix
    // is needed at all. But the swipe gesture drives `swipeX` with
    // useNativeDriver on THIS Animated.View, and a swipe finishes by calling
    // router.replace() from inside that same animation's completion callback.
    // If this element were keyed on verseId, React would unmount it (tearing
    // down its native-driver binding) as a direct side effect of its own
    // animation completing, which produced a blank screen immediately after
    // swiping. Keeping this wrapper stable across verse changes — so the
    // gesture/animation layer persists continuously through a swipe — avoids
    // that entirely. The actual stale-reuse fix is scoped further down, to
    // just the two children with their own per-verse internal refs.
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <Animated.View style={{ flex: 1, transform: [{ translateX: swipeX }] }} {...panResponder.panHandlers}>

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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
          keyboardShouldPersistTaps="handled"
        >
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
      {/* Keyed on verse AND tab so scroll offset does not carry across verses.
          Safe despite the wrapper warning above: this ScrollView holds neither
          the native-driver binding nor the gesture handlers, and it already
          remounts on every tab switch. */}
      <ScrollView
        key={`${verseId}:${activeTab}`}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
              <TamilVerseLines
                key={verseId}
                tamilText={verse.tamil ?? ''}
                baseFontSize={fontSize}
                textStyle={styles.tamilText}
                defaultColor={theme.text}
                containerStyle={styles.tamilLines}
                verseId={verse.id}
              />
              <View style={styles.tamilOrnament}>
                <View style={[styles.ornamentLine, { backgroundColor: color + '44' }]} />
                <Text style={[styles.ornamentStar, { color }]}>✦</Text>
                <View style={[styles.ornamentLine, { backgroundColor: color + '44' }]} />
              </View>
            </LinearGradient>

            <VerseAudioPlayer key={verseId} tamilText={verse.tamil} audioUrl={verse.audioUrl} />

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
            {showTransliteration ? (
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

            <VerseAudioPlayer key={verseId} tamilText={verse.tamil} audioUrl={verse.audioUrl} />

            {showEnglish ? (
              <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <View style={styles.sectionRow}>
                  <Text style={[styles.sectionLabel, { color }]}>English</Text>
                  <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Translation</Text>
                </View>
                <Text style={[styles.englishText, { color: theme.textSub, fontSize: fontSize - 1 }]}>
                  {verse.english || '—'}
                </Text>
              </View>
            ) : null}

            {englishTabEmpty ? (
              <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <Text style={[styles.emptyStateText, { color: theme.textMuted }]}>
                  Transliteration and English translation are hidden. Turn them back on under Settings › Reading.
                </Text>
              </View>
            ) : null}

            {/* Commentary is English prose — it follows the English toggle, or
                the "English" tab ends up containing no English at all. */}
            {showEnglish && verse.elaborationEnglish ? (
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

        {/* ─── NOTES TAB ─── */}
        {activeTab === 'notes' && (
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionLabel, { color }]}>My Notes</Text>
              <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Verse #{verse.verseNumber}</Text>
            </View>
            <TextInput
              style={[styles.notesInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg, fontSize }]}
              placeholder={noteLoaded ? 'Write your personal notes here...' : 'Loading your note…'}
              placeholderTextColor={theme.textMuted}
              value={note && note.id === verseId ? note.text : ''}
              onChangeText={saveNote}
              editable={noteLoaded}
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
      </Animated.View>
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
  // letterSpacing combined with a fixed lineHeight mis-measures text width on some
  // Android devices (facebook/react-native#46436), causing lines to wrap that fit
  // fine on iOS/web — dropped on Android only, where the strict-4-line layout relies
  // on wrap detection in TamilVerseLines being accurate.
  tamilText: { lineHeight: 28, letterSpacing: Platform.OS === 'android' ? 0 : 0.3, fontWeight: '500' },
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
  emptyStateText: { fontSize: FontSize.sm, lineHeight: 22, textAlign: 'center' },
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
