export const theme = {
  colors: {
    primary: '#4F46E5', // Indigo
    primaryDark: '#3730A3',
    primaryLight: '#818CF8',
    secondary: '#06B6D4', // Cyan / Teal
    accent: '#F59E0B', // Amber
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    white: '#FFFFFF',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    headerBg: '#0F172A',
    tabBarBg: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    full: 9999,
  },
  typography: {
    small: 11,
    body: 13,
    subheading: 15,
    heading: 18,
    title: 22,
    hero: 26,
  },
};

export type Theme = typeof theme;
