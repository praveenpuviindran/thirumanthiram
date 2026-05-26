import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/Theme';
import {
  DICTIONARY_TERMS, CATEGORY_COLORS,
  searchDictionary,
  type DictionaryTerm, type DictionaryCategory,
} from '../../data/dictionary';

const ALL_CATEGORIES: DictionaryCategory[] = [
  'Deity', 'Philosophy', 'Yoga', 'Soul & Liberation', 'Cosmology', 'Scripture', 'Practice',
];
const DICTIONARY = DICTIONARY_TERMS;
import { Spacing, Radius, FontSize } from '../../constants/Colors';

// ── Term detail modal ────────────────────────────────────────────────────────
function TermModal({
  term,
  onClose,
}: {
  term: DictionaryTerm | null;
  onClose: () => void;
}) {
  const theme = useTheme();
  if (!term) return null;
  const color = CATEGORY_COLORS[term.category];

  return (
    <Modal
      visible={!!term}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalSafe, { backgroundColor: theme.bg }]}>
        {/* Close bar */}
        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn} hitSlop={10}>
            <Text style={[styles.modalClose, { color: theme.saffron }]}>✕ Close</Text>
          </TouchableOpacity>
          <View style={[styles.modalCatPill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.modalCatText, { color }]}>{term.category}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {/* Tamil word */}
          <Text style={[styles.modalTamil, { color: theme.text }]}>{term.tamil}</Text>
          <Text style={[styles.modalTranslit, { color }]}>{term.transliteration}</Text>
          <Text style={[styles.modalEnglish, { color: theme.textSub }]}>{term.english}</Text>

          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          {/* Explanation */}
          <Text style={[styles.modalExplLabel, { color }]}>Explanation</Text>
          <Text style={[styles.modalExplanation, { color: theme.textSub }]}>{term.explanation}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ── Term card ────────────────────────────────────────────────────────────────
function TermCard({
  term,
  onPress,
}: {
  term: DictionaryTerm;
  onPress: () => void;
}) {
  const theme = useTheme();
  const color = CATEGORY_COLORS[term.category];

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
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function DictionaryScreen() {
  const theme = useTheme();
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
    // Always alphabetical by transliteration
    return [...filtered].sort((a, b) => a.transliteration.localeCompare(b.transliteration));
  }, [query, activeCategory]);

  const toggleCategory = useCallback((cat: DictionaryCategory) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
    setQuery('');
  }, []);

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
      <TermModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
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
  modalScroll: { padding: Spacing.lg, gap: 6 },
  modalTamil: { fontSize: 36, fontWeight: '800', letterSpacing: 0.5 },
  modalTranslit: { fontSize: FontSize.xl, fontWeight: '600', fontStyle: 'italic' },
  modalEnglish: { fontSize: FontSize.md, fontWeight: '500', marginTop: 4 },
  modalDivider: { height: 1, marginVertical: Spacing.md, opacity: 0.4 },
  modalExplLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  modalExplanation: { fontSize: FontSize.sm, lineHeight: 24 },
});
