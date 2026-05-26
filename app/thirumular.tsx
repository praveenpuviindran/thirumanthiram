import React, { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/Theme';
import { Spacing, Radius, FontSize, Colors } from '../constants/Colors';

type Lang = 'english' | 'tamil';

const ENGLISH_BIO = {
  intro: {
    heading: 'Siddhar · Yogi · Author of the Thirumanthiram',
    subheading: 'One of the 18 Siddhars · 10th Tirumurai · Shaiva Siddhanta',
    portrait: '🔱',
  },
  sections: [
    {
      title: 'Who Was Thirumoolar?',
      body: `Thirumoolar (also: Tirumular, திருமூலர்) is the pre-eminent yogi-poet of the Tamil Shaiva tradition and the sole author of the Thirumanthiram — a text of 3,047 verses that forms the tenth book of the Tirumurai, the twelve-volume sacred Shaiva canon. He is counted among the Pathinen Siddhar (பதினெட்டுச் சித்தர்), the eighteen immortal Siddhar-Yogis of the Tamil tradition, each of whom attained spiritual perfection through intensive practice of yoga, tantra, and devotion.

Traditional accounts preserved in the Periya Purānam of Sekkizhar (12th century CE) and the prefatory biography in the Tirumurai anthology place his active period somewhere between the 3rd and 7th centuries CE, though the tradition itself regards him as a being whose lifespan defies ordinary reckoning — the Thirumanthiram itself states he composed one verse per year over 3,000 years of continuous samādhi. Western scholars such as K. V. Zvelebil, drawing on comparative linguistic analysis of the text, propose a date no earlier than the 6th–7th century CE, while acknowledging the text may preserve materials of substantially greater antiquity.

He is described as a native of Kailash (கைலாசம்), the mountain abode of Shiva, and a direct disciple of Nandinatha (Nandi), the divine bull-guardian who stands as the first guru of the Shaiva Yoga lineage. This guru-lineage — Nandi → Thirumoolar — is attested in the opening verses of the Thirumanthiram itself.`,
    },
    {
      title: 'The Miracle at Thiruvavaduthurai',
      body: `The most famous biographical episode — recorded in both the Periya Purānam and the prefatory commentary of the kvnthirumoolar.com edition (Saravanan, 2020) — concerns his arrival at Thiruvavaduthurai on the banks of the Cauvery in Tamil Nadu. He encountered a herd of cattle mourning their dead cowherd named Mulan. Moved by deep compassion (karuṇai), he placed his own body safely in the hollow of a tree and entered Mulan's dead body through the yogic power of parakāya praveśam (பரகாயப் பிரவேசம் — the entry of one soul into another's body), to tend the cattle and console them.

When he returned to reclaim his original body, it had vanished — taken back by Shiva's divine will as a sign that his mission was not yet complete. He accepted this with the equanimity of a realised master, settled permanently into Mulan's body, and took up residence beneath a fig tree (arasa maram) near the great Shiva temple at Thiruvavaduthurai. It is from this episode that "Mulan" acquired the prefix "Thiru-" (sacred), yielding the name Thirumoolar — "the sacred Mulan."

The Thiruvavaduthurai Adheenam, one of the oldest functioning Shaiva monastic institutions in Tamil Nadu, traces its lineage directly to this site and regards Thirumoolar's samādhi shrine there as the living source of the tradition. The monastery continues to publish and disseminate the Thirumanthiram to this day.`,
    },
    {
      title: 'The Composition of the Thirumanthiram',
      body: `According to the traditional account recorded in the text's own preamble and confirmed in Sekkizhar's Periya Purānam, Thirumoolar entered a state of unbroken yogic absorption (nirvikalpa samādhi) at Thiruvavaduthurai. Once each year he would surface from this absorption, compose a single verse encoding what he had realised in that year, and return to stillness. The cumulative product of this extraordinary process — 3,047 verses composed across millennia — is the Thirumanthiram.

The text itself was originally hidden: after composition, Thirumoolar buried the palm-leaf manuscripts (ōlai cuvadis) beneath the fig tree, according to the prefatory biography in the kvnthirumoolar.com digital edition (T. Saravanan, 2020, Tantra 1). They were discovered centuries later by the great Shaiva poet-saint Thirugnana Sambandar (Jñānasambandhar), who alerted the scholarly community, enabling the text to enter the wider Shaiva canon. The 11th-century scholar Nambiyandar Nambi then incorporated the Thirumanthiram as the tenth Tirumurai in his compilation of the twelve sacred Shaiva hymns.

The title "Thirumanthiram" (திருமந்திரம் — "the sacred mantra") is itself significant: the original working title was "Sivayoga Mantiram" (சிவயோக மந்திரம்), according to the preface of T. Saravanan's edition, and the text's own verse 99 states that all who read and contemplate it in the morning will attain the bliss of Sadāshiva. The shift to "Thirumanthiram" reflects the community's recognition that the entire text functions as a single, multi-faceted mantra.`,
    },
    {
      title: 'Place in the Shaiva Canon',
      body: `The Thirumanthiram is the tenth of the twelve Tirumurai, the authoritative scriptural canon of Tamil Shaivism, compiled by Nambiyandar Nambi in the 11th century CE. The Tirumurai contains the devotional hymns of the sixty-three Nayanmars (Nāyaṉmār — Tamil Shaiva poet-saints), and the Thirumanthiram is unique among them as the sole work that is simultaneously a philosophical treatise, a complete yoga manual, a tantra-shāstra (text on ritual and esoteric practice), and a work of devotional poetry. No other book in the canon spans this range.

Its canonical position as "the Tirumurai of Yoga" was confirmed early: the traditional authority Sekkizhar describes Thirumoolar in the Periya Purānam (12th c.) as one of the sixty-three Nayanmars, specifically in the group of the four Samayana Kuravar (those who upheld the Shaiva path through practice). The text is also recognised as the foundational document of the Tamil Shaiva Siddhanta philosophical school — indeed, the editors of the Tiruvavaduthurai Adheenam publication describe it as "the first Shaiva Siddhanta text" (T. Saravanan, 2020 preface).

Thirumoolar bridged two previously separate streams: the Sanskrit Agamic tradition and the Tamil devotional tradition. He wrote in Tamil on topics — kundalini yoga, the eight-limbed path, the metaphysics of Pati-Paśu-Pāśa — that had previously been encoded only in Sanskrit, making them accessible across the barriers of language and social station.`,
    },
    {
      title: 'Core Philosophy',
      body: `The philosophical foundation of the Thirumanthiram is Shaiva Siddhanta — specifically its triadic ontology of Pati (Lord, i.e., Shiva), Paśu (the individual soul), and Pāśa (the three bonds: āṇava, karma, and māyā). Liberation (mukti) is the soul's recognition of its eternal relationship with Shiva, achieved through the dissolution of the three bonds by grace alone — a position Thirumoolar states explicitly in multiple verses.

His most celebrated declaration — "அன்பே சிவம்" (Anbe Sivam, "Love is Shiva," verse 81) — has become the most quoted line in all of Tamil spiritual literature, transcending sectarian boundaries. Its philosophical depth is radical: love is not a means to reach Shiva but is itself Shiva's own nature; the practitioner who loves completely is already in Shiva's nature without needing to seek it elsewhere. Equally famous is his insistence in verse 16 (உடம்பார் அழியின் உயிரார் அழிவர் — "If the body perishes, the soul perishes") that the body is not an obstacle to liberation but its necessary vehicle, a position that grounds the entire Siddha tradition's emphasis on physical yoga and longevity.`,
    },
    {
      title: 'Key Teachings at a Glance',
      body: '',
      bullets: [
        { label: 'Love is Shiva', sub: 'அன்பே சிவம் (v.81) — love and Shiva are identical, not related' },
        { label: 'The body is sacred', sub: 'உடம்பை வளர்த்தேன் (v.16) — cultivate the body to cultivate the soul' },
        { label: 'Grace alone liberates', sub: 'Āṇava can only be removed by Shiva, not by the soul\'s own effort' },
        { label: 'One verse, one year', sub: 'Each of the 3,047 verses emerged from one year of samādhi' },
        { label: 'Yoga and devotion are one', sub: 'The eight limbs and loving surrender reach the same summit' },
        { label: 'Na-Ma-Si-Va-Ya is supreme', sub: 'The five syllables contain the entire cosmos (Tantra 5)' },
        { label: 'Universal gift', sub: '"யாம் பெற்ற இன்பம் பெறுக இவ்வையகம்" — may the whole world receive what I received' },
      ],
    },
    {
      title: 'Sources & References',
      body: `This biographical account draws on the following primary and scholarly sources:

1. Thirumandhiram Thandhiram 1 — T. Saravanan (kvnthirumoolar.com, 2020). The digital edition that includes a detailed preface (vadurai) and verse-by-verse commentary in Tamil. URL: https://kvnthirumoolar.com/wp-content/uploads/2020/05/Thirumandhiram-Thandhiram-1.pdf

2. Sekkizhar, Periya Purānam (12th century CE). The authoritative hagiography of the 63 Nayanmars, which includes the life of Thirumoolar and confirms his canonical status.

3. Dr. B. Natarajan (trans.), Tirumantiram: A Tamil Scriptural Classic. Himalayan Academy Publications, 1993. The primary complete English translation, widely cited in academic and practitioner communities.

4. K. V. Zvelebil, Tamil Literature (Handbuch der Orientalistik, 1975). The foundational Western scholarly analysis of the Tamil literary tradition, including dating of the Thirumanthiram.

5. Tiruvavaduthurai Adheenam publications. The ancient Shaiva monastic institution at Thiruvavaduthurai, Tamil Nadu, which maintains the living tradition of the text and publishes authoritative editions.

6. Nambiyandar Nambi (11th century CE). The scholar who compiled the twelve Tirumurai and established the Thirumanthiram as its tenth volume.`,
    },
  ],
};

const TAMIL_BIO = {
  sections: [
    {
      title: 'தோற்றமும் ஆரம்ப வாழ்க்கையும்',
      body: `திருமூலர் தமிழ்ச் சைவ மரபில் மிகவும் உயர்ந்த ஆன்மிக ஆசானாவார். பதினெட்டு சித்தர்களில் ஒருவரான இவர், யோகம், வேதியியல் மற்றும் திருவருள் வழியாக அழியாமையை அடைந்தவர். அறிஞர்கள் இவரை கி.பி. மூன்றாம் நூற்றாண்டிலிருந்து ஏழாம் நூற்றாண்டுக்கு இடையில் வாழ்ந்தவராக கணிக்கின்றனர். சைவ மரபோ இவரை காலத்தையும் கடந்த மகான் என்று போற்றுகிறது.

இமயமலையில் வாழ்ந்த இவர், சிவனின் திருக்கதவு காவலரும் சைவ யோக மரபின் முதல் ஆசிரியருமான நந்தியம்பெருமானிடம் நேரடியாக தீட்சை பெற்றார். யோகம், தந்திரம், மற்றும் சைவ ஆகமங்களின் ஆழமான ரகசியங்களை நந்தியிடமிருந்து கற்றறிந்தார். பின்பு தமிழ்நாட்டை நோக்கி தென்திசை நடைபோட்டார்.`,
    },
    {
      title: 'ஆயனின் உடலில் நுழைந்த அதிசயம்',
      body: `திருவாவடுதுறை அருகில் வரும்போது, திருமூலர் ஒரு இறந்த ஆயனை — "மூலன்" என்ற பெயர் கொண்டவனை — சுற்றி அழும் மாடு மந்தையை கண்டார். கருணையால் தூண்டப்பட்ட இவர், தம் உடலை ஒரு மரப்பொந்தில் பாதுகாப்பாக வைத்துவிட்டு, பரகாயப் பிரவேசம் என்னும் யோகசக்தியால் மூலனின் உடலில் புகுந்தார். மாடுகளை மேய்த்து தேற்றினார்.

மீண்டும் தம் உடலுக்குத் திரும்பி வந்த போது, அது மறைந்திருந்தது. இதை இறைவனின் திருவுள்ளம் என்று உணர்ந்த திருமூலர், மூலனின் உடலிலேயே தொடர்ந்தார். அதனால் "மூலன்" என்ற பெயரே "திருமூலர்" என்று சிறப்பு பெற்றது. திருவாவடுதுறையில் ஒரு அரச மரத்தடியில் ஆழ்ந்த தவத்தில் அமர்ந்தார்.`,
    },
    {
      title: 'திருமந்திரத்தின் இயற்றல்',
      body: `ஆண்டுக்கு ஒரு முறை சமாதி நிலையிலிருந்து வெளிவந்து, ஒரு பாடல் இயற்றிவிட்டு மீண்டும் தவத்தில் ஆழ்வார். இவ்வாறு ஆயிரக்கணக்கான ஆண்டுகளில் 3,047 பாடல்கள் உருவாயின. இது வெறும் இலக்கிய இயற்றல் அன்று — ஒவ்வொரு பாடலும் நேரடி ஆன்மிக அனுபவத்தின் வெளிப்பாடு.

"யான் பெற்ற இன்பம் பெறுக இவ்வையகம்" என்று திருமூலர் கூறுகிறார் — தாம் அடைந்த பேரானந்தத்தை உலகமே பெறவேண்டும் என்ற பேரன்பின் வெளிப்பாடு. திருமந்திரம் ஒரு நூல் மட்டுமல்ல — அது ஒரு வாழ்ந்து காட்டிய வழிகாட்டி.`,
    },
    {
      title: 'சைவ இலக்கியத்தில் இடம்',
      body: `திருமந்திரம் பன்னிரண்டு திருமுறைகளுள் பத்தாவது திருமுறையாகும். நம்பியாண்டார் நம்பி தொகுத்த இந்த திருமுறைத் தொகுப்பில், திருமந்திரம் தனிச்சிறப்பு வாய்ந்த நூல். பக்திக் கவிதை, யோக நூல், தத்துவ விளக்கம், மந்திர சாஸ்திரம் — இந்த நான்கு பரிமாணங்களையும் ஒரே நூலில் கொண்டுள்ள நூல் வேறொன்றும் இல்லை.

வேத நெறியையும் ஆகம நெறியையும் தமிழில் ஒருங்கிணைத்து, சமஸ்கிருதத்தில் மறைந்திருந்த ஞானத்தை தமிழில் எளிதாக்கினார். சாதி, மொழி தாண்டி அனைவருக்கும் ஆன்மிக அறிவு சேரவேண்டும் என்பது திருமூலரின் மகத்தான பங்களிப்பு.`,
    },
    {
      title: 'தத்துவமும் மரபும்',
      body: `"அன்பே சிவம்" என்ற திருமூலரின் மொழி, தமிழ் ஆன்மிக இலக்கியத்தின் மிகவும் புகழ்பெற்ற வரி. அன்பு என்பது வெறும் உணர்வு மட்டுமல்ல — அது பரம்பொருளின் இயல்பே என்ற ஆழமான தத்துவத்தை இந்த வரி உணர்த்துகிறது.

"உடம்பார் அழியின் உயிரார் அழிவர்" என்ற மொழியில் உடல் முக்கியத்துவத்தை போதிக்கிறார். உடல் விடுதலைக்கு தடையில்லை, வழியே என்பது அவரது புரட்சிகரமான கொள்கை. சித்த மருத்துவம், யோக உடலியல், குண்டலினி விஞ்ஞானம் — இவற்றில் அவரது பங்களிப்பு இன்றும் ஆய்வுக்குரியது. திருவாவடுதுறை ஆதீனத்தில் அவரது சமாதி தலம் இன்றும் பக்தர்களை ஈர்க்கிறது.`,
    },
  ],
};

export default function ThirumularScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('english');

  const color = Colors.saffron;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      {/* Header bar */}
      <LinearGradient
        colors={[color + '22', color + '00']}
        style={[styles.headerBar, { borderBottomColor: color + '33' }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={[styles.backArrow, { color }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>About Thirumular</Text>
        <View style={{ width: 60 }} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Portrait hero */}
        <LinearGradient
          colors={['#1A0800', '#3D1400', color + 'AA', color]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.hero}
        >
          {/* Large OM decorative backdrop */}
          <Text style={styles.heroOm} allowFontScaling={false}>ॐ</Text>

          <View style={[styles.portraitBox, { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.3)' }]}>
            <Text style={styles.portrait}>{ENGLISH_BIO.intro.portrait}</Text>
          </View>
          <Text style={styles.heroName}>Thirumoolar</Text>
          <Text style={styles.heroNameTamil}>திருமூலர்</Text>
          <View style={styles.heroOrnament}>
            <View style={styles.heroOrnamentLine} />
            <Text style={styles.heroOrnamentStar}>✦</Text>
            <View style={styles.heroOrnamentLine} />
          </View>
          <Text style={styles.heroSub}>{ENGLISH_BIO.intro.heading}</Text>
          <View style={[styles.heroBadge, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.35)' }]}>
            <Text style={styles.heroBadgeText}>{ENGLISH_BIO.intro.subheading}</Text>
          </View>
          <LinearGradient
            colors={['transparent', theme.bg]}
            style={styles.heroFade}
            pointerEvents="none"
          />
        </LinearGradient>

        {/* Language toggle */}
        <View style={[styles.langToggle, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          {(['english', 'tamil'] as Lang[]).map((l) => (
            <TouchableOpacity
              key={l}
              style={[
                styles.langBtn,
                lang === l && { backgroundColor: color },
              ]}
              onPress={() => setLang(l)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.langBtnText,
                { color: lang === l ? '#FFF' : theme.textSub },
              ]}>
                {l === 'english' ? 'English' : 'தமிழ்'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content sections */}
        {lang === 'english'
          ? ENGLISH_BIO.sections.map((sec, i) => (
              <View key={i} style={styles.section}>
                <View style={[styles.sectionTitleRow, { borderLeftColor: color }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{sec.title}</Text>
                </View>
                {sec.body ? (
                  <Text style={[styles.sectionBody, { color: theme.textSub }]}>{sec.body}</Text>
                ) : null}
                {sec.bullets?.map((b, j) => (
                  <View key={j} style={[styles.bullet, { borderColor: theme.border, backgroundColor: theme.bgCard }]}>
                    <Text style={[styles.bulletLabel, { color }]}>◆  {b.label}</Text>
                    <Text style={[styles.bulletSub, { color: theme.textMuted }]}>{b.sub}</Text>
                  </View>
                ))}
              </View>
            ))
          : TAMIL_BIO.sections.map((sec, i) => (
              <View key={i} style={styles.section}>
                <View style={[styles.sectionTitleRow, { borderLeftColor: color }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{sec.title}</Text>
                </View>
                <Text style={[styles.sectionBody, styles.tamilBody, { color: theme.textSub }]}>
                  {sec.body}
                </Text>
              </View>
            ))
        }

        {/* Timeline */}
        <View style={styles.section}>
          <View style={[styles.sectionTitleRow, { borderLeftColor: color }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {lang === 'english' ? 'Historical Timeline' : 'வரலாற்று காலவரிசை'}
            </Text>
          </View>
          {[
            { period: lang === 'english' ? 'c. 3rd–7th century CE' : 'கி.பி. 3–7 நூற்றாண்டு', event: lang === 'english' ? 'Thirumoolar believed to have lived and composed the Thirumanthiram' : 'திருமூலர் வாழ்ந்து திருமந்திரம் இயற்றினார்' },
            { period: lang === 'english' ? '11th century CE' : 'கி.பி. 11ம் நூற்றாண்டு', event: lang === 'english' ? 'Nambiyandar Nambi includes Thirumanthiram as the 10th Tirumurai' : 'நம்பியாண்டார் நம்பி திருமுறை தொகுப்பில் சேர்த்தார்' },
            { period: lang === 'english' ? '12th–13th century CE' : 'கி.பி. 12–13ம் நூற்றாண்டு', event: lang === 'english' ? 'Shaiva Siddhanta systematised partly in dialogue with Thirumanthiram' : 'சைவ சித்தாந்தம் திருமந்திரம் அடிப்படையில் விரிவாக்கப்பட்டது' },
            { period: lang === 'english' ? 'Present day' : 'இன்றைய நாள்', event: lang === 'english' ? 'Thirumanthiram revered across Tamil Nadu, studied worldwide' : 'உலகெங்கும் திருமந்திரம் ஆய்வுக்கும் பக்திக்கும் உரியது' },
          ].map((t, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={[styles.timelineDot, { backgroundColor: color }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelinePeriod, { color }]}>{t.period}</Text>
                <Text style={[styles.timelineEvent, { color: theme.textSub }]}>{t.event}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Attribution */}
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
  scroll: { paddingBottom: 56 },

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

  hero: {
    margin: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  heroOm: {
    position: 'absolute',
    fontSize: 180,
    lineHeight: 180,
    color: '#FFFFFF',
    opacity: 0.05,
    right: -10,
    top: -10,
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  portraitBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 4,
  },
  portrait: { fontSize: 40 },
  heroName: { fontSize: FontSize.xxl, fontWeight: '900', letterSpacing: -0.3, color: '#FFFFFF' },
  heroNameTamil: { fontSize: FontSize.xl, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,220,160,0.9)' },
  heroOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
    gap: 8,
    marginVertical: 2,
  },
  heroOrnamentLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroOrnamentStar: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  heroSub: { fontSize: FontSize.sm, textAlign: 'center', color: 'rgba(255,255,255,0.75)' },
  heroBadge: {
    marginTop: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  heroBadgeText: { fontSize: FontSize.xs, fontWeight: '600', letterSpacing: 0.4, textAlign: 'center', color: '#FFFFFF' },

  langToggle: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  langBtnText: { fontSize: FontSize.sm, fontWeight: '600' },

  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    gap: 10,
  },
  sectionTitleRow: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', letterSpacing: -0.2 },
  sectionBody: { fontSize: FontSize.sm, lineHeight: 23, letterSpacing: 0.1 },
  tamilBody: { lineHeight: 26 },

  bullet: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: 3,
  },
  bulletLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  bulletSub: { fontSize: FontSize.xs, lineHeight: 18 },

  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    flexShrink: 0,
  },
  timelineContent: { flex: 1, gap: 2 },
  timelinePeriod: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.5 },
  timelineEvent: { fontSize: FontSize.sm, lineHeight: 20 },

  attribution: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  attributionText: { fontSize: FontSize.xs, letterSpacing: 0.5, fontStyle: 'italic' },
});
