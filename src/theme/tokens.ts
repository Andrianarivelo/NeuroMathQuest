/**
 * Design tokens for NeuroMath Quest.
 *
 * Original palette: a bright, educational green-teal primary for progress, a
 * rich indigo-purple secondary for exploration, and an amber-gold accent for
 * rewards. Neutrals are slightly warm so the UI never feels clinical.
 */

export const palette = {
  // Brand
  primary50:  '#E6F8F2',
  primary100: '#C9F0E3',
  primary200: '#8FE0C5',
  primary300: '#58CCA7',
  primary400: '#2CB58A',
  primary500: '#0E9E74',
  primary600: '#0C8661',
  primary700: '#0A6B4E',
  primary800: '#074F39',
  primary900: '#053E2D',

  secondary50:  '#EEECFE',
  secondary100: '#D9D4FC',
  secondary200: '#B5ABF9',
  secondary300: '#8F80F4',
  secondary400: '#6E5CEB',
  secondary500: '#5741D9',
  secondary600: '#4530B8',
  secondary700: '#362690',
  secondary800: '#261B68',
  secondary900: '#181042',

  gold50:  '#FFF8E1',
  gold100: '#FFE9A6',
  gold200: '#FFD866',
  gold300: '#FFC531',
  gold400: '#F2AE09',
  gold500: '#D18C00',

  // Semantics
  success: '#0E9E74',
  successBg: '#E6F8F2',
  warning: '#E08A00',
  warningBg: '#FFF4DA',
  review:  '#4F46E5',
  reviewBg: '#EEECFE',
  danger:  '#D94A4A',
  dangerBg: '#FDECEC',

  // Neutrals (warm)
  neutral0:   '#FFFFFF',
  neutral50:  '#FAF9F7',
  neutral100: '#F3F1ED',
  neutral200: '#E7E3DC',
  neutral300: '#D2CDC4',
  neutral400: '#A8A399',
  neutral500: '#7A7670',
  neutral600: '#555149',
  neutral700: '#3A3730',
  neutral800: '#25231E',
  neutral900: '#151410',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
  huge: 56,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800' as const, letterSpacing: -0.4 },
  title:   { fontSize: 24, lineHeight: 30, fontWeight: '800' as const, letterSpacing: -0.2 },
  h2:      { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  h3:      { fontSize: 17, lineHeight: 22, fontWeight: '700' as const },
  body:    { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '700' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  tiny:    { fontSize: 11, lineHeight: 14, fontWeight: '700' as const, letterSpacing: 0.4 },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0B1F1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0B1F1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0B1F1A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 9,
  },
} as const;

export const motion = {
  fast: 150,
  base: 240,
  slow: 420,
  celebrate: 780,
} as const;

export const gradients = {
  primary: ['#14B88A', '#0A6B4E'] as [string, string],
  secondary: ['#8F80F4', '#4530B8'] as [string, string],
  gold: ['#FFD866', '#F2AE09'] as [string, string],
  sky: ['#D9E9FF', '#A7C7FF'] as [string, string],
  hero: ['#14B88A', '#4F46E5'] as [string, string],
  chestClosed: ['#8F7A44', '#54421F'] as [string, string],
  chestOpen:  ['#FFE18A', '#F2AE09'] as [string, string],
} as const;

export const trackTints = {
  neuroscience: { bg: '#EEECFE', fg: '#4530B8', grad: ['#B5ABF9', '#4530B8'] as [string, string] },
  math:         { bg: '#E6F8F2', fg: '#0A6B4E', grad: ['#58CCA7', '#0A6B4E'] as [string, string] },
  compneuro:    { bg: '#FFF4DA', fg: '#8A5A00', grad: ['#FFD866', '#C47A00'] as [string, string] },
} as const;
