import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';
import { VerseCard } from '../../components/ui/VerseCard';
import { searchVerses, Verse } from '../../data/thirumanthiram';
import { useFavorites } from '../../hooks/useFavorites';
import { Spacing, Radius, FontSize } from '../../constants/Colors';

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verse[]>([]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    setResults(searchVerses(text));
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
      </View>

      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: theme.saffron }]}>🔱</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Search Thirumanthiram</Text>
          <Text style={[styles.emptyText, { color: theme.textSub }]}>
            Search by English meaning or Tamil text
          </Text>
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
          ListHeaderComponent={
            <Text style={[styles.count, { color: theme.textSub }]}>
              {results.length} verse{results.length !== 1 ? 's' : ''} found
            </Text>
          }
          renderItem={({ item }) => (
            <VerseCard
              verse={item}
              onPress={() => router.push(`/verse/${item.id}` as any)}
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
