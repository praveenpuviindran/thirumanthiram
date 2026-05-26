// Thirumanthiram — Saffron & Ash color palette
// Inspired by Shaivite aesthetics: sacred fire, ash, deep night sky

export const Colors = {
  // Brand
  saffron:     '#D4700A',
  saffronLight:'#F0A030',
  saffronDark: '#9A4E00',
  ash:         '#C8C0B8',
  ashDark:     '#7A7060',
  sacred:      '#8B1A1A',  // deep kumkum red

  // Backgrounds
  bgDark:      '#0D0603',
  bgMid:       '#1A0E08',
  bgCard:      '#241610',
  bgCardLight: '#F5F0EB',
  bgLight:     '#FDF6EE',

  // Text
  textPrimary:  '#F5ECD8',
  textSecondary:'#B09878',
  textMuted:    '#705840',
  textOnLight:  '#1A0E08',
  textSubOnLight:'#5A3E28',

  // Accents
  gold:        '#C8A035',
  goldLight:   '#F0CC70',
  teal:        '#1A7878',
  purple:      '#6B3FA0',

  // System
  border:      '#3A2418',
  borderLight: '#E0D4C8',
  success:     '#3A7A3A',
  error:       '#8B1A1A',

  // Tantra colors (matched to data)
  tantraColors: [
    '#C8860A',
    '#7B4EA0',
    '#C0392B',
    '#1A6B8A',
    '#2E7D32',
    '#4A148C',
    '#BF360C',
    '#006064',
    '#827717',
  ],
} as const;

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

export const Radius = {
  sm:   8,
  md:   14,
  lg:   20,
  full: 999,
} as const;

export const FontSize = {
  xs:   12,
  sm:   14,
  md:   16,
  lg:   18,
  xl:   22,
  xxl:  28,
  hero: 36,
} as const;
