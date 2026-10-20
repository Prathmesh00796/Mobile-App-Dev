/**
 * Experiment E06 - theme.js
 * 
 * Step 41: Exporting shared constants: COLORS, SPACING, FONT_SIZES, and RADIUS.
 */

export const COLORS = {
  primary: '#2563EB',       // Main theme color - change to test Step 46
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',

  secondary: '#4F46E5',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',

  background: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceSubtle: '#F9FAFB',

  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  borderFocus: '#2563EB',
  divider: '#F3F4F6',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  xxl: 36,
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 20,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const THEME_PRESETS = {
  blue: {
    name: 'Classic Blue',
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryDark: '#1D4ED8',
  },
  emerald: {
    name: 'Emerald Green',
    primary: '#059669',
    primaryLight: '#D1FAE5',
    primaryDark: '#047857',
  },
  violet: {
    name: 'Royal Purple',
    primary: '#7C3AED',
    primaryLight: '#EDE9FE',
    primaryDark: '#6D28D9',
  },
  crimson: {
    name: 'Sunset Crimson',
    primary: '#E11D48',
    primaryLight: '#FFE4E6',
    primaryDark: '#BE123C',
  },
};

const theme = {
  COLORS,
  SPACING,
  FONT_SIZES,
  RADIUS,
  SHADOWS,
  THEME_PRESETS,
};

export default theme;
