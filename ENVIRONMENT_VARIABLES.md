# Environment Variables

This app currently requires **no environment variables** for local development or web deployment.

All verse data is bundled as static TypeScript files in `data/`. There is no backend API, no authentication, and no external data fetching at runtime.

---

## Future Variables (when adding backend/cloud features)

If you add features that require environment variables, use Expo's built-in config system:

### 1. Create `.env` files (not committed)

```
.env.local          # local overrides
.env.development    # development defaults
.env.production     # production defaults
```

### 2. Reference in app.config.ts

```ts
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
```

### 3. Access in app code

```ts
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

### 4. For EAS builds, set in eas.json

```json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.yourapp.com"
      }
    }
  }
}
```

---

## Variables That Will Be Needed for App Store Submission

These are not environment variables but credentials required when running `eas submit`:

| Field | Where set | Purpose |
|-------|-----------|---------|
| `appleId` | `eas.json` submit section | Apple Developer account email |
| `appleTeamId` | `eas.json` or EAS dashboard | 10-character Team ID from developer.apple.com |
| `ascAppId` | `eas.json` or App Store Connect | Numeric App ID from App Store Connect |
| EAS Project ID | `app.json` extra.eas.projectId | Set automatically by `eas init` |

These should **not** be stored in source control once they contain real values. Use the EAS dashboard to manage secrets.
