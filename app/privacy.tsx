import React from 'react';
import {
  ScrollView, View, Text, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/Theme';
import { Spacing, Radius, FontSize, Colors } from '../constants/Colors';

const SECTIONS = [
  {
    title: 'Overview',
    body: `Thirumanthiram is a reading app for the sacred Tamil text of the same name. This policy explains what information the app does — and does not — collect.`,
  },
  {
    title: 'Data We Collect',
    body: `The app does not collect, transmit, or store any personal data on any server. We have no user accounts, no analytics, and no advertising SDKs.`,
  },
  {
    title: 'Data Stored On Your Device',
    body: `Your favourites and app settings (such as font size, theme, and audio preferences) are saved locally on your device using standard on-device storage. This information never leaves your device and is not accessible to us or to any third party.`,
  },
  {
    title: 'Permissions',
    body: `The app requests internet access solely to load verse audio recordings and to check for content updates. No other device permissions are used.`,
  },
  {
    title: 'Third Parties',
    body: `The app does not integrate any third-party analytics, advertising, or tracking services.`,
  },
  {
    title: 'Children’s Privacy',
    body: `The app contains no objectionable content and does not knowingly collect information from anyone, including children.`,
  },
  {
    title: 'Changes to This Policy',
    body: `If this policy changes, the update will be posted on this page with a revised date below.`,
  },
  {
    title: 'Contact',
    body: `Questions about this policy can be sent to thirumanthiram2026@gmail.com.`,
  },
];

export default function PrivacyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const color = Colors.saffron;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <LinearGradient
        colors={[color + '22', color + '00']}
        style={[styles.headerBar, { borderBottomColor: color + '33' }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={[styles.backArrow, { color }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy Policy</Text>
        <View style={{ width: 60 }} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={[styles.updated, { color: theme.textMuted }]}>Last updated: July 28, 2026</Text>

        {SECTIONS.map((sec, i) => (
          <View key={i} style={styles.section}>
            <View style={[styles.sectionTitleRow, { borderLeftColor: color }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{sec.title}</Text>
            </View>
            <Text style={[styles.sectionBody, { color: theme.textSub }]}>{sec.body}</Text>
          </View>
        ))}

        <View style={[styles.attribution, { borderTopColor: theme.border }]}>
          <Text style={[styles.attributionText, { color: theme.textMuted }]}>
            Thirumanthiram App · Made by Praveen Puviindran
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 56, paddingHorizontal: Spacing.md },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: { width: 60 },
  backArrow: { fontSize: FontSize.md, fontWeight: '600' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FontSize.md, fontWeight: '700' },

  updated: { fontSize: FontSize.sm, marginTop: Spacing.md, marginBottom: Spacing.sm },

  section: { marginTop: Spacing.lg },
  sectionTitleRow: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700' },
  sectionBody: { fontSize: FontSize.sm, lineHeight: 22 },

  attribution: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  attributionText: { fontSize: FontSize.xs },
});
