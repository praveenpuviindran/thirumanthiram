import React from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';
import { useSettings } from '../../hooks/useSettings';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';

function SettingRow({
  label, sublabel, value, onToggle, theme,
}: {
  label: string; sublabel?: string; value: boolean; onToggle: () => void; theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
        {sublabel && <Text style={[styles.rowSub, { color: theme.textMuted }]}>{sublabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#444', true: '#D4700A' }}
        thumbColor="#FFF"
      />
    </View>
  );
}

function FontSizeRow({ settings, update, theme }: {
  settings: ReturnType<typeof useSettings>['settings'];
  update: ReturnType<typeof useSettings>['update'];
  theme: ReturnType<typeof useTheme>;
}) {
  const sizes = ['small', 'medium', 'large'] as const;
  return (
    <View style={[styles.row, { borderBottomColor: theme.border, flexDirection: 'column', alignItems: 'flex-start', gap: 10 }]}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>Font Size</Text>
      <View style={styles.sizeRow}>
        {sizes.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.sizeBtn,
              {
                backgroundColor: settings.fontSize === s ? theme.saffron : theme.bgCard,
                borderColor: settings.fontSize === s ? theme.saffron : theme.border,
              },
            ]}
            onPress={() => update({ fontSize: s })}
          >
            <Text style={[styles.sizeBtnText, { color: settings.fontSize === s ? '#FFF' : theme.textSub }]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, update } = useSettings();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <LinearGradient
          colors={theme.dark
            ? ['#2A1200', '#1A0A04', theme.bg]
            : ['#FBE8CC', '#FDF3E8', theme.bg]}
          style={styles.header}
        >
          <Text style={styles.headerOm} allowFontScaling={false}>⚙</Text>
          <Text style={[styles.titleTamil, { color: Colors.saffron }]}>அமைப்புகள்</Text>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <View style={styles.headerOrnament}>
            <View style={[styles.headerOrnamentLine, { backgroundColor: Colors.saffron + '44' }]} />
            <Text style={[styles.headerOrnamentStar, { color: Colors.saffron }]}>✦</Text>
            <View style={[styles.headerOrnamentLine, { backgroundColor: Colors.saffron + '44' }]} />
          </View>
        </LinearGradient>

        {/* Reading */}
        <Text style={[styles.section, { color: theme.saffron }]}>Reading</Text>
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <SettingRow
            label="Show Transliteration"
            sublabel="Roman script phonetic guide"
            value={settings.showTransliteration}
            onToggle={() => update({ showTransliteration: !settings.showTransliteration })}
            theme={theme}
          />
          <SettingRow
            label="Show English Translation"
            value={settings.showEnglish}
            onToggle={() => update({ showEnglish: !settings.showEnglish })}
            theme={theme}
          />
          <FontSizeRow settings={settings} update={update} theme={theme} />
        </View>

        {/* Audio */}
        <Text style={[styles.section, { color: theme.saffron }]}>Audio</Text>
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <SettingRow
            label="Auto-Play Audio"
            sublabel="Play recitation when opening a verse"
            value={settings.autoPlayAudio}
            onToggle={() => update({ autoPlayAudio: !settings.autoPlayAudio })}
            theme={theme}
          />
        </View>

        {/* About */}
        <Text style={[styles.section, { color: theme.saffron }]}>About</Text>
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.aboutRow}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Thirumanthiram App</Text>
            <Text style={[styles.rowSub, { color: theme.textMuted }]}>Version 1.0.0</Text>
          </View>
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.rowSub, { color: theme.textSub, lineHeight: 20 }]}>
              This app presents the sacred Thirumanthiram of Thirumoolar in Tamil and English.
              The text is in the public domain. Translations are based on scholarly works.
            </Text>
          </View>
          <View style={[styles.createdByRow, { borderBottomColor: 'transparent' }]}>
            <Text style={[styles.rowLabel, { color: theme.textMuted }]}>Created by</Text>
            <Text style={[styles.createdByName, { color: theme.saffron }]}>
              Praveen Puviindran
            </Text>
          </View>
        </View>

        {/* Sources */}
        <Text style={[styles.section, { color: theme.saffron }]}>Sources & References</Text>
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>

          {[
            {
              title: 'Tamil Virtual University — Thirumanthiram',
              detail: 'Tamil verse text sourced from tamilvu.org (Tamil Virtual University, Government of Tamil Nadu). The Thirumanthiram digital edition is available at: tamilvu.org/library/l4100. Primary source for all Tamil verse text in this app.',
            },
            {
              title: 'Thirumanthiram (திருமந்திரம்)',
              detail: 'By Thirumoolar (Tirumular). Ancient Tamil classical text, c. 5th–8th century CE. Part of the Tirumurai, the sacred Shaiva canon. 3,000+ verses in nine tantras. Public domain.',
            },
            {
              title: 'Thirumandhiram – Mudalaam Tandhiram (PDF)',
              detail: 'Tamil commentary by T. Saravanan (த. சரவணன்), © 2020, first edition 2020. Available at kvnthirumoolar.com. Used as a reference for section structure and Tamil commentary style in this app.',
            },
            {
              title: 'The Tirumurai',
              detail: 'The twelve sacred Tamil Shaiva texts compiled by Nambiyandar Nambi, 11th century CE. Thirumanthiram occupies the tenth position in this canon.',
            },
            {
              title: 'Shaiva Siddhanta Literature',
              detail: 'Classical works of Shaiva Siddhanta philosophy, including the Meykanda Shastras and the commentarial tradition of Tamil Nadu.',
            },
            {
              title: 'Tiruvavaduthurai Adheenam',
              detail: 'Ancient Shaiva monastery at Tiruvavaduthurai, Tamil Nadu — site of Thirumoolar\'s meditation and a living repository of the Agamic tradition.',
            },
          ].map((src, i, arr) => (
            <View
              key={i}
              style={[
                styles.sourceRow,
                { borderBottomColor: i < arr.length - 1 ? theme.border : 'transparent' },
              ]}
            >
              <Text style={[styles.sourceTitle, { color: theme.text }]}>{src.title}</Text>
              <Text style={[styles.sourceDetail, { color: theme.textMuted }]}>{src.detail}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 60 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  headerOm: {
    position: 'absolute',
    fontSize: 120,
    opacity: 0.04,
    right: 10,
    top: -10,
    color: Colors.saffron,
  },
  titleTamil: { fontSize: FontSize.xl, fontWeight: '600', letterSpacing: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', letterSpacing: -0.3 },
  headerOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    marginTop: 6,
    gap: 8,
  },
  headerOrnamentLine: { flex: 1, height: 1 },
  headerOrnamentStar: { fontSize: 10 },
  section: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
  },
  card: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: FontSize.md, fontWeight: '500' },
  rowSub: { fontSize: FontSize.xs, marginTop: 2 },
  sourceRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 4,
  },
  sourceTitle: { fontSize: FontSize.sm, fontWeight: '600' },
  sourceDetail: { fontSize: FontSize.xs, lineHeight: 18 },
  aboutRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  createdByRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'column',
    gap: 4,
  },
  createdByName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sizeRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  sizeBtn: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  sizeBtnText: { fontSize: FontSize.sm, fontWeight: '500' },
});
