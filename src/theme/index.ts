import { palette, spacing, radius, typography, shadows, motion, gradients, trackTints } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    bg: string;
    bgElevated: string;
    bgMuted: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    textInverse: string;
    primary: string;
    primarySoft: string;
    primaryInk: string;
    secondary: string;
    secondarySoft: string;
    secondaryInk: string;
    gold: string;
    goldSoft: string;
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    review: string;
    reviewSoft: string;
    danger: string;
    dangerSoft: string;
    trackBgA: string;
    trackBgB: string;
    trackBgC: string;
  };
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
  motion: typeof motion;
  gradients: typeof gradients;
  trackTints: typeof trackTints;
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    bg: palette.neutral50,
    bgElevated: palette.neutral0,
    bgMuted: palette.neutral100,
    surface: palette.neutral0,
    surfaceAlt: palette.neutral100,
    border: palette.neutral200,
    borderStrong: palette.neutral300,
    text: palette.neutral900,
    textMuted: palette.neutral500,
    textInverse: palette.neutral0,
    primary: palette.primary500,
    primarySoft: palette.primary50,
    primaryInk: palette.primary800,
    secondary: palette.secondary500,
    secondarySoft: palette.secondary50,
    secondaryInk: palette.secondary800,
    gold: palette.gold400,
    goldSoft: palette.gold50,
    success: palette.success,
    successSoft: palette.successBg,
    warning: palette.warning,
    warningSoft: palette.warningBg,
    review: palette.review,
    reviewSoft: palette.reviewBg,
    danger: palette.danger,
    dangerSoft: palette.dangerBg,
    trackBgA: palette.secondary50,
    trackBgB: palette.primary50,
    trackBgC: palette.gold50,
  },
  spacing,
  radius,
  typography,
  shadows,
  motion,
  gradients,
  trackTints,
};

export const darkTheme: Theme = {
  ...lightTheme,
  mode: 'dark',
  colors: {
    ...lightTheme.colors,
    bg: '#0E1412',
    bgElevated: '#162220',
    bgMuted: '#1C2A27',
    surface: '#162220',
    surfaceAlt: '#1C2A27',
    border: '#263633',
    borderStrong: '#31423E',
    text: '#F4F1EB',
    textMuted: '#A5A39C',
    textInverse: '#0E1412',
    primarySoft: '#0F302A',
    secondarySoft: '#1A1840',
    goldSoft: '#3A2C04',
    successSoft: '#0F302A',
    warningSoft: '#3A2C04',
    reviewSoft: '#1A1840',
    dangerSoft: '#3A1818',
    trackBgA: '#1A1840',
    trackBgB: '#0F302A',
    trackBgC: '#3A2C04',
  },
};

export { palette, spacing, radius, typography, shadows, motion, gradients, trackTints };
