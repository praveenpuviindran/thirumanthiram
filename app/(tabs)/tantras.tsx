import React from 'react';
import { FlatList, View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';
import { TantraCard } from '../../components/ui/TantraCard';
import { TantraNav } from '../../components/ui/TantraNav';
import { TANTRAS } from '../../data/thirumanthiram';
import { Spacing, FontSize } from '../../constants/Colors';

export default function TantrasScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <TantraNav />
      <FlatList
        data={TANTRAS}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTamil, { color: theme.saffron }]}>திருமந்திரம்</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Paayiram & Nine Tantras</Text>
            <Text style={[styles.headerSub, { color: theme.textSub }]}>
              3,048 verses — Kadavul Vaazhththu and 9 Tantras
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TantraCard
            tantra={item}
            onPress={() => router.navigate(`/(tabs)/tantra/${item.id}` as any)}
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
  headerTamil: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: FontSize.sm,
    marginTop: 6,
    textAlign: 'center',
  },
});
