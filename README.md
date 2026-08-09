# Thirumanthiram

A complete digital edition of the **Thirumanthiram** — 3,047 sacred Tamil verses composed by the Siddhar-yogi Thirumoolar (c. 5th–8th century CE) — with Tamil text, Roman transliteration, English translation, Tamil commentary, a built-in Tamil dictionary, and text-to-speech.

Built once with **Expo SDK 54 + React Native + expo-router**, shipped to **iOS (App Store)**, **Android (Google Play)**, and **web** from the same codebase.

- **Live web app:** https://dist-neon-three-95.vercel.app
- **iOS:** App Store Connect app ID `6773450695`
- **Android:** package `com.praveenpuviindran.thirumanthiram`

---

## Contents

- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Architecture notes](#architecture-notes)
- [Local development](#local-development)
- [Building & deploying](#building--deploying)
  - [Web (Vercel)](#web-vercel)
  - [iOS (App Store)](#ios-app-store)
  - [Android (Google Play)](#android-google-play)
  - [Shared vs. platform-specific config](#shared-vs-platform-specific-config)
- [play-store-assets/](#play-store-assets)
- [Environment variables & secrets](#environment-variables--secrets)
- [Known quirks worth knowing about](#known-quirks-worth-knowing-about)
- [Sources](#sources)

---

## Tech stack

| Concern | Solution |
|---|---|
| Framework | Expo SDK 54, React Native 0.81.5, React 19 |
| Routing | `expo-router` v6 (file-based, typed routes) |
| Storage | `@react-native-async-storage/async-storage` (all data is local — no backend, no accounts) |
| Audio | `expo-av` for recordings, `expo-speech` for Tamil TTS fallback |
| Fonts | NotoSerifTamil, Lora (`@expo-google-fonts/*`) |
| Styling | React Native `StyleSheet` (no CSS-in-JS library, no Tailwind) |
| State | Plain React hooks — no Redux/Zustand/Context store |
| Web target | `react-native-web`, statically exported, hosted on **Vercel** |
| Native builds | **EAS Build** (cloud-built `.ipa` / `.aab`, no local Xcode/Android Studio required) |
| Submission | **EAS Submit** for iOS (fully automated via a stored App Store Connect API key); Android is uploaded manually to Play Console (see below for why) |

---

## Repository structure

```
app/                          expo-router file-based routes — the file path IS the URL/screen path
  _layout.tsx                 Root layout: loads fonts, runs data migration + update-check, wraps
                               everything in one Stack containing (tabs) and standalone screens
  (tabs)/
    _layout.tsx                Bottom tab navigator (Home / Tantras / Search / Dictionary /
                                Favorites / Settings) — also registers verse/[id] and tantra/[id]
                                as *hidden* tabs (href: null) so they render without a tab icon
                                but still keep the tab bar visible. See "Known quirks" below.
    index.tsx                  Home screen (verse of the day, quick stats, tantra list)
    tantras.tsx                List of all 9 tantras
    tantra/[id].tsx             One tantra's verse list
    verse/[id].tsx               Verse detail — Tamil/English/Notes/Feedback tabs, swipe-to-navigate
                                  between adjacent verses, favorite toggle, audio playback
    search.tsx                  Full-text search across Tamil / transliteration / English
    dictionary.tsx               Browsable Tamil word dictionary
    favorites.tsx                 Saved verses
    settings.tsx                  Font size, autoplay, About, Sources, **Legal → Privacy Policy**
  privacy.tsx                  Privacy policy screen (standalone route, also served on web at /privacy)
  thirumular.tsx               "About Thirumoolar" biography screen (Tamil/English toggle)
  +not-found.tsx               404 fallback

components/ui/                 Reusable presentational components
  TamilVerseLines.tsx           Renders a verse's Tamil lines with automatic uniform font-shrinking
                                 so no line wraps, using onTextLayout (native) / onLayout (web)
  VerseAudioPlayer.tsx          Play/stop button — real recording if verse.audioUrl is set,
                                 otherwise falls back to Tamil TTS
  VerseCard.tsx, TantraCard.tsx, TantraNav.tsx, DailyVerse.tsx, SectionHeader.tsx  — list/nav UI
  AudioPlayer.tsx, SpeechPlayer.tsx   ⚠️ legacy, superseded by VerseAudioPlayer.tsx, not imported
                                       anywhere currently — kept for reference, safe to delete

hooks/
  useSettings.ts                Font size / autoplay / display prefs, persisted to AsyncStorage
  useFavorites.ts               Favorite verse IDs, persisted to AsyncStorage
  useDataMigration.ts            One-time data-shape migrations on app launch
  useAppUpdateCheck.ts            Checks for a newer store version on launch
  useAudio.ts, useSpeech.ts       ⚠️ legacy, only used by the unused AudioPlayer/SpeechPlayer above

constants/
  Colors.ts                     Spacing / Radius / FontSize / color tokens
  Theme.ts                       useTheme() — derives light/dark palette from color scheme
  DataVersion.ts                  Version stamp read by useDataMigration

data/                          All content, as plain TypeScript modules — no database, no CMS
  thirumanthiram.ts              TANTRAS + VERSES (merges all verses_t*.ts) + getVerseById /
                                  getTantraById / searchVerses helpers
  verses_t0.ts … verses_t9.ts     One file per tantra. verseNumber = Project Madurai song
                                    numbering; id = verseNumber + 1. See table below.
  dictionary.ts                    ~150 curated philosophical/technical term entries (longer-form,
                                    shown in the Dictionary tab)
  word_lookup.ts                    ~700+ shorter word → transliteration/meaning entries (word-level
                                     lookups, e.g. tapped from within a verse)
  verse_words.ts, verse_words_t0.ts  Per-word breakdowns used for word-tap lookups

scripts/
  fix-dist-for-vercel.js         Post-export fix required before every web deploy — see
                                  "Web (Vercel)" below for why this exists

assets/                        Icons, splash screen, fonts, bundled audio
  icon.png                       1024×1024 app icon — used for iOS and as the general app icon
  adaptive-icon.png               Android-only adaptive icon foreground layer (must be kept in
                                   sync with icon.png manually — see "Known quirks")
  favicon.png                     Web favicon only

play-store-assets/             Generated Play Store submission assets (icon, feature graphic,
                                phone/tablet screenshots, built .aab files) — see below

ios/                            Native iOS project — generated by `expo prebuild`, gitignored.
                                 Not needed for EAS cloud builds; only relevant if you want to
                                 open the project in Xcode locally.
android/                        Would be the native Android project equivalent — not present
                                 locally; also gitignored. Android is built entirely on EAS's
                                 cloud servers in this project.

app.json                        Expo config — name, version, icons, splash, iOS/Android/web
                                  platform blocks. `version` is shared across iOS and Android.
eas.json                        EAS Build profiles (development/preview/production) and Submit
                                  config (App Store Connect + Play Console targets)
vercel.json                      Vercel static-hosting config (clean URLs, SPA rewrite) — copied
                                   into dist/ by fix-dist-for-vercel.js before every deploy
```

---

## Architecture notes

**Verse numbering.** `verseNumber` follows the Project Madurai source numbering (0-indexed); `id = verseNumber + 1`. The app displays `verseNumber` everywhere (e.g. `#390`), never `id` — `id` only exists as a stable React/routing key.

| Tantra | Tamil name | Verse range (`verseNumber`) |
|---|---|---|
| Paayiram | கடவுள் வாழ்த்து | 0–112 |
| 1 | முதல் தந்திரம் | 113–336 |
| 2 | இரண்டாம் தந்திரம் | 337–548 |
| 3 | மூன்றாம் தந்திரம் | 549–883 |
| 4 | நான்காம் தந்திரம் | 884–1418 |
| 5 | ஐந்தாம் தந்திரம் | 1419–1572 |
| 6 | ஆறாம் தந்திரம் | 1573–1703 |
| 7 | ஏழாம் தந்திரம் | 1704–2121 |
| 8 | எட்டாம் தந்திரம் | 2122–2648 |
| 9 | ஒன்பதாம் தந்திரம் | 2649–3047 |

**No backend.** Every verse, dictionary entry, and word lookup is a static TypeScript literal in `data/`. There's no API, no database, no user accounts. `AsyncStorage` holds only on-device state: favorites, font size/settings, and per-verse personal notes.

**Routing.** `app/_layout.tsx` is a root `Stack` containing the `(tabs)` group as one screen. Inside `(tabs)/_layout.tsx`, `verse/[id]` and `tantra/[id]` are registered as **tab screens** (with `href: null` to hide them from the tab bar UI), not as stack screens pushed on top. This was a deliberate choice to keep the bottom tab bar visible on verse/tantra detail screens — but it has one important consequence documented under "Known quirks" below.

---

## Local development

**Prerequisites:** Node 20+, npm, and either the Expo Go app on a device or a simulator.

```bash
npm install

npm start          # Metro bundler — scan the QR code with Expo Go
npm run ios        # iOS simulator (requires Xcode)
npm run android    # Android emulator (requires Android Studio)
npm run web        # Browser, via react-native-web
```

No environment variables or `.env` files are needed for local development — see [Environment variables & secrets](#environment-variables--secrets).

---

## Building & deploying

### Web (Vercel)

```bash
npm run build:web     # expo export --platform web, then runs scripts/fix-dist-for-vercel.js
npm run deploy:web     # build:web, then `vercel deploy dist/ --prod`
```

**Why `scripts/fix-dist-for-vercel.js` exists:** Vercel's static file hosting silently strips any directory literally named `node_modules` from what it serves — at *any* depth. Expo's web export puts bundled font files at `dist/assets/node_modules/...` (it mirrors each font's real `require()` path from `node_modules`). Without the fix, every font 404s in production, and since `app/_layout.tsx` does `if (!fontsLoaded) return null`, the entire site renders as a blank white page — indefinitely, since the fonts can never load. The script renames that folder to `dist/assets/fonts-cdn` and patches the one JS bundle that references it, then copies `vercel.json` into `dist/` (Vercel only reads `vercel.json` from the actual deploy target directory, not the project root, when you deploy a subfolder directly). **Always use `npm run deploy:web`** rather than calling `expo export` + `vercel deploy` by hand — skipping the fix script reproduces the blank-screen bug.

### iOS (App Store)

```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

Both commands run non-interactively today because EAS already has a stored distribution certificate, provisioning profile, and **App Store Connect API key** for this project (`eas.json` → `submit.production.ios`) — no Apple ID password or 2FA prompt needed from the machine running these commands. `eas build` uploads straight to Apple's TestFlight/App Store Connect processing queue; you still need to attach the processed build to a version and click "Submit for Review" by hand in App Store Connect (that step has no API).

### Android (Google Play)

```bash
eas build --platform android --profile production
```

Unlike iOS, there's **no `eas submit` step configured for Android** — `eas.json` references a `google-service-account.json` that does not exist in this repo (and shouldn't be committed if it ever is — see below). Even with one configured, Google requires the **first** release of a new app to be uploaded manually through the Play Console UI; the Play Developer API only works for *subsequent* releases on the same track. Current flow: `eas build` produces a `.aab`, download it from the EAS build page (or via `eas build:download`), then upload it by hand in Play Console → your testing track → Create new release.

Google also gates new personal developer accounts behind a mandatory **closed test**: at least 12 opted-in testers, for at least 14 continuous days, before Production access is granted — this is an account-level policy, not something in this codebase.

### Shared vs. platform-specific config

| | Shared | iOS-only | Android-only |
|---|---|---|---|
| Marketing version (`1.1.2` etc.) | `app.json` → `expo.version` | — | — |
| Build/version number | — | `buildNumber`, auto-incremented **remotely by EAS** on every build (`eas.json` → `cli.appVersionSource: "remote"`) | `versionCode`, same remote auto-increment, tracked independently per platform |
| App icon | `app.json` → `expo.icon` = `assets/icon.png` (this is what iOS uses directly) | uses the shared icon, no override | **overridden** by `expo.android.adaptiveIcon.foregroundImage` = `assets/adaptive-icon.png` — a *separate file* that must be kept in sync by hand (see "Known quirks") |
| Credentials | — | Distribution cert + provisioning profile + ASC API key, all stored server-side on EAS | Upload keystore, stored server-side on EAS |
| Submission | — | `eas submit` (automated) | Manual upload to Play Console |

Because `buildNumber`/`versionCode` are tracked independently per platform on EAS's servers (not read from `app.json`), building one platform never bumps or otherwise touches the other's counter — you can rebuild Android five times in a row and iOS's build number won't move, and vice versa.

---

## `play-store-assets/`

Generated, ready-to-upload Google Play submission material — not source code, but kept in the repo for convenience:

```
play-store-assets/
  icon-512.png                          Play Store listing icon (512×512)
  feature-graphic-1024x500.png          Play Store banner
  screenshots/                          Phone screenshots (1080×1920)
  screenshots-7in-tablet/                7" tablet screenshots (1200×1920)
  screenshots-10in-tablet/                10" tablet screenshots (1600×2560)
  thirumanthiram-*.aab                    Built Android App Bundles ready for manual Play Console upload
```

Screenshots were captured by driving the live web deployment with a headless browser at phone/tablet viewport sizes — the RN Web rendering is visually representative of the native apps since it's the same component tree.

---

## Environment variables & secrets

No environment variables are required for local dev or the web build — all content is bundled statically (see [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)).

`eas.json` contains non-secret identifiers needed for submission (`ascAppId`, `appleTeamId`, `sku`) plus one field that's personal rather than secret: `submit.production.ios.appleId`. That field is **redacted to a placeholder in this public repo**. If you're working from a fresh clone and need to run `eas submit` yourself, replace it with your own Apple ID email:

```json
"appleId": "your-apple-id@example.com"
```

`google-service-account.json` (referenced by `submit.production.android.serviceAccountKeyPath`) is a real Google Cloud service-account credential file — it is **not** committed and never should be. It isn't currently used (Android submission is manual today; see above), but if you set up automated Play Console submission in the future, keep that file local/untracked only.

`.gitignore` already excludes `node_modules/`, `.expo/`, `dist/`, `ios/`, `android/`, and common credential file extensions (`*.jks`, `*.p8`, `*.p12`, `*.key`, `*.mobileprovision`).

---

## Known quirks worth knowing about

- **`verse/[id]` is a tab, not a stack screen** (see Architecture notes above). React Navigation's tab navigator keeps exactly one persistent component instance per tab and only updates params on navigation — it never remounts on its own. Combined with the swipe-navigation feature's `useNativeDriver`-animated `Animated.View`, that reuse caused a real bug: the verse screen could render blank on iOS/Android (never on web, which has no native view layer) after being backgrounded and refocused a second time. The fix, in `app/(tabs)/verse/[id].tsx`, is `<SafeAreaView key={verseId} ...>` — keying the returned tree on the verse id forces React to fully unmount/remount it (fresh `Animated.View`, fresh `TamilVerseLines` measurement state) on every verse change, while leaving the tab architecture and tab-bar-stays-visible behavior untouched.

- **`assets/icon.png` vs `assets/adaptive-icon.png` are two independent files** that both need to show the same logo — Expo does not derive one from the other. `adaptive-icon.png` was, for a long time, still Expo's default placeholder template graphic (a gray guideline circle grid) rather than the real logo, which is why the Android app/Play Store icon didn't match what was submitted for iOS/the store listing. If you ever change the app icon, update **both** files.

- **`AudioPlayer.tsx`, `SpeechPlayer.tsx`, `useAudio.ts`, `useSpeech.ts` are dead code** — superseded by `VerseAudioPlayer.tsx`, which talks to `expo-av`/`expo-speech` directly. Nothing currently imports the old versions; they're safe to delete, just not yet cleaned up.

- **Deep links to `/verse/123` or `/tantra/1` 404 on a hard refresh** of the web deployment (in-app navigation works fine — this only affects directly loading or refreshing on that URL). Pre-existing limitation of the current Vercel routing config, not something this fix touches.

---

## Sources

- **Tamil text**: [Tamil Virtual University](https://www.tamilvu.org/library/l4100), Government of Tamil Nadu
- **Commentary reference**: T. Saravanan, *Thirumandhiram – Mudalaam Tandhiram*, 2020 ([kvnthirumoolar.com](https://kvnthirumoolar.com))
- **Original text**: Thirumoolar, c. 5th–8th century CE — public domain

See also [FUTURE_APP_STORE_DEPLOYMENT.md](FUTURE_APP_STORE_DEPLOYMENT.md) and [APP_STORE_READINESS_CHECKLIST.md](APP_STORE_READINESS_CHECKLIST.md) for the original pre-launch planning notes (some details in those predate the current live/submitted state described above).
