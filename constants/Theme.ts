import { useColorScheme } from 'react-native';
import { Colors } from './Colors';

export function useTheme() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  return {
    dark,
    bg:             dark ? Colors.bgDark       : Colors.bgLight,
    bgMid:          dark ? Colors.bgMid        : '#EDE4D8',
    bgCard:         dark ? Colors.bgCard       : Colors.bgCardLight,
    bgCardAlt:      dark ? '#1E1208'           : '#EAE0D4',
    text:           dark ? Colors.textPrimary  : Colors.textOnLight,
    textSub:        dark ? Colors.textSecondary: Colors.textSubOnLight,
    textMuted:      dark ? Colors.textMuted    : '#8A6A50',
    border:         dark ? Colors.border       : Colors.borderLight,
    saffron:        Colors.saffron,
    saffronLight:   Colors.saffronLight,
    gold:           Colors.gold,
    goldLight:      Colors.goldLight,
    sacred:         Colors.sacred,
  };
}
