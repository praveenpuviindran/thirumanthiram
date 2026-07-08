import React from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Linking } from 'react-native';
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
              Praveen Puviindran; Latha Ravendran & Vijitha Puviindran
            </Text>
          </View>
        </View>

        {/* Feedback */}
        <Text style={[styles.section, { color: theme.saffron }]}>Feedback</Text>
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.rowSub, { color: theme.textSub, lineHeight: 20 }]}>
              We'd love to hear from you. Reach out with feedback, corrections, or suggestions:
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.row, { borderBottomColor: 'transparent' }]}
            onPress={() => Linking.openURL('mailto:thirumanthiram2026@gmail.com')}
            activeOpacity={0.7}
          >
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Email</Text>
              <Text style={[styles.rowSub, { color: theme.saffron }]}>thirumanthiram2026@gmail.com</Text>
            </View>
            <Text style={[styles.rowLabel, { color: theme.saffron }]}>✉</Text>
          </TouchableOpacity>
        </View>

        {/* Sources */}
        <Text style={[styles.section, { color: theme.saffron }]}>Sources & References</Text>
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>

          {/* Tamil Commentary */}
          <View style={[styles.sourceGroupHeader, { borderBottomColor: theme.border, backgroundColor: theme.saffron + '15' }]}>
            <Text style={[styles.sourceGroupLabel, { color: theme.saffron }]}>Tamil Commentary · தமிழ் விளக்கம்</Text>
          </View>
          {[
            {
              title: 'Saravanan (KVN Thirumoolar) — Verses 0–1842',
              detail: 'Tamil commentary and explanatory notes by T. Saravanan. Covers verses 0–1842 across Tantras 1–6. Published by KVN Thirumoolar Trust.\nkvnthirumoolar.com/topics/books/',
            },
            {
              title: 'Wisdom Library — Verses 1843–2648',
              detail: 'Tamil commentary and explanatory notes for verses 1843–2648 (Tantras 7–9) sourced from WisdomLib\'s edition of Tirumantiram.\nwisdomlib.org/hinduism/book/tirumantiram-by-tirumular-english-translation',
            },
          ].map((src, i, arr) => (
            <View
              key={i}
              style={[
                styles.sourceRow,
                { borderBottomColor: i < arr.length - 1 ? theme.border : theme.border },
              ]}
            >
              <Text style={[styles.sourceTitle, { color: theme.text }]}>{src.title}</Text>
              <Text style={[styles.sourceDetail, { color: theme.textMuted }]}>{src.detail}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.sourceRow, { borderBottomColor: theme.border }]}
            onPress={() => Linking.openURL('https://kvnthirumoolar.com')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sourceTitle, { color: theme.text }]}>Audios</Text>
            <Text style={[styles.sourceDetail, { color: theme.saffron }]}>kvnthirumoolar.com</Text>
          </TouchableOpacity>

          {/* English Translation */}
          <View style={[styles.sourceGroupHeader, { borderBottomColor: theme.border, backgroundColor: theme.saffron + '15' }]}>
            <Text style={[styles.sourceGroupLabel, { color: theme.saffron }]}>English Translation & Commentary</Text>
          </View>
          {[
            {
              title: 'Himalayan Academy (Kauai Hindu Monastery)',
              detail: 'English translation of Tirumantiram by Satguru Sivaya Subramuniyaswami and the Himalayan Academy. Primary source for English verse translations in this app.\nhimalayanacademy.com/media/books/tirumantiram/Tirumantiram.pdf',
            },
            {
              title: 'Dr. B. Natarajan & Dr. T. N. Ganapathy',
              detail: 'English translation and commentary (Internet Archive bilingual edition). Co-source for English verse translations and elaborations.\narchive.org/details/thirumanthiram_202404',
            },
            {
              title: 'Saravanan (KVN Thirumoolar)',
              detail: 'Tamil commentary and explanatory notes used as secondary reference for English elaborations.\nkvnthirumoolar.com/topics/books/',
            },
            {
              title: 'Tamilnation — Thirumantiram Introduction',
              detail: 'Contextual and introductory material on the Thirumanthiram and its place in Tamil literature.\ntamilnation.org/sathyam/east/thirumurai/thirumanthiram/introduction',
            },
            {
              title: 'Internet Archive — Archival Edition',
              detail: 'Thirumanthiram bilingual/archival edition used as primary reference for commentary extraction.\narchive.org/details/thirumanthiram_202404/page/74/mode/2up',
            },
            {
              title: 'WisdomLib — English Translation',
              detail: 'English translation of Tirumantiram based on published scholarly editions.\nwisdomlib.org/hinduism/book/tirumantiram-by-tirumular-english-translation',
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

        {/* Nine Tandirams */}
        <Text style={[styles.section, { color: theme.saffron }]}>For More Elaborative English Commentary</Text>
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>

          <View style={[styles.sourceGroupHeader, { borderBottomColor: theme.border, backgroundColor: theme.saffron + '15' }]}>
            <Text style={[styles.sourceGroupLabel, { color: theme.saffron }]}>
              NINE TANDIRAMS ON THE TIRUMANDIRAM (THIRUMANDIRAM or TIRUMANTIRAM)
            </Text>
          </View>

          <View style={[styles.sourceRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sourceTitle, { color: theme.text }]}>Nine Tandirams on the Tirumandiram</Text>
            <Text style={[styles.sourceDetail, { color: theme.textMuted }]}>
              New Edition with a more accurate literal translation, with verse-by-verse commentary, in a 5-volume hardbound set. 3,770 pages. 4th printing 2026.
            </Text>
          </View>

          <View style={[styles.sourceRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.rowLabel, { color: theme.textSub }]}>Persons outside India — order here:</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.babajiskriyayoga.net/english/bookstore.htm')} activeOpacity={0.7}>
              <Text style={[styles.sourceDetail, { color: theme.saffron }]}>
                babajiskriyayoga.net/english/bookstore.htm
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.sourceRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.rowLabel, { color: theme.textSub }]}>Residents of India — order here:</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://babajiskriyayogastore.in/index.php?main_page=index&cPath=73')} activeOpacity={0.7}>
              <Text style={[styles.sourceDetail, { color: theme.saffron }]}>
                babajiskriyayogastore.in
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.sourceRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sourceDetail, { color: theme.textMuted }]}>
              Each verse includes the original Tamil language script, its transliteration in Roman characters, its English translation and a commentary elucidating the meaning of each verse, by six eminent Tamil scholars, under the direction of Dr. T.N. Ganapathy. The last volume includes enlightened discourses from two philosophical schools of Saiva Siddhanta, a glossary, a select bibliography and index. ISBN 978-1-895383-61-4.
              {'\n\n'}
              The Tirumandiram, by Siddha Tirumular is a sacred, monumental work of philosophical and spiritual wisdom rendered in verse form. Encyclopedic in its vast scope, and written nearly 2,000 years ago, it is one of India's greatest texts, a spiritual treasure-trove, a Sastra containing astonishing insight. It is a seminal work and is the first treatise in Tamil that deals with different aspects of Yoga, Tantra and Saiva Siddhantha.
              {'\n\n'}
              It took five years and a team of scholars to translate each of its more than 3,000 verses and to write extensive commentaries about them, in nine chapters, known as tandirams. This classic text contains five volumes. Each volume contains two tandirams. The last volume also contains presentations from two philosophical schools of Saiva Siddhanta, a glossary, a select bibliography and index. It includes 3,770 pages in total.
            </Text>
          </View>

          <View style={[styles.sourceGroupHeader, { borderBottomColor: theme.border, backgroundColor: theme.saffron + '10' }]}>
            <Text style={[styles.sourceGroupLabel, { color: theme.saffron }]}>Translators</Text>
          </View>
          {[
            'Tandirams 1, 2 and 3 — Translated by Sri T.V. Venkataraman',
            'Tandiram 4 — Translated by Dr T.N. Ramachandran',
            'Tandiram 5 — Translated by Dr K.R. Arumugam',
            'Tandiram 7 — Translated by Dr P.S. Somasundaram',
            'Tandiram 8 — Translated by Dr S.N. Kandasamy',
            'Tandirams 6 & 9 — Translated by Dr T.N. Ganapathy',
            'Last Volume — Glossary & Select Bibliography by Dr T.N. Ganapathy, and index by Dr Ramesh Babus',
          ].map((t, i, arr) => (
            <View key={i} style={[styles.sourceRow, { borderBottomColor: i < arr.length - 1 ? theme.border : theme.border }]}>
              <Text style={[styles.sourceDetail, { color: theme.textMuted }]}>• {t}</Text>
            </View>
          ))}

          <View style={[styles.sourceRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sourceDetail, { color: theme.textMuted }]}>
              Dr. T.N. Ganapathy, Marshall Govindan, Jan Ahlund and Chris Brod have served as its editors, adding commentary from their yogic experiences.
            </Text>
          </View>

          <View style={[styles.sourceGroupHeader, { borderBottomColor: theme.border, backgroundColor: theme.saffron + '10' }]}>
            <Text style={[styles.sourceGroupLabel, { color: theme.saffron }]}>Further Reading</Text>
          </View>

          <TouchableOpacity
            style={[styles.sourceRow, { borderBottomColor: theme.border }]}
            onPress={() => Linking.openURL('https://www.hinduismtoday.com/modules/smartsection/item.php?itemid=5105')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sourceTitle, { color: theme.text }]}>Hinduism Today Magazine</Text>
            <Text style={[styles.sourceDetail, { color: theme.saffron }]}>
              "A Mystical Masterpiece is Unearthed" — July 2010
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sourceRow, { borderBottomColor: theme.border }]}
            onPress={() => Linking.openURL('https://www.babajiskriyayoga.net/english/pdfs/book-reviews/tirumandiram-georg-feuerstein.pdf')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sourceTitle, { color: theme.text }]}>Book Review by Dr. Georg Feuerstein</Text>
            <Text style={[styles.sourceDetail, { color: theme.saffron }]}>
              babajiskriyayoga.net — PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sourceRow, { borderBottomColor: 'transparent' }]}
            onPress={() => Linking.openURL('https://www.tirumandiram.net/')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sourceTitle, { color: theme.text }]}>tirumandiram.net</Text>
            <Text style={[styles.sourceDetail, { color: theme.saffron }]}>
              For more information on the Tirumandiram, Tirumular, and related publications
            </Text>
          </TouchableOpacity>

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
  sourceGroupHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  sourceGroupLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
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
