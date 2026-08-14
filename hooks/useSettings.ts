// Re-export shim. The implementation moved to contexts/SettingsContext.tsx so
// all existing import sites — including settings.tsx's
// `ReturnType<typeof useSettings>['settings']` type reference — keep working
// with zero edits.
export {
  useSettings,
  SettingsProvider,
  FONT_SIZE_DEFAULT,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
} from '../contexts/SettingsContext';
export type { AppSettings, SettingsValue } from '../contexts/SettingsContext';
