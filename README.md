# Thirumanthiram

A complete digital edition of the Thirumanthiram — 3,047 sacred Tamil verses by Thirumoolar (c. 5th–8th century CE) — with Tamil text, Roman transliteration, English translation, and Tamil text-to-speech.

Built with **Expo SDK 54 + React Native + expo-router**. Runs on iOS, Android, and web from a single codebase.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)

### Install

```bash
npm install
```

### Run

```bash
# Start Metro bundler (opens in Expo Go on device/simulator)
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Web browser
npm run web
```

### Web export (for Netlify)

```bash
npx expo export -p web
# Output: dist/
```

---

## Project Structure

```
app/                    # expo-router file-based routes
  (tabs)/               # bottom tab navigator
    index.tsx           # Home screen
    tantras.tsx         # Tantra list
    search.tsx          # Search
    dictionary.tsx      # Dictionary
    favorites.tsx       # Saved verses
    settings.tsx        # Settings
  verse/[id].tsx        # Verse detail
  tantra/[id].tsx       # Tantra detail
  thirumular.tsx        # About Thirumoolar

components/ui/          # Reusable UI components
constants/              # Colors, Theme, Spacing, FontSize
data/                   # All verse data (TypeScript)
  thirumanthiram.ts     # VERSES + TANTRAS + helper functions
  verses_t0.ts          # Paayiram (verses 0–112)
  verses_t1.ts          # Tantra 1 (verses 113–336)
  verses_t2.ts          # Tantra 2 (verses 337–548)
  verses_t3.ts          # Tantra 3 (verses 549–883)
  verses_t4.ts          # Tantra 4 (verses 884–1418)
  verses_t5.ts          # Tantra 5 (verses 1419–1572)
  verses_t6.ts          # Tantra 6 (verses 1573–1703)
  verses_t7.ts          # Tantra 7 (verses 1704–2121)
  verses_t8.ts          # Tantra 8 (verses 2122–2648)
  verses_t9.ts          # Tantra 9 (verses 2649–3047)
hooks/                  # useSettings, useFavorites, useSpeech, useAudio
assets/                 # Icons, splash, fonts, audio
```

---

## Verse Numbering

Verse numbers follow the user-specified edition (0–3047):

| Tantra | Name | Verse Range |
|--------|------|-------------|
| Paayiram | Kadavul Vaazhththu | 0–112 |
| 1 | முதல் தந்திரம் | 113–336 |
| 2 | இரண்டாம் தந்திரம் | 337–548 |
| 3 | மூன்றாம் தந்திரம் | 549–883 |
| 4 | நான்காம் தந்திரம் | 884–1418 |
| 5 | ஐந்தாம் தந்திரம் | 1419–1572 |
| 6 | ஆறாம் தந்திரம் | 1573–1703 |
| 7 | ஏழாம் தந்திரம் | 1704–2121 |
| 8 | எட்டாம் தந்திரம் | 2122–2648 |
| 9 | ஒன்பதாம் தந்திரம் | 2649–3047 |

Tamil text sourced from [Tamil Virtual University](https://www.tamilvu.org/library/l4100).

---

## Technology Stack

| Concern | Solution |
|---------|----------|
| Framework | Expo SDK 54 / React Native 0.81.5 |
| Routing | expo-router v6 (file-based) |
| Storage | @react-native-async-storage/async-storage |
| Audio | expo-speech (TTS) + expo-av (recordings) |
| Fonts | NotoSerifTamil, Lora (via @expo-google-fonts) |
| Styling | React Native StyleSheet (no CSS) |
| State | React hooks (no Redux/Zustand) |
| Web deploy | Netlify (static export) |
| Mobile build | Expo EAS (see FUTURE_APP_STORE_DEPLOYMENT.md) |

---

## Environment Variables

No environment variables are required for local development or web deployment. See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) for details.

---

## Sources

- **Tamil text**: Tamil Virtual University (tamilvu.org/library/l4100), Government of Tamil Nadu
- **Commentary reference**: T. Saravanan, *Thirumandhiram – Mudalaam Tandhiram*, 2020
- **Original text**: Thirumoolar, c. 5th–8th century CE — public domain
