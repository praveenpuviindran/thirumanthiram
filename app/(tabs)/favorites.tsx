import React from 'react';
import { FlatList, View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';
import { VerseCard } from '../../components/ui/VerseCard';
import { VERSES } from '../../data/thirumanthiram';
import { useFavorites } from '../../hooks/useFavorites';
import { Spacing, FontSize } from '../../constants/Colors';

export default function FavoritesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { favorites, isFavorite } = useFavorites();

  const favoriteVerses = VERSES.filter((v) => favorites.includes(v.id));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <FlatList
        data={favoriteVerses}
        keyExtractor={(v) => String(v.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.titleTamil, { color: theme.saffron }]}>விருப்பங்கள்</Text>
            <Text style={[styles.title, { color: theme.text }]}>Favorites</Text>
            {favoriteVerses.length > 0 && (
              <Text style={[styles.count, { color: theme.textSub }]}>
                {favoriteVerses.length} saved verse{favoriteVerses.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyIcon, { color: theme.saffron }]}>★</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No favorites yet</Text>
            <Text style={[styles.emptyText, { color: theme.textSub }]}>
              Tap the star on any verse to save it here for later
            </Text>
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingBottom: 40 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  titleTamil: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  count: {
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 21,
  },
});
