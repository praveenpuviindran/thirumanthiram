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
  // H11 — dark-mode muted text. Measured WCAG 2.1 contrast (sRGB relative
  // luminance) against the surfaces this token actually renders on:
  //   was #705840 → bgCard #241610 = 2.64:1  (FAILS AA; needs 4.5:1)
  //   now #9C8065 → bgCard #241610 = 4.75:1  (passes AA)
  //                 bgMid  #1A0E08 = 5.12:1
  //                 bgDark #0D0603 = 5.45:1
  // Trade-off: this raises luminance app-wide and narrows the gap to
  // textSecondary (#B09878, 6.35:1 on bgCard). Needs visual sign-off.
  textMuted:    '#9C8065',
  textOnLight:  '#1A0E08',
  textSubOnLight:'#5A3E28',
  // H11 (cont'd) — light-mode muted text. This token is consumed at two call
  // sites with two different surfaces behind it, so both were checked:
  //   was #8A6A50 → bgCardLight  #F5F0EB (Theme.ts textMuted)       = 4.36:1 (FAILS AA)
  //                → tabbar bg   #EDE4D8 (_layout.tsx inactive tab) = 3.92:1 (FAILS AA)
  //   now #7C6048 → bgCardLight  #F5F0EB                            = 5.12:1 (passes AA)
  //                → tabbar bg   #EDE4D8                            = 4.61:1 (passes AA)
  // One darkened value (same hue, lower lightness) clears 4.5:1 on both
  // surfaces — the tab bar background is the tighter constraint.
  textMutedOnLight: '#7C6048',

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
