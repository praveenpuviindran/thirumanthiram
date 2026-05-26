# Future App Store Deployment Guide

This app is built with Expo + EAS and is structurally ready for iOS App Store submission. This document explains the steps required when you are ready to publish.

---

## Current State

| Item | Status |
|------|--------|
| Expo SDK | 54 — current |
| Bundle ID | `com.praveenpuviindran.thirumanthiram` |
| `app.json` | Configured with iOS infoPlist, splash, icons |
| `eas.json` | development / preview / production profiles ready |
| EAS Project ID | ⚠️ Empty — run `eas init` to link |
| Apple Team ID | ⚠️ Empty — fill in `eas.json` submit section |
| App Store Connect App ID | ⚠️ Empty — fill in after creating app in ASC |
| App icons | ✅ Placeholder icons in `assets/` |
| Splash screen | ✅ Configured |
| Privacy policy | ⚠️ Required before submission |

---

## Prerequisites

1. **Apple Developer Program** membership ($99/year) at [developer.apple.com](https://developer.apple.com)
2. **EAS CLI** installed: `npm install -g eas-cli`
3. **Expo account** at [expo.dev](https://expo.dev)
4. **App Store Connect** app created at [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

---

## Step-by-Step: First iOS Build + Submission

### 1. Link to Expo cloud (one-time)

```bash
eas init
```

This sets `extra.eas.projectId` in `app.json`. Commit the updated file.

### 2. Configure signing

```bash
eas credentials
```

EAS can manage certificates and provisioning profiles automatically. Choose "Expo managed" when prompted.

### 3. Run a development build (test on device/simulator)

```bash
eas build --profile development --platform ios
```

This builds a `.ipa` you can run in the iOS Simulator or on a registered device without an App Store listing.

### 4. Run a preview build (internal distribution)

```bash
eas build --profile preview --platform ios
```

Share with testers via TestFlight or direct install. Does not require App Store Connect listing.

### 5. Run a production build

```bash
eas build --profile production --platform ios
```

This creates the final App Store `.ipa`. Takes 10–20 minutes on EAS servers.

### 6. Fill in `eas.json` submit section

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@email.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCDE12345",
      "language": "en-US",
      "releaseType": "AFTER_APPROVAL"
    }
  }
}
```

### 7. Submit to App Store

```bash
eas submit --platform ios --latest
```

This uploads the most recent production build to App Store Connect for review.

---

## Required App Store Assets (prepare before submission)

| Asset | Requirement |
|-------|-------------|
| App icon | 1024×1024 PNG, no alpha, no rounded corners (Apple adds rounding) |
| iPhone screenshots | At minimum: 6.5" (1284×2778 or 1242×2688) |
| iPad screenshots | 12.9" (2048×2732) — required if `supportsTablet: true` |
| App description | Plain text, up to 4000 characters |
| Keywords | Up to 100 characters total |
| Privacy policy URL | Public URL — required for any app |
| Support URL | Public URL |
| Category | Reference / Books |
| Age rating | 4+ (no objectionable content) |

---

## Privacy Policy (Required)

The app must have a privacy policy URL before Apple review. Minimum content:

- What data is collected (none from users in this app's current state)
- How favorites and settings are stored (locally on device via AsyncStorage, never transmitted)
- Contact information

A simple hosted HTML page or a GitHub Gist is sufficient.

---

## Known Items to Address Before Submission

1. **expo-av deprecation**: The `VerseAudioPlayer` component uses `Audio` from `expo-av`, which is deprecated in SDK 54 and removed in SDK 55. Migrate to `expo-audio` before the next SDK upgrade.

2. **App icon**: The current `assets/icon.png` is a placeholder. Replace with a production-quality 1024×1024 icon before submission.

3. **Privacy policy**: Host a privacy policy page and add its URL to the App Store listing and to `app.json` under `expo.ios.infoPlist` if required.

4. **EAS project ID**: Run `eas init` to link this project to your Expo account.

5. **Apple credentials**: Fill `appleTeamId` and `ascAppId` in `eas.json`.

---

## Web (Netlify)

The web version is independent of the iOS submission process. It will continue to work on Netlify regardless of App Store status:

```bash
npx expo export -p web    # builds to dist/
npx netlify deploy --prod --dir=dist
```

Current live URL: https://fantastic-frangipane-6466bf.netlify.app
