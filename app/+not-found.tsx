import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/Theme';
import { Spacing, FontSize, Radius } from '../constants/Colors';

export default function NotFoundScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ title: 'Not Found', headerShown: false }} />
      <View style={styles.container}>
        <Text style={[styles.symbol, { color: theme.saffron }]}>🔱</Text>
        <Text style={[styles.title, { color: theme.text }]}>Page Not Found</Text>
        <Text style={[styles.sub, { color: theme.textSub }]}>
          This path does not exist in the text.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.saffron }]}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Return Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: Spacing.xl,
  },
  symbol: { fontSize: 56 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22 },
  btn: {
    marginTop: 8,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: Radius.md,
  },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.md },
});
