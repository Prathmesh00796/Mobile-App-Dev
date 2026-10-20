/**
 * Experiment E06 - Centralized Theme File (Design Tokens)
 * 
 * Centralizes all visual styling tokens (Colors, Spacing, Typography, Radius)
 * so components remain decoupled from hard-coded values and follow the DRY principle.
 */

export const COLORS = {
  // Primary brand colors (Change this to test Step 46 across all screens)
  primary: '#2563EB',       // Royal Blue
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',

  // Secondary & Accents
  secondary: '#4F46E5',     // Indigo
  accent: '#F59E0B',        // Amber
  success: '#10B981',       // Emerald
  danger: '#EF4444',        // Red
  warning: '#F59E0B',

  // Neutrals / Backgrounds
  background: '#F3F4F6',    // Light cool gray screen background
  surface: '#FFFFFF',       // Card / modal white surface
  surfaceSubtle: '#F9FAFB', // Subtle row background

  // Text colors
  text: '#111827',          // Main dark body text
  textSecondary: '#4B5563', // Secondary subtitle/label text
  textMuted: '#9CA3AF',     // Placeholder & muted text
  textInverse: '#FFFFFF',   // Light text on dark/primary backgrounds

  // Borders & Dividers
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

// Theme presets to demonstrate live theme switching for Step 46
export type ThemePalette = typeof COLORS;

export const THEME_PRESETS: Record<string, { name: string; primary: string; primaryLight: string; primaryDark: string }> = {
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
};

export default theme;
