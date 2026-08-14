import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/Theme';
import { Spacing, FontSize, Radius } from '../../constants/Colors';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Root-level render error boundary.
 *
 * Must be a class component: `getDerivedStateFromError` / `componentDidCatch`
 * have no hook equivalent, so a function component cannot catch render
 * errors thrown by its children.
 *
 * The fallback UI is deliberately a separate function component
 * (`ErrorFallback`) rather than inline JSX in `render()`. `useTheme` only
 * calls React Native's own `useColorScheme` — it has no dependency on any
 * app Context (`SettingsProvider` / `FavoritesProvider`) — so the fallback
 * still renders correctly even when the error that tripped the boundary
 * originated inside one of those providers. See app/_layout.tsx for where
 * this boundary is mounted and why (outside the provider stack, not inside
 * it wrapping only the Stack).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Never swallow silently — this is the call a crash reporter hooks into.
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.symbol, { color: theme.saffron }]}>🔱</Text>
        <Text style={[styles.title, { color: theme.text }]}>Something went wrong</Text>
        <Text style={[styles.message, { color: theme.textSub }]}>
          {__DEV__
            ? error.message
            : 'The app ran into an unexpected problem. Your favourites and settings are safe — try again.'}
        </Text>

        {__DEV__ && !!error.stack && (
          <ScrollView
            horizontal
            style={[styles.stackBox, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          >
            <Text style={[styles.stack, { color: theme.textMuted }]}>{error.stack}</Text>
          </ScrollView>
        )}

        <TouchableOpacity
          onPress={onReset}
          activeOpacity={0.8}
          style={[styles.btn, { backgroundColor: theme.saffron }]}
        >
          <Text style={styles.btnText}>Try again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  symbol: { fontSize: 56 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', textAlign: 'center' },
  message: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22 },
  stackBox: {
    maxHeight: 160,
    width: '100%',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.sm,
  },
  stack: {
    fontSize: FontSize.xs,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: undefined }),
  },
  btn: {
    marginTop: 8,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: Radius.md,
  },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.md },
});
