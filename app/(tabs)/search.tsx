import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';
import { VerseCard } from '../../components/ui/VerseCard';
import { searchVerses, Verse } from '../../data/thirumanthiram';
import { useFavorites } from '../../hooks/useFavorites';
import { Spacing, Radius, FontSize } from '../../constants/Colors';

// H10 — searchVerses scans the full 3048-verse corpus. Running it on every
// keystroke burns ~6,100 allocations + 9,100 substring scans per character.
// The query execution is debounced; the TextInput itself stays fully
// controlled by `query` so typing never feels delayed or drops characters.
const SEARCH_DEBOUNCE_MS = 280;

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verse[]>([]);
  // True while a debounced search for the CURRENT query text hasn't resolved
  // yet, so the render below can avoid flashing "No results" for a query
  // that simply hasn't been executed.
  const [isSearching, setIsSearching] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((text: string) => {
    // Controlled input updates instantly, every keystroke.
    setQuery(text);

    // A new keystroke invalidates whatever search was previously scheduled —
    // clearing here is what prevents an older, slower-to-resolve query from
    // overwriting a newer one's results.
    if (debounceTimer.current !== null) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    if (text.length === 0) {
      // Nothing to debounce — jump straight to the empty state, no scan.
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      setResults(searchVerses(text));
      setIsSearching(false);
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  // Unmount cleanup: cancel any in-flight timer so it can never fire
  // setState after this screen has gone away.
  useEffect(() => {
    return () => {
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: theme.text }]}>Search</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>தேடு</Text>

        <View style={[styles.searchBox, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.searchIcon, { color: theme.textMuted }]}>⌕ </Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Search English or Tamil..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={handleSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        <TouchableOpacity
          style={[styles.dictChip, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          onPress={() => router.navigate('/(tabs)/dictionary' as any)}
          activeOpacity={0.75}
        >
          <Text style={[styles.dictChipIcon, { color: theme.saffron }]}>◉</Text>
          <Text style={[styles.dictChipText, { color: theme.textSub }]}>Dictionary  ·  அகராதி</Text>
          <Text style={[styles.dictChipArrow, { color: theme.textMuted }]}>›</Text>
        </TouchableOpacity>
      </View>

      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: theme.saffron }]}>🔱</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Search Thirumanthiram</Text>
          <Text style={[styles.emptyText, { color: theme.textSub }]}>
            Search by English meaning or Tamil text
          </Text>
        </View>
      ) : isSearching && results.length === 0 ? (
        // Debounce window for a query that has never produced results yet —
        // deliberately distinct from "No results" so a fast typist never sees
        // a false negative flash before the debounced search has even run.
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: theme.textMuted }]}>⋯</Text>
          <Text style={[styles.emptyTitle, { color: theme.textMuted }]}>Searching…</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: theme.textMuted }]}>∅</Text>
          <Text style={[styles.emptyTitle, { color: theme.textMuted }]}>No results for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(v) => String(v.id)}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <Text style={[styles.count, { color: theme.textSub }]}>
              {results.length} verse{results.length !== 1 ? 's' : ''} found
            </Text>
          }
          renderItem={({ item }) => (
            <VerseCard
              verse={item}
              onPress={() => router.navigate(`/(tabs)/verse/${item.id}` as any)}
              isFavorite={isFavorite(item.id)}
              showTantraLabel
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerArea: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    height: 46,
  },
  searchIcon: {
    fontSize: 20,
  },
  dictChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    marginTop: Spacing.sm,
    gap: 8,
  },
  dictChipIcon: { fontSize: 16 },
  dictChipText: { flex: 1, fontSize: FontSize.sm, fontWeight: '500' },
  dictChipArrow: { fontSize: 20, fontWeight: '300' },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    height: '100%',
  },
  list: {
    paddingBottom: 40,
  },
  count: {
    fontSize: FontSize.xs,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
