import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../constants/Theme';
import { FontSize, Spacing } from '../../constants/Colors';

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: theme.saffron }]} />
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSub }]}>{subtitle}</Text>
        )}
      </View>
      <View style={[styles.line, { backgroundColor: theme.saffron }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    opacity: 0.4,
  },
  text: {
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: FontSize.xs,
    letterSpacing: 1,
  },
});
