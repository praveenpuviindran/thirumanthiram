# Privacy Policy — Investigation & Draft

Status: DRAFT for owner review. `app/privacy.tsx` was NOT edited — this file only.
Investigation date: 2026-08-13.

## 1. Method

Exhaustive grep across the whole repo (excluding `node_modules`) for every
outbound-network primitive and every on-device persistence call:
`fetch(`, `axios`, `XMLHttpRequest`, `Linking.openURL`, `WebView`, `mailto:`,
`AsyncStorage.`, `SecureStore`, `expo-file-system`/`FileSystem.`, `expo-av`/
`expo-audio`/`Audio.Sound`, remote `Image`/`uri:` sources, and
`package.json` dependencies for analytics/crash/ad SDKs (Sentry, Firebase,
Amplitude, Mixpanel, Segment, Crashlytics, Bugsnag, PostHog, App Tracking
Transparency, etc.). Every hit below was opened and read in context — not just
grep-matched.

## 2. Evidence table

| # | What | Sent to / Stored where | Trigger | PII? |
|---|------|------------------------|---------|------|
| 1 | App-Store version lookup — `fetch('https://itunes.apple.com/lookup?bundleId=com.praveenpuviindran.thirumanthiram&country=us')` | Apple (`itunes.apple.com`), third-party server | Automatically, on every iOS app launch (not Android/web) | Yes — any HTTP request necessarily exposes the device's IP address to the destination server (here, Apple) |
| 2 | Verse audio playback — `Audio.Sound.createAsync({ uri: audioUrl })` where `audioUrl` is a `kvnthirumoolar.com` MP3 URL | `kvnthirumoolar.com` (WordPress-hosted media), third-party server. 1,811 of the 1,842+ verses have a remote `audioUrl` (`grep -c audioUrl data/*.ts` = 1,812 incl. one interface declaration) | User taps the "Listen" button on a verse that has a recording | Yes — same reasoning: the request leaks the device's IP to that third-party host. No account/identifier is sent, but IP is inherently exposed by HTTP |
| 3 | Verses without a hosted recording fall back to `expo-speech` TTS (`Speech.speak(...)`, `components/ui/VerseAudioPlayer.tsx:117`) | On-device (iOS `AVSpeechSynthesizer` / Android `TextToSpeech` / browser `speechSynthesis`) | User taps "Listen" on a verse with no `audioUrl` | No app-level network call. (Some OS/browser TTS engines may use cloud voices, but that is OS-level behavior outside this app's control, not something the app sends) |
| 4 | Feedback form — composes `mailto:${FEEDBACK_EMAIL}?subject=...&body=...` containing the user's typed name (optional) and message (`app/(tabs)/verse/[id].tsx:226-230`) | Opens the user's own configured email client, addressed to `thirumanthiram2026@gmail.com` | User fills in the Feedback tab on a verse and taps send | The content (name + message) is whatever the user chooses to type; it is sent via the user's own email client/account, not by the app's servers. The app itself does not transmit or store this — it only builds a `mailto:` link |
| 5 | Settings-screen "Email" row — `Linking.openURL('mailto:thirumanthiram2026@gmail.com')` (`app/(tabs)/settings.tsx:178`) | Opens user's email client, no body prefilled | User taps Email under Feedback in Settings | Same as #4 — user-initiated, via their own client |
| 6 | External reference links — `kvnthirumoolar.com`, `kvnthirumoolar.com/classes/`, `babajiskriyayoga.net`, `babajiskriyayogastore.in`, `hinduismtoday.com`, `tirumandiram.net` (`app/(tabs)/settings.tsx:221-376`) | Opens the device's default browser to a third-party site | User explicitly taps a "Sources & References" link | Standard browser-navigation IP exposure to whichever third party, same as clicking any link anywhere |
| 7 | Favorites | On-device only: `AsyncStorage` key `@thirumanthiram_favorites` (`contexts/FavoritesContext.tsx:28`) | User taps the star icon on a verse | No — device-local, never transmitted |
| 8 | Settings (font size, theme, show-English, show-transliteration) | On-device only: `AsyncStorage` key `@thirumanthiram_settings` (`contexts/SettingsContext.tsx:48`) | User changes a setting | No — device-local, never transmitted |
| 9 | User-authored verse notes | On-device only: `AsyncStorage` key `verse_note_<verseId>` per verse (`app/(tabs)/verse/[id].tsx:65,73,99`) | User types in the Notes tab of a verse (debounced 400 ms save) | No — device-local, never transmitted. This is free-text the user writes and can be personal, so it should be named explicitly in the policy even though it doesn't leave the device |
| 10 | Data-migration version marker | On-device only: `AsyncStorage` key `thirumanthiram_data_version` (`hooks/useDataMigration.ts`, `constants/DataVersion.ts`) | App launch, compares stored vs. current data version | No |
| 11 | Dismissed-update-version marker | On-device only: `AsyncStorage` key `update_check_dismissed_version` (`hooks/useAppUpdateCheck.ts:8,32,42,47`) | User dismisses or accepts the "Update Available" alert | No |
| 12 | Analytics / ads / crash reporting SDKs | None found. `package.json` dependencies checked line by line — no Sentry, Firebase, Amplitude, Mixpanel, Segment, Crashlytics, Bugsnag, PostHog, or App Tracking Transparency entries. No `WebView` usage anywhere in the repo | N/A | N/A — this part of the existing claim is TRUE and should be kept |

No `XMLHttpRequest`, `axios`, remote `<Image>`/`uri:` sources, `expo-file-system`, or `SecureStore` usage exists anywhere in the app code (only in `node_modules` internals, which are not app-authored network calls).

## 3. False or incomplete claims in the current `app/privacy.tsx`

1. **"The app does not collect, transmit, or store any personal data on any server."** — False as worded. The app makes outbound HTTP requests (App Store version check, audio streaming) that transmit the device's IP address to Apple and to `kvnthirumoolar.com`. No app-controlled server stores this, but the claim as written ("does not... transmit... any personal data") is too broad — IP address is personal data under most definitions (e.g., GDPR), even if the app has no backend that retains it.
2. **"Data Stored On Your Device" section lists only "favourites and app settings."** — Incomplete. It omits **verse notes** (`verse_note_<id>`), which is free-text the user writes and is the most personally sensitive on-device data in the app.
3. **"Permissions" section says internet access is used "solely to load verse audio recordings and to check for content updates."** — This line is actually accurate (it correctly names both audio and the update check) and can be kept, but it currently contradicts section 2's blanket "no transmission" claim. The two sections need to agree with each other.
4. **"Third Parties" section says "no third-party analytics, advertising, or tracking services."** — True and verifiable (see evidence #12), but it doesn't mention that the app does contact two third-party *hosts* (Apple for update checks, `kvnthirumoolar.com` for audio) even though it's not "analytics/advertising/tracking." This is a different category (content delivery) and should be named separately so the policy isn't misread as "we never contact anyone."
5. The policy never mentions the **feedback form** or its `mailto:` behavior, and never mentions that clicking source-reference links opens third-party websites.

## 4. Proposed replacement copy

Section titles unchanged where accurate; body text replaced where noted.

---

**Overview** *(unchanged)*
> Thirumanthiram is a reading app for the sacred Tamil text of the same name. This policy explains what information the app does — and does not — collect.

**Data We Collect** *(replace)*
> The app has no user accounts, no analytics, and no advertising or tracking SDKs. We do not operate any server that receives or stores your data. The app does make a small number of outbound network requests as part of normal use — to check for app updates and to stream verse audio — and, like any internet connection, those requests expose your device's IP address to the third party being contacted (Apple, or the audio host). See "Permissions" and "Third Parties" below for details. We do not collect, and have no way to see, anything you type into the app.

**Data Stored On Your Device** *(replace)*
> Your favourites, app settings (font size, theme, language display options), and any notes you write on a verse are saved locally on your device using standard on-device storage. This information never leaves your device and is not accessible to us or to any third party.

**Permissions** *(replace)*
> The app requests internet access for three purposes: (1) streaming verse audio recordings hosted at kvnthirumoolar.com, (2) checking the App Store for a newer app version on iOS launch, and (3) opening links you tap — such as source references or the feedback email — in your browser or email app. No other device permissions are used.

**Third Parties** *(replace)*
> The app does not integrate any third-party analytics, advertising, or tracking services. It does contact two third-party services as part of normal functionality: Apple's App Store (to check for updates, iOS only) and kvnthirumoolar.com (to stream verse audio). Each such request is subject to that third party's own privacy practices. Tapping a "Sources & References" link or the feedback email address opens your browser or email app and is entirely under your control.

**Feedback** *(new section)*
> The Feedback tab and the Settings "Email" link open your device's own email app, pre-addressed to thirumanthiram2026@gmail.com. Anything you choose to write — including your name if you provide it — is sent from your own email account, the same as composing any other email. The app itself does not transmit or store this content.

**Children's Privacy** *(unchanged)*
> The app contains no objectionable content and does not knowingly collect information from anyone, including children.

**Changes to This Policy** *(unchanged)*

**Contact** *(unchanged)*

---

## 5. Notes for the owner

- The "1,811 vs 1,842" figure: `grep -c audioUrl` across `data/verses_t*.ts` totals 1,812 matches, one of which is the `audioUrl?: string` interface declaration in `data/thirumanthiram.ts`'s type (not a data row) — actual verse entries with a real `audioUrl` value are effectively all `kvnthirumoolar.com` links per the task brief's count of 1,811; not independently re-verified row-by-row beyond the grep count, so treat 1,811 as the audit's number, not something newly derived here.
- If the owner later swaps any audio URLs to a different CDN or adds analytics, this document (and the shipped policy) will need another pass — this draft is only accurate as of the current codebase state.
