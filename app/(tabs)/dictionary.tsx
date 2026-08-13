import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';
import {
  DICTIONARY_TERMS, CATEGORY_COLORS,
  searchDictionary,
  type DictionaryTerm, type DictionaryCategory,
} from '../../data/dictionary';
import { getVerseById, getTantraById } from '../../data/thirumanthiram';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';

const ALL_CATEGORIES: DictionaryCategory[] = [
  'Deity', 'Philosophy', 'Yoga', 'Soul & Liberation', 'Cosmology', 'Scripture', 'Practice',
];
const DICTIONARY = DICTIONARY_TERMS;

// ── Verse mini-card inside modal ──────────────────────────────────────────────
function VerseRefCard({
  verseId,
  onPress,
}: {
  verseId: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  const verse = useMemo(() => getVerseById(verseId), [verseId]);
  const tantra = useMemo(() => verse ? getTantraById(verse.tantraId) : undefined, [verse]);

  if (!verse) return null;
  const color = tantra?.color ?? Colors.saffron;
  // First line of Tamil; first line of English (up to the colon or 60 chars)
  const tamilLine = verse.tamil.split('\n')[0];
  const englishRaw = verse.english.split('\n')[0];
  const englishLine = englishRaw.length > 60 ? englishRaw.slice(0, 60) + '…' : englishRaw;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.verseCard, { backgroundColor: theme.bg, borderColor: color + '55' }]}
    >
      <LinearGradient
        colors={[color + '20', color + '08']}
        style={styles.verseCardGradient}
      >
        <View style={[styles.verseNumBadge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
          <Text style={[styles.verseNumText, { color }]}>
            {verse.verseNumber === 0 ? 'Kaapu' : `#${verse.verseNumber}`}
          </Text>
          {tantra && (
            <Text style={[styles.verseTantraText, { color: color + 'BB' }]}>
              {tantra.number === 0 ? 'Paayiram' : `T${tantra.number}`}
            </Text>
          )}
        </View>
        <View style={styles.verseCardBody}>
          <Text style={[styles.verseTamilLine, { color: theme.text }]} numberOfLines={1}>
            {tamilLine}
          </Text>
          <Text style={[styles.verseEnglishLine, { color: theme.textMuted }]} numberOfLines={1}>
            {englishLine}
          </Text>
        </View>
        <Text style={[styles.verseArrow, { color }]}>›</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── Term detail modal ─────────────────────────────────────────────────────────
function TermModal({
  term,
  onClose,
  onNavigateToVerse,
}: {
  term: DictionaryTerm | null;
  onClose: () => void;
  onNavigateToVerse: (id: number) => void;
}) {
  const theme = useTheme();
  if (!term) return null;
  const color = CATEGORY_COLORS[term.category];
  const hasVerseRefs = term.verseRefs && term.verseRefs.length > 0;

  return (
    <Modal
      visible={!!term}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalSafe, { backgroundColor: theme.bg }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn} hitSlop={10}>
            <Text style={[styles.modalClose, { color: theme.saffron }]}>✕ Close</Text>
          </TouchableOpacity>
          <View style={[styles.modalCatPill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.modalCatText, { color }]}>{term.category}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.modalScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Word identity block */}
          <LinearGradient
            colors={[color + '18', color + '06']}
            style={[styles.wordBlock, { borderColor: color + '33' }]}
          >
            <Text style={[styles.modalTamil, { color: theme.text }]}>{term.tamil}</Text>
            <Text style={[styles.modalTranslit, { color }]}>{term.transliteration}</Text>
            <View style={[styles.modalEnglishPill, { backgroundColor: color + '18', borderColor: color + '33' }]}>
              <Text style={[styles.modalEnglish, { color: theme.textSub }]}>{term.english}</Text>
            </View>
          </LinearGradient>

          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Explanation */}
          <Text style={[styles.modalExplLabel, { color }]}>Explanation</Text>
          <Text style={[styles.modalExplanation, { color: theme.textSub }]}>{term.explanation}</Text>

          {/* Verse references */}
          {hasVerseRefs && (
            <>
              <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />
              <View style={styles.verseSectionHeader}>
                <View style={[styles.verseSectionDot, { backgroundColor: color }]} />
                <Text style={[styles.verseSectionLabel, { color }]}>
                  VERSES · {term.verseRefs!.length} related
                </Text>
              </View>
              <Text style={[styles.verseSectionSub, { color: theme.textMuted }]}>
                Tap a verse to read it in context
              </Text>
              <View style={styles.verseList}>
                {term.verseRefs!.map((vid) => (
                  <VerseRefCard
                    key={vid}
                    verseId={vid}
                    onPress={() => onNavigateToVerse(vid)}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ── Term card ─────────────────────────────────────────────────────────────────
function TermCard({
  term,
  onPress,
}: {
  term: DictionaryTerm;
  onPress: () => void;
}) {
  const theme = useTheme();
  const color = CATEGORY_COLORS[term.category];
  const hasRefs = term.verseRefs && term.verseRefs.length > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
    >
      <View style={[styles.cardAccent, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={[styles.cardTamil, { color: theme.text }]}>{term.tamil}</Text>
          <View style={[styles.catPill, { backgroundColor: color + '1A', borderColor: color + '44' }]}>
            <Text style={[styles.catPillText, { color }]}>{term.category}</Text>
          </View>
        </View>
        <Text style={[styles.cardTranslit, { color }]}>{term.transliteration}</Text>
        <Text style={[styles.cardEnglish, { color: theme.textSub }]} numberOfLines={1}>
          {term.english}
        </Text>
        <Text style={[styles.cardExcerpt, { color: theme.textMuted }]} numberOfLines={2}>
          {term.explanation}
        </Text>
        {hasRefs && (
          <View style={styles.refBadgeRow}>
            <View style={[styles.refBadge, { backgroundColor: color + '18', borderColor: color + '44' }]}>
              <Text style={[styles.refBadgeText, { color }]}>
                ✦ {term.verseRefs!.length} verse{term.verseRefs!.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function DictionaryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DictionaryCategory | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    setActiveCategory(null);
  }, []);

  const results = useMemo(() => {
    const bySearch = searchDictionary(query);
    const filtered = !activeCategory ? bySearch : bySearch.filter((t) => t.category === activeCategory);
    return [...filtered].sort((a, b) => a.transliteration.localeCompare(b.transliteration));
  }, [query, activeCategory]);

  const toggleCategory = useCallback((cat: DictionaryCategory) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
    setQuery('');
  }, []);

  const handleNavigateToVerse = useCallback((id: number) => {
    setSelectedTerm(null);
    // small delay lets the modal dismiss animation start before navigation
    setTimeout(() => {
      router.navigate(`/(tabs)/verse/${id}` as any);
    }, 120);
  }, [router]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: theme.text }]}>Dictionary</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>
          அகராதி · {DICTIONARY.length} terms · A–Z
        </Text>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.searchIcon, { color: theme.textMuted }]}>⌕ </Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Search Tamil, English or transliteration…"
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={handleSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Category filter chips */}
      <FlatList
        horizontal
        data={ALL_CATEGORIES}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item: cat }) => {
          const active = activeCategory === cat;
          const color = CATEGORY_COLORS[cat];
          return (
            <TouchableOpacity
              onPress={() => toggleCategory(cat)}
              activeOpacity={0.75}
              style={[
                styles.chip,
                active
                  ? { backgroundColor: color, borderColor: color }
                  : { backgroundColor: color + '18', borderColor: color + '55' },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? '#FFF' : color }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        }}
        style={styles.chipList}
      />

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          results.length > 0 ? (
            <Text style={[styles.resultCount, { color: theme.textMuted }]}>
              {results.length} term{results.length !== 1 ? 's' : ''}
              {activeCategory ? ` · ${activeCategory}` : ''}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TermCard term={item} onPress={() => setSelectedTerm(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyIcon, { color: theme.textMuted }]}>∅</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No terms found for "{query}"
            </Text>
          </View>
        }
      />

      {/* Detail modal */}
      <TermModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
        onNavigateToVerse={handleNavigateToVerse}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  headerArea: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: 4,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { fontSize: FontSize.xs, marginBottom: Spacing.sm },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    height: 46,
  },
  searchIcon: { fontSize: 20 },
  input: { flex: 1, fontSize: FontSize.md, height: '100%' },

  chipList: { flexGrow: 0 },
  chips: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: { fontSize: FontSize.xs, fontWeight: '700' },

  list: { paddingBottom: 48 },
  resultCount: {
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },

  card: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: Spacing.md, gap: 3 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTamil: { fontSize: FontSize.lg, fontWeight: '800', letterSpacing: 0.3 },
  catPill: {
    marginLeft: 'auto',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  catPillText: { fontSize: 10, fontWeight: '700' },
  cardTranslit: { fontSize: FontSize.sm, fontWeight: '600', fontStyle: 'italic' },
  cardEnglish: { fontSize: FontSize.sm, fontWeight: '500' },
  cardExcerpt: { fontSize: FontSize.xs, lineHeight: 17, marginTop: 2 },
  refBadgeRow: { flexDirection: 'row', marginTop: 6 },
  refBadge: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  refBadgeText: { fontSize: 10, fontWeight: '700' },

  empty: { padding: Spacing.xl, alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: FontSize.sm, textAlign: 'center' },

  // Modal
  modalSafe: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  modalCloseBtn: { paddingRight: Spacing.md },
  modalClose: { fontSize: FontSize.md, fontWeight: '600' },
  modalCatPill: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  modalCatText: { fontSize: FontSize.xs, fontWeight: '700' },
  modalScroll: { padding: Spacing.lg, gap: 6, paddingBottom: 48 },

  wordBlock: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: 6,
    marginBottom: 4,
  },
  modalTamil: { fontSize: 38, fontWeight: '800', letterSpacing: 0.5 },
  modalTranslit: { fontSize: FontSize.xl, fontWeight: '600', fontStyle: 'italic' },
  modalEnglishPill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  modalEnglish: { fontSize: FontSize.sm, fontWeight: '600' },
  modalDivider: { height: 1, marginVertical: Spacing.md, opacity: 0.4 },
  modalExplLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  modalExplanation: { fontSize: FontSize.sm, lineHeight: 24 },

  // Verse refs section
  verseSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  verseSectionDot: { width: 6, height: 6, borderRadius: 3 },
  verseSectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  verseSectionSub: { fontSize: FontSize.xs, marginBottom: 10 },
  verseList: { gap: Spacing.sm },

  // Verse ref card
  verseCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  verseCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  verseNumBadge: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    minWidth: 52,
  },
  verseNumText: { fontSize: FontSize.xs, fontWeight: '800' },
  verseTantraText: { fontSize: 10, fontWeight: '600', marginTop: 1 },
  verseCardBody: { flex: 1, gap: 3 },
  verseTamilLine: { fontSize: FontSize.sm, fontWeight: '600', letterSpacing: 0.2 },
  verseEnglishLine: { fontSize: FontSize.xs, lineHeight: 16 },
  verseArrow: { fontSize: 22, fontWeight: '300' },
});
