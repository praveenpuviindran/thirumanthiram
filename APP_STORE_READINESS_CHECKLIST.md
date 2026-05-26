# App Store Readiness Checklist

Track progress toward iOS App Store submission.

---

## Architecture (Done ✅)

- [x] Expo SDK 54 + React Native — no conversion needed
- [x] expo-router v6 file-based routing — mobile-first navigation
- [x] AsyncStorage for all persistent state (no localStorage)
- [x] No browser-only APIs in core logic
- [x] No hardcoded localhost URLs
- [x] No web-only dependencies in the critical path
- [x] Responsive, mobile-first layouts using React Native StyleSheet
- [x] Portrait orientation configured
- [x] Dark/light mode via useColorScheme
- [x] Tamil + Lora fonts loaded with expo-font
- [x] Splash screen configured
- [x] Tab navigation + stack navigation set up correctly

---

## Configuration (Partially Done)

- [x] `app.json` — bundle ID, name, slug, orientation, icons, splash
- [x] `app.json` — iOS infoPlist with permission strings
- [x] `app.json` — `ITSAppUsesNonExemptEncryption: false`
- [x] `eas.json` — development, preview, production profiles
- [x] `eas.json` — submit section with appleId
- [ ] **`app.json` — set real EAS project ID** (`eas init`)
- [ ] **`eas.json` — fill `appleTeamId`** (from developer.apple.com)
- [ ] **`eas.json` — fill `ascAppId`** (from App Store Connect)

---

## Assets

- [x] `assets/icon.png` — placeholder exists (1024×1024 required for production)
- [x] `assets/splash-icon.png` — placeholder exists
- [x] `assets/adaptive-icon.png` — placeholder exists (Android)
- [x] `assets/favicon.png` — web favicon
- [ ] **Replace icon with final production design** (1024×1024, no alpha)
- [ ] **App Store screenshots** — iPhone 6.5" required; iPad 12.9" required
- [ ] **App preview video** — optional but recommended

---

## Content

- [x] Verse data — Tamil text, transliteration, English translation
- [x] 9 tantras + Paayiram (Kadavul Vaazhththu)
- [x] Sources & References in Settings screen
- [ ] **Verse completeness review** — expert check of Tamil text accuracy
- [ ] **Translation review** — expert review of English translations
- [ ] **Transliteration review** — auto-generated, needs expert spot-check

---

## App Store Submission Requirements

- [ ] **Apple Developer Program** enrollment ($99/year)
- [ ] **Expo account** created and `eas init` run
- [ ] **App created in App Store Connect**
- [ ] **Privacy Policy** — hosted URL required
- [ ] **Support URL** — public URL required
- [ ] **App description** written (up to 4000 chars)
- [ ] **Keywords** chosen (100 chars max)
- [ ] **Category** selected: Books or Reference
- [ ] **Age rating** confirmed: 4+
- [ ] **Screenshots** prepared for all required device sizes

---

## Known Technical Debt (Before Next SDK Upgrade)

- [ ] **Migrate `expo-av` → `expo-audio`** in `VerseAudioPlayer.tsx` (deprecated in SDK 54)
- [ ] **Remove dead files** `App.tsx` and `index.ts` (never loaded; `main` points to `expo-router/entry`)
- [ ] **Add audio recordings** — verse-specific `.m4a` files in `assets/audio/` with `audioUrl` set in data

---

## Future Features (Post-Launch)

- [ ] Tamil audio recordings for all 3,047 verses
- [ ] Daily verse notification (push notification permission needed)
- [ ] iCloud sync for favorites (requires CloudKit entitlement)
- [ ] Offline-first confirmation (already works — all data is local)
- [ ] Search improvements — fuzzy matching, romanized input
- [ ] Share verse as image
- [ ] Font size accessibility (partially implemented in settings)
